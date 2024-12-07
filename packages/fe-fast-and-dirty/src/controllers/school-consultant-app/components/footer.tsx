import * as React from "react";
import Stack from "@mui/material/Stack";
import "./styles/footer.css";
import Link from "@mui/material/Link";

export const StickyFooter = () => {
  return (
    <Stack direction="row" spacing={1} id="sticky-footer">
      <Link
        href="https://github.com/DKurilo/school-consultant"
        target="_blank"
        rel="noreferrer"
      >
        Github
      </Link>
      <Stack>Please, read</Stack>
      <Link
        href="https://github.com/DKurilo/school-consultant/blob/main/README.md"
        target="_blank"
        rel="noreferrer"
      >
        README
      </Link>
    </Stack>
  );
};
