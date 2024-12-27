import * as React from "react";
import { IGetUser } from "../../../ports/get-user";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import { IAddChild } from "../../../ports/add-child";
import "./styles/user-page.css";
import Stack from "@mui/material/Stack";
import Link from "@mui/material/Link";

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

  const loadUser = async () => {
    const user = await params.getUser.execute();
    setChildren(user.children ?? {});
    setAttempts(user.attemptsLeft ?? 0);
  };

  React.useEffect(() => {
    loadUser();
  }, []);

  const handleAddChild = async () => {
    try {
      await params.addChild.execute(newChildName);
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
      <h1>Hi</h1>
      {attempts > 1 && (
        <p>You can build up to {attempts} new recommendations.</p>
      )}
      {attempts === 1 && <p>You can build {attempts} new recommendation.</p>}
      {attempts < 1 && (
        <p>
          Sorry, you can't build new recommendations. You still can see already
          created recommendations. Send e-mail to resource owner if you want
          more recommendations.
        </p>
      )}
      <Stack direction="row" spacing={1}>
        <Link href="/schools/nyc-3k-prek-k-schools.xlsx">
          List of 3K, Pre-K, and K schools of NYC.
        </Link>
        <Stack>List compiled from </Stack>
        <Link href="https://myschools.nyc/" target="_blank" rel="noreferrer">
          myschools.nyc
        </Link>
      </Stack>
      <h1>Children</h1>
      <Stack direction="column" spacing={1} alignItems="start">
        {Object.entries(children).map(([child, n]) => (
          <Button onClick={() => params.childCallback(child)} key={child}>
            {child} has {n} {n === 1 ? "recommendation" : "recommendations"}.
            Click to view.
          </Button>
        ))}
        <Stack direction="row" spacing={2}>
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
          <Button variant="contained" type="submit" onClick={handleAddChild}>
            add child
          </Button>
        </Stack>
      </Stack>
    </div>
  );
};
