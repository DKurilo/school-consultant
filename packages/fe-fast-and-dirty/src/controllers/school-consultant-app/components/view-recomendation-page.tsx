import * as React from "react";
import { IGetRecommendation } from "../../../ports/get-recommendation";
import {
  Address,
  Coords,
  ReadOnlyRecommendation,
  Recommendation,
  School,
} from "@school-consultant/common";
import Slider from "@mui/material/Slider";
import Box from "@mui/material/Box";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";
import {
  AdvancedMarker,
  APIProvider,
  Map,
  MapCameraChangedEvent,
  MapCameraProps,
  Pin,
} from "@vis.gl/react-google-maps";
import "./styles/view-recommendation-page.css";
import Button from "@mui/material/Button";
import Markdown from "react-markdown";
import { IGetRoRecommendation } from "../../../ports/get-ro-recommendation";
import { CopyToClipboard } from "react-copy-to-clipboard";
import Stack from "@mui/material/Stack";
import Link from "@mui/material/Link";

const coordsToGoogleCoords = (coord: Coords): { lat: number; lng: number } => ({
  lat: coord.latitude,
  lng: coord.longitude,
});

const buildAddress = (addr: Address): string => {
  if ("addr" in addr) {
    return `${addr.addr}`;
  }
  if ("zip" in addr) {
    return `${addr.street}, ${addr.city}, ${addr.state}, ${addr.zip}`;
  }
  return "";
};

const readableTime = (secs: number): string => {
  const mins = Math.floor(secs / 60) % 60;
  const hrs = Math.floor(secs / 60 / 60);
  if (hrs > 0) {
    return `${hrs} h ${mins} min`;
  }
  return `${mins} min`;
};

const buildCamera = (coords: Coords): MapCameraProps => {
  return {
    center: { lat: coords.latitude, lng: coords.longitude },
    zoom: 10,
  };
};

export type ViewRecommendationPageParams =
  | {
      googleApiKey: string;
      child: string;
      getRecommendation: IGetRecommendation;
      recommendation: string;
      backCallback: () => void;
      baseUrl: string;
    }
  | {
      googleApiKey: string;
      roToken: string;
      getRoRecommendation: IGetRoRecommendation;
    };

