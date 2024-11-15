import * as React from "react";
import "./styles/index.css";
import { IAuthenticate } from "../../ports/authenticate";
import { Login } from "./components/login";
import { ICheckIfAuthenticated } from "../../ports/check-if-authenticated";

export type SchoolConsultantParams = {
  checkAuthInterval: number;
  auth: IAuthenticate;
  checkAuth: ICheckIfAuthenticated;
};

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
  return <Login show={!authenticated} onSubmit={authenticateHandler}></Login>;
};
