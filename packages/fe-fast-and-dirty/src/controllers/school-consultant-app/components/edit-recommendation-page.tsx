import * as React from "react";
import { RecommendationInput } from "@school-consultant/common";
import { z } from "zod";
import { ISaveRecommendation } from "../../../ports/save-recommendation";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import Chip from "@mui/material/Chip";
import Stack from "@mui/system/Stack";
import Button from "@mui/material/Button";

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

export type EditRecommendationPageParams = {
  child: string;
  saveRecommendation: ISaveRecommendation;
  recommendation?: string;
  backCallback: () => void;
};

export const EditRecommendationPage = (
  params: EditRecommendationPageParams,
) => {
  const ref = React.useRef();
  const [interests, setInterests] = React.useState([]);

  React.useEffect(() => {
    if (params.recommendation === undefined) {
      return;
    }
  }, [])

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
      await params.saveRecommendation.execute(params.child, recommendationInput);
    } catch (exc) {
      console.log(e, exc);
      alert("something is wrong");
    }
  };
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
          />
          <Autocomplete
            multiple
            id="interests"
            options={commonInterests}
            defaultValue={[]}
            onChange={(_, value) => setInterests(value)}
            freeSolo
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
            multiline
            rows={4}
          />
          <h2>Address</h2>
          <TextField
            name="zip"
            type="text"
            placeholder="Zip"
            margin="none"
            variant="filled"
            hiddenLabel
            size="small"
          />
          <TextField
            name="street"
            type="text"
            placeholder="Street address"
            margin="none"
            variant="filled"
            hiddenLabel
            size="small"
          />
          <TextField
            name="city"
            type="text"
            placeholder="City"
            margin="none"
            variant="filled"
            hiddenLabel
            size="small"
          />
          <TextField
            name="state"
            type="text"
            placeholder="State"
            margin="none"
            variant="filled"
            hiddenLabel
            size="small"
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
