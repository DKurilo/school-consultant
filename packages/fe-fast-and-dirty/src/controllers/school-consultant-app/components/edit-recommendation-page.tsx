import * as React from "react";
import { RecommendationInput } from "@school-consultant/common";
import { ISaveRecommendation } from "../../../ports/save-recommendation";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import Chip from "@mui/material/Chip";
import Stack from "@mui/system/Stack";
import Button from "@mui/material/Button";
import { IGetRecommendation } from "../../../ports/get-recommendation";
import { IBuildRecommendation } from "../../../ports/build-recommendation";

const commonInterests = [
  "STEM",
  "Math",
  "Science",
  "Computer Science",
  "Physical Education",
  "Theater",
  "Art",
];

const changeInputHandlerFactory =
  (setter: (val: string) => void) =>
  (event: React.ChangeEvent<HTMLInputElement>) => {
    setter(event.target.value);
  };

export type EditRecommendationPageParams = {
  child: string;
  saveRecommendation: ISaveRecommendation;
  getRecommendation: IGetRecommendation;
  buildRecommendation: IBuildRecommendation;
  recommendation?: string;
  backCallback: () => void;
};

export const EditRecommendationPage = (
  params: EditRecommendationPageParams,
) => {
  const [showBuild, setShowBuild] = React.useState(
    params.recommendation !== undefined,
  );
  const [title, setTitle] = React.useState<string>("");
  const [interests, setInterests] = React.useState([]);
  const [additionalInfo, setAdditionalInfo] = React.useState<
    string
  >("");
  const [zip, setZip] = React.useState<string>("");
  const [street, setStreet] = React.useState<string>("");
  const [city, setCity] = React.useState<string>("");
  const [state, setState] = React.useState<string>("");

  React.useEffect(() => {
    if (params.recommendation === undefined) {
      return;
    }
    const doer = async () => {
      const recommendation = await params.getRecommendation.execute(
        params.child,
        params.recommendation,
      );
      setTitle(recommendation.title);
      setInterests(recommendation.interests);
      setAdditionalInfo(recommendation.additionalInfo);
      if ("zip" in recommendation.address) {
        setZip(recommendation.address.zip);
        setStreet(recommendation.address.street);
        setCity(recommendation.address.city);
        setState(recommendation.address.state);
      } else {
        setZip("");
        setStreet("");
        setCity("");
        setState("");
      }
      if (recommendation.status === "new") {
        setShowBuild(true);
      } else {
        setShowBuild(false);
      }
    };

    doer();
  }, []);

  const handleSaveRecommendation = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    const recommendationInput: RecommendationInput = {
      title,
      interests,
      additionalInfo,
      address: {
        zip,
        street,
        city,
        state,
      },
    };
    try {
      await params.saveRecommendation.execute(
        params.child,
        recommendationInput,
      );
      setShowBuild(true);
    } catch (exc) {
      console.log(e, exc);
      alert("something is wrong");
    }
  };

  const handleBuildRecommendation = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    await params.buildRecommendation.execute(params.child, title);
    params.backCallback();
  };

  const changeTitleHandler = React.useMemo(
    () => changeInputHandlerFactory(setTitle),
    [setTitle],
  );
  const changeAdditionalInfoHandler = React.useMemo(
    () => changeInputHandlerFactory(setAdditionalInfo),
    [setAdditionalInfo],
  );
  const changeZipHandler = React.useMemo(
    () => changeInputHandlerFactory(setZip),
    [setZip],
  );
  const changeStreetHandler = React.useMemo(
    () => changeInputHandlerFactory(setStreet),
    [setStreet],
  );
  const changeCityHandler = React.useMemo(
    () => changeInputHandlerFactory(setCity),
    [setCity],
  );
  const changeStateHandler = React.useMemo(
    () => changeInputHandlerFactory(setState),
    [setState],
  );

  return (
    <div className="editrecommendation-page">
      <div onClick={params.backCallback}>
        <Button
          variant="contained"
          type="button"
          size="small"
          onClick={params.backCallback}
        >
          Back
        </Button>
      </div>
      <Stack direction="column" spacing={2}>
        <TextField
          name="title"
          placeholder="Title"
          variant="filled"
          value={title}
          onChange={changeTitleHandler}
          disabled={params.recommendation !== undefined}
          label="Unique name for recommendation that you will see on the main page"
        />
        <Autocomplete
          multiple
          id="interests"
          options={commonInterests}
          onChange={(_, value) => setInterests(value)}
          freeSolo
          value={interests}
          renderTags={(value: readonly string[], getTagProps) =>
            value.map((option: string, index: number) => {
              const { key, ...tagProps } = getTagProps({ index });
              return (
                <Chip
                  variant="outlined"
                  label={option}
                  key={key}
                  {...tagProps}
                />
              );
            })
          }
          renderInput={(params) => (
            <TextField
              name="interests"
              {...params}
              variant="filled"
              placeholder="Child's interests"
              label="Child's interests"
              helperText="Select from list or type interest and press enter to add your interest"
            />
          )}
        />
        <TextField
          name="additionalInfo"
          label="Anything you want AI know about your child"
          helperText="Can be additional information, some requirements and so on"
          placeholder="Enter additional info"
          value={additionalInfo}
          multiline
          rows={4}
          onChange={changeAdditionalInfoHandler}
        />
        <h2>Address</h2>
        <TextField
          name="zip"
          type="text"
          value={zip}
          placeholder="Zip"
          margin="none"
          variant="filled"
          hiddenLabel
          size="small"
          onChange={changeZipHandler}
        />
        <TextField
          name="street"
          type="text"
          value={street}
          placeholder="Street address"
          margin="none"
          variant="filled"
          hiddenLabel
          size="small"
          onChange={changeStreetHandler}
        />
        <TextField
          name="city"
          type="text"
          value={city}
          placeholder="City"
          margin="none"
          variant="filled"
          hiddenLabel
          size="small"
          onChange={changeCityHandler}
        />
        <TextField
          name="state"
          type="text"
          value={state}
          placeholder="State"
          margin="none"
          variant="filled"
          hiddenLabel
          size="small"
          onChange={changeStateHandler}
        />
        <Stack direction="row">
          <Button
            variant="contained"
            id="save-recommendation"
            type="button"
            onClick={handleSaveRecommendation}
          >
            Save Recommendation
          </Button>
          {showBuild && (
            <Button
              variant="contained"
              id="build-recommendation"
              type="button"
              onClick={handleBuildRecommendation}
            >
              Build Recommendation
            </Button>
          )}
        </Stack>
      </Stack>
    </div>
  );
};
