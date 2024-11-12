import * as React from "react";

const MyButton = ({ title }: { title: string }) => <button>{title}</button>;

export const MyApp = () => (
  <div>
    <h1>Welcome to my app</h1>
    <MyButton title="I'm a button" />
  </div>
);
