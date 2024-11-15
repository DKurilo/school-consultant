import * as React from "react";
import { z } from "zod";

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
      <form onSubmit={handleLogin} ref={ref}>
        <input name="email" type="email" />
        <br />
        <input name="password" type="password" />
        <br />
        <button type="submit">login</button>
      </form>
    )
  );
};
