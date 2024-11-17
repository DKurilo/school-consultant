import * as React from "react";
import { z } from "zod";
import Button from "@mui/material/Button";
import FormControl from "@mui/material/FormControl";
import TextField from "@mui/material/TextField";
import "./styles/login.css";

const ValueParser = z.object({ value: z.string() });

const FormDataParser = z.object({
  target: z.object({
    email: ValueParser,
    password: ValueParser,
  }),
});

export type LoginParams = {
  show: boolean;
  onSubmit: (email: string, password: string) => Promise<void>;
};

export const Login = (params: LoginParams) => {
  const ref = React.useRef();
  const handleLogin = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    const data = FormDataParser.parse(e);
    const email = data.target.email.value;
    const password = data.target.password.value;
    await params.onSubmit(email, password);
  };

  return (
    params.show && (
      <div className="login-container">
        <div className="form">
          <form onSubmit={handleLogin} ref={ref}>
            <FormControl>
              <TextField
                name="email"
                type="email"
                placeholder="email"
                margin="none"
                variant="filled"
                hiddenLabel
                size="small"
              />
              <TextField
                name="password"
                type="password"
                placeholder="password"
                margin="normal"
                variant="filled"
                hiddenLabel
                size="small"
              />
              <Button variant="contained" type="submit" size="small">
                login
              </Button>
            </FormControl>
          </form>
        </div>
      </div>
    )
  );
};
