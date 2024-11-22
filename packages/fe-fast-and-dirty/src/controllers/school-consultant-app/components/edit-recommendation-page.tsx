import * as React from "react";
import { RecommendationInput } from "@school-consultant/common";
import { z } from "zod";
import { ISaveRecommendation } from "../../../ports/save-recommendation";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import Chip from "@mui/material/Chip";
import Stack from "@mui/system/Stack";
import Button from "@mui/material/Button";
import { IGetRecommendation } from "../../../ports/get-recommendation";

const ValueParser = z.object({ value: z.string() });

const FormDataParser = z.object({
  target: z.object({
    title: ValueParser,
    additionalInfo: ValueParser,
    zip: ValueParser,
    street: ValueParser,
    city: ValueParser,
    state: ValueParser,
  }),
});

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
  recommendation?: string;
  backCallback: () => void;
};

export const EditRecommendationPage = (
  params: EditRecommendationPageParams,
) => {
  const ref = React.useRef();
  const [title, setTitle] = React.useState<string | undefined>(undefined);
  const [interests, setInterests] = React.useState([]);
  const [additionalInfo, setAdditionalInfo] = React.useState<
    string | undefined
  >(undefined);
  const [zip, setZip] = React.useState<string | undefined>(undefined);
  const [street, setStreet] = React.useState<string | undefined>(undefined);
  const [city, setCity] = React.useState<string | undefined>(undefined);
  const [state, setState] = React.useState<string | undefined>(undefined);

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
      setZip(recommendation.address.zip);
      setStreet(recommendation.address.street);
      setCity(recommendation.address.city);
      setState(recommendation.address.state);
    };

    doer();
  }, []);

  const handleSaveRecommendation = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    const data = FormDataParser.parse(e);
    const recommendationInput: RecommendationInput = {
      title: data.target.title.value,
      interests,
      additionalInfo: data.target.additionalInfo.value,
      address: {
        zip: data.target.zip.value,
        street: data.target.street.value,
        city: data.target.city.value,
        state: data.target.state.value,
      },
    };
    try {
      await params.saveRecommendation.execute(
        params.child,
        recommendationInput,
      );
    } catch (exc) {
      console.log(e, exc);
      alert("something is wrong");
    }
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
      <div onClick={params.backCallback}>Back</div>
      <form ref={ref} onSubmit={handleSaveRecommendation}>
        <Stack direction="column">
          <TextField
            name="title"
            type="text"
            placeholder="Title"
            margin="none"
            variant="filled"
            hiddenLabel
            size="small"
            value={title}
            onChange={changeTitleHandler}
            disabled={params.recommendation !== undefined}
          />
          <Autocomplete
            multiple
            id="interests"
            options={commonInterests}
            defaultValue={[]}
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
              />
            )}
          />
          <TextField
            name="additionalInfo"
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
            <Button variant="contained" id="save-recommendation" type="submit">
              Save Recommendation
            </Button>
            <Button variant="contained" id="build-recommendation" type="submit">
              Build Recommendation
            </Button>
          </Stack>
        </Stack>
      </form>
    </div>
  );
};
