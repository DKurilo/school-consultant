import * as React from "react";
import { IGetUser } from "../../../ports/get-user";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import { z } from "zod";
import { IAddChild } from "../../../ports/add-child";
import "./styles/user-page.css";

const FormDataParser = z.object({
  target: z.object({
    name: z.object({ value: z.string() }),
  }),
});

export type UserPageParams = {
  getUser: IGetUser;
  addChild: IAddChild;
  childCallback: (child: string) => void;
  backCallback: () => void;
};

export const UserPage = (params: UserPageParams) => {
  const [children, setChildren] = React.useState<Record<string, number>>({});
  const [attempts, setAttempts] = React.useState(0);
  const [newChildName, setNewChildName] = React.useState("");
  const ref = React.useRef();

  const loadUser = async () => {
    const user = await params.getUser.execute();
    setChildren(user.children ?? {});
    setAttempts(user.attemptsLeft ?? 0);
  };

  React.useEffect(() => {
    loadUser();
  }, []);

  const handleAddChild = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    const data = FormDataParser.parse(e);
    const name = data.target.name.value;
    try {
      await params.addChild.execute(name);
      setNewChildName("");
    } catch (e) {
      console.log(e);
      alert("child with this name exists");
    }
    await loadUser();
  };

  const handleNewChildNameChange = (e: React.SyntheticEvent) => {
    setNewChildName(e.target?.["value"] ?? "");
  };

  return (
    <div className="user-page">
      <div>Click on child to see info.</div>
      <div>
        <small>You have {attempts} new recommendations left.</small>
      </div>
      <h1>Children</h1>
      <ul>
        {Object.entries(children).map(([child, n]) => (
          <li onClick={() => params.childCallback(child)} key={child}>
            {child} - {n} recommendations
          </li>
        ))}
      </ul>
      <form ref={ref} onSubmit={handleAddChild}>
        <TextField
          name="name"
          type="text"
          placeholder="child's name"
          margin="none"
          variant="filled"
          hiddenLabel
          size="small"
          value={newChildName}
          onChange={handleNewChildNameChange}
        ></TextField>
        <Button variant="contained" type="submit">
          add child
        </Button>
      </form>
    </div>
  );
};
