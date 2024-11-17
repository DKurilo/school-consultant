import * as React from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import "./styles/index.css";
import { IAuthenticate } from "../../ports/authenticate";
import { Login } from "./components/login";
import { ICheckIfAuthenticated } from "../../ports/check-if-authenticated";
import { Page } from "./components/page";
import { IGetUser } from "../../ports/get-user";
import {IAddChild} from "../../ports/add-child";

export type SchoolConsultantParams = {
  checkAuthInterval: number;
  auth: IAuthenticate;
  checkAuth: ICheckIfAuthenticated;
  getUser: IGetUser;
  addChild: IAddChild;
};

const darkTheme = createTheme({
  palette: {
    mode: "dark",
  },
});

export const SchoolConsultant = (params: SchoolConsultantParams) => {
  const [authenticated, setAuthenticated] = React.useState(false);
  React.useEffect(() => {
    const interval = setInterval(() => {
      params.checkAuth
        .check()
        .then(setAuthenticated)
        .catch(() => {
          setAuthenticated(false);
        });
    }, params.checkAuthInterval);
    return () => {
      clearInterval(interval);
    };
  }, []);
  const authenticateHandler = React.useMemo(
    () => async (email: string, password: string) => {
      const success = await params.auth.execute(email, password);
      setAuthenticated(success);
    },
    [authenticated, setAuthenticated, params.auth],
  );
  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Login show={!authenticated} onSubmit={authenticateHandler}></Login>
      {authenticated && <Page getUser={params.getUser} addChild={params.addChild}></Page>}
    </ThemeProvider>
  );
};
