import * as React from "react";
import { IGetRecommendation } from "../../../ports/get-recommendation";
import { Address, School } from "@school-consultant/common";
import Slider from "@mui/material/Slider";
import Box from "@mui/material/Box";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";

const buildAddress = (addr: Address): string => {
  if ("addr" in addr) {
    return `${addr.addr}`;
  }
  if ("zip" in addr) {
    return `${addr.street}, ${addr.city}, ${addr.state}, ${addr.zip}`;
  }
  return "";
};

export type ViewRecommendationPageParams = {
  child: string;
  getRecommendation: IGetRecommendation;
  recommendation?: string;
  backCallback: () => void;
};

export const ViewRecommendationPage = (
  params: ViewRecommendationPageParams,
) => {
  const [title, setTitle] = React.useState("");
  const [readOnlyKey, setReadOnlyKey] = React.useState("");
  const [interests, setInterests] = React.useState<string[]>([]);
  const [additionalInfo, setAdditionalInfo] = React.useState("");
  const [address, setAddress] = React.useState("");
  const [rankTimeCoef, setRankTimeCoef] = React.useState(500);
  const [useWalk, setUseWalk] = React.useState(true);
  const [useCar, setUseCar] = React.useState(true);
  const [useTransport, setUseTransport] = React.useState(true);
  const [schools, setSchools] = React.useState<School[]>([]);
  const [originalSchools, setOriginalSchools] = React.useState<School[]>([]);

  React.useEffect(() => {
    const getTime = (school: School) => {
      const times = [];
      if (useCar && school.carTime !== undefined) {
        times.push(school.carTime);
      }
      if (useWalk && school.walkTime !== undefined) {
        times.push(school.walkTime);
      }
      if (useTransport && school.transportTime !== undefined) {
        times.push(school.transportTime);
      }
      return Math.min(...times);
    };

    const timeSchools = [...originalSchools];
    timeSchools.sort((sa, sb) => {
      return getTime(sa) - getTime(sb);
    });
    const schoolTimeRanks = timeSchools.reduce<Record<string, number>>(
      (ranks, school, i) => {
        Object.assign(ranks, { [school.name]: i });
        return ranks;
      },
      {},
    );

    const newSchools = [...originalSchools];
    newSchools.sort((sa, sb) => {
      const ka =
        schoolTimeRanks[sa.name] * rankTimeCoef +
        sa.rank * (1000 - rankTimeCoef);
      const kb =
        schoolTimeRanks[sb.name] * rankTimeCoef +
        sb.rank * (1000 - rankTimeCoef);
      return ka - kb;
    });

    setSchools(newSchools);
  }, [
    useCar,
    useWalk,
    useTransport,
    rankTimeCoef,
    originalSchools,
    setSchools,
  ]);

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
      setReadOnlyKey(recommendation.readOnlyKey);
      setInterests(recommendation.interests);
      setAdditionalInfo(recommendation.additionalInfo);
      setAddress(buildAddress(recommendation.address));
      setOriginalSchools(recommendation.schools);
    };
    doer();
  }, []);

  const handleRankTimeCoefChange = (_: Event, newValue: number | number[]) => {
    setRankTimeCoef(newValue as number);
  };

  const handleUseWalkChange = (
    _: React.ChangeEvent<HTMLInputElement>,
    newValue: boolean,
  ) => {
    setUseWalk(newValue);
  };

  const handleUseTransportChange = (
    _: React.ChangeEvent<HTMLInputElement>,
    newValue: boolean,
  ) => {
    setUseTransport(newValue);
  };

  const handleUseCarChange = (
    _: React.ChangeEvent<HTMLInputElement>,
    newValue: boolean,
  ) => {
    setUseCar(newValue);
  };

  return (
    <div className="viewrecommendation-page">
      <div onClick={params.backCallback}>Back</div>
      <h1>{title}</h1>
      <h2>Sharebale link</h2>
      <p>{readOnlyKey}</p>
      <h2>Child's address</h2>
      <p>{address}</p>
      <h2>Child's interests</h2>
      <ul>
        {interests.map((interest, i) => (
          <li key={i}>{interest}</li>
        ))}
      </ul>
      <h2>Additional info</h2>
      {additionalInfo.split("\n").map((line, i) => (
        <p key={i}>{line}</p>
      ))}
      <h2>Schools</h2>
      <h3>Settings</h3>
      <Box maxWidth={"500px"}>
        <FormGroup>
          <FormControlLabel
            control={
              <Slider
                min={0}
                max={1000}
                value={rankTimeCoef}
                onChange={handleRankTimeCoefChange}
              ></Slider>
            }
            label="What is more important, rank is on the left, time is on the right"
          />
          <FormControlLabel
            control={
              <Switch
                checked={useTransport}
                onChange={handleUseTransportChange}
              />
            }
            label="I can use public Transport"
          />
          <FormControlLabel
            control={<Switch checked={useCar} onChange={handleUseCarChange} />}
            label="I can use a car"
          />
          <FormControlLabel
            control={
              <Switch checked={useWalk} onChange={handleUseWalkChange} />
            }
            label="I can walk to school"
          />
        </FormGroup>
      </Box>
      <h3>List</h3>
      <div>
        <div>
          <ul>
            {schools.map((school) => {
              return (
                <li key={school.name}>
                  <h4>{school.name}</h4>
                  <p>{school.description}</p>
                  <p>Rank: {school.rank}</p>
                  <p>
                    Car/Walk/Transport: {school.carTime}/{school.walkTime}/
                    {school.transportTime}
                  </p>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
};