export const ViewRecommendationPage = (
  params: ViewRecommendationPageParams,
) => {
  const [copied, setCopied] = React.useState(false);
  const [title, setTitle] = React.useState("");
  const [readOnlyKey, setReadOnlyKey] = React.useState("");
  const [interests, setInterests] = React.useState<string[]>([]);
  const [additionalInfo, setAdditionalInfo] = React.useState("");
  const [address, setAddress] = React.useState("");
  const [childCoords, setChildCoords] = React.useState<{
    lat: number;
    lng: number;
  }>({ lat: 0, lng: 0 });
  const [rankTimeCoef, setRankTimeCoef] = React.useState(500);
  const [useWalk, setUseWalk] = React.useState(true);
  const [useCar, setUseCar] = React.useState(true);
  const [useTransport, setUseTransport] = React.useState(true);
  const [schools, setSchools] = React.useState<School[]>([]);
  const [originalSchools, setOriginalSchools] = React.useState<School[]>([]);
  const [hoveredSchool, setHoveredShool] = React.useState<number | undefined>(
    undefined,
  );
  const [selectedSchool, setSelectedShool] = React.useState<number | undefined>(
    undefined,
  );
  const [expandedSchool, setExpandedShool] = React.useState<number | undefined>(
    undefined,
  );
  const [cameraProps, setCameraProps] = React.useState<MapCameraProps>({
    center: childCoords,
    zoom: 10,
  });

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
    setExpandedShool(undefined);
    setSelectedShool(undefined);
    setHoveredShool(undefined);
  }, [
    useCar,
    useWalk,
    useTransport,
    rankTimeCoef,
    originalSchools,
    setSchools,
  ]);

  React.useEffect(() => {
    const doer = async () => {
      const recommendation: Recommendation | ReadOnlyRecommendation =
        "recommendation" in params
          ? await params.getRecommendation.execute(
              params.child,
              params.recommendation,
            )
          : await params.getRoRecommendation.execute(params.roToken);
      setTitle(recommendation.title);
      setReadOnlyKey(recommendation.readOnlyKey);
      setInterests(recommendation.interests);
      setAdditionalInfo(recommendation.additionalInfo);
      setAddress(buildAddress(recommendation.address));
      setChildCoords(coordsToGoogleCoords(recommendation.address.coords));
      setOriginalSchools(recommendation.schools);
      setCameraProps(buildCamera(recommendation.address.coords));
    };
    doer();
  }, []);

  React.useEffect(() => {
    if (copied) {
      setTimeout(() => {
        setCopied(false);
      }, 3000);
    }
  }, [copied, setCopied]);

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

  const getPinColor = React.useCallback(
    (i: number): string => {
      if (selectedSchool === i) {
        return "#f28e2b";
      }
      if (hoveredSchool === i) {
        return "#a0cbe8";
      }
      return "#4e79a7";
    },
    [selectedSchool, hoveredSchool],
  );

  const handleCameraChange = React.useCallback(
    (ev: MapCameraChangedEvent) => {
      setCameraProps(ev.detail);
    },
    [setCameraProps],
  );

  return (
    <div className="viewrecommendation-page">
      {"backCallback" in params && (
        <div>
          <Button
            variant="contained"
            type="button"
            size="small"
            onClick={params.backCallback}
          >
            Back
          </Button>
        </div>
      )}
      <h1>{title}</h1>
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
      {"baseUrl" in params && (
        <>
          <h2>Shareble link</h2>
          <Stack direction="row" spacing={2}>
            <Stack>
              <Link
                href={`${params.baseUrl}?ro-token=${readOnlyKey}`}
                target="_blank"
                rel="noreferrer"
              >{`${params.baseUrl}?ro-token=${readOnlyKey}`}</Link>
            </Stack>
            <CopyToClipboard
              text={`${params.baseUrl}?ro-token=${readOnlyKey}`}
              onCopy={() => setCopied(true)}
            >
              <Button variant="contained" type="button" size="small">
                {copied ? "Copied" : "Copy to clipbboard"}
              </Button>
            </CopyToClipboard>
          </Stack>
        </>
      )}
      <h2>Schools</h2>
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
      {expandedSchool === undefined && schools.length > 0 && (
        <div hidden={expandedSchool !== undefined}>
          <div className="schools-box">
            <div className="schools-list-box">
              <ul>
                {schools.map((school, i) => {
                  return (
                    <li
                      key={school.name}
                      className={[
                        i === selectedSchool ? "selected" : "",
                        i === hoveredSchool ? "hovered" : "",
                      ].join(" ")}
                      onClick={() => setSelectedShool(i)}
                      onMouseEnter={() => setHoveredShool(i)}
                      onMouseLeave={() => setHoveredShool(undefined)}
                    >
                      <h4>{school.name}</h4>
                      <p>
                        {school.description}
                        <br />
                        Rank: {school.rank}
                        <br />
                        Driving: {readableTime(school.carTime)}
                        <br />
                        Walk: {readableTime(school.walkTime)}
                        <br />
                        Transit: {readableTime(school.transportTime)}
                        <br />
                        <Button
                          variant="contained"
                          type="button"
                          size="small"
                          onClick={() => setExpandedShool(i)}
                        >
                          Show strategy
                        </Button>
                      </p>
                    </li>
                  );
                })}
              </ul>
            </div>
            <div className="schools-map">
              <APIProvider apiKey={params.googleApiKey}>
                <Map
                  {...cameraProps}
                  onCameraChanged={handleCameraChange}
                  mapId={`recomendation-${"recommendation" in params ? params.recommendation : params.roToken}`}
                >
                  <AdvancedMarker position={childCoords}>
                    <Pin
                      background={"#59a14f"}
                      glyphColor={"#000"}
                      borderColor={"#000"}
                    />
                  </AdvancedMarker>
                  {schools.map((school, i) => (
                    <AdvancedMarker
                      position={coordsToGoogleCoords(school.address.coords)}
                      key={school.rank}
                      zIndex={
                        (selectedSchool === i ? 100 : 0) +
                        (hoveredSchool === i ? 1000 : 0)
                      }
                      onClick={() => setSelectedShool(i)}
                      onMouseEnter={() => setHoveredShool(i)}
                      onMouseLeave={() => setHoveredShool(undefined)}
                    >
                      <Pin
                        background={getPinColor(i)}
                        glyphColor={"#000"}
                        borderColor={"#000"}
                      />
                    </AdvancedMarker>
                  ))}
                </Map>
              </APIProvider>
            </div>
          </div>
        </div>
      )}
      {expandedSchool !== undefined && (
        <div style={{ marginTop: "50px" }}>
          <div>
            <Button
              variant="contained"
              type="button"
              size="small"
              onClick={() => setExpandedShool(undefined)}
            >
              Close
            </Button>
          </div>
          <div>
            <h3>{schools[expandedSchool].name}</h3>
            <p>{schools[expandedSchool].description}</p>
            <p>{buildAddress(schools[expandedSchool].address)}</p>
            <p>
              Driving: {readableTime(schools[expandedSchool].carTime)}
              <br />
              Walk: {readableTime(schools[expandedSchool].walkTime)}
              <br />
              Transit: {readableTime(schools[expandedSchool].transportTime)}
            </p>
            <h4>Strategy</h4>
            <Markdown>{schools[expandedSchool].strategy}</Markdown>
          </div>
        </div>
      )}
    </div>
  );
};
