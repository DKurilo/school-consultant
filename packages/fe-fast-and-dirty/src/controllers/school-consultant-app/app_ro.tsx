import * as React from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import "./styles/index.css";
import { IGetRoRecommendation } from "../../ports/get-ro-recommendation";
import { ViewRecommendationPage } from "./components/view-recomendation-page";
import { StickyFooter } from "./components/footer";

export type SchoolConsultantRoParams = {
  googleApiKey: string;
  getRoRecommendation: IGetRoRecommendation;
  roToken: string;
};

const darkTheme = createTheme({
  palette: {
    mode: "dark",
  },
});

export const SchoolConsultantRo = (params: SchoolConsultantRoParams) => {
  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <ViewRecommendationPage
        googleApiKey={params.googleApiKey}
        getRoRecommendation={params.getRoRecommendation}
        roToken={params.roToken}
      />
      <StickyFooter />
    </ThemeProvider>
  );
};
