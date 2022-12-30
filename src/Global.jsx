import React from "react";
import { Global } from "@mantine/core";
import bold from "./Vazirmatn-FD-Regular.woff2";
import heavy from "./Vazirmatn-FD-Bold.woff2";

export default function MyFonts() {
  return (
    <Global
      styles={[
        {
          "@font-face": {
            fontFamily: "Vazirmatn",
            src: `url('${bold}') format("woff2")`,
            fontWeight: 400,
            fontStyle: "normal",
          },
        },
        {
          "@font-face": {
            fontFamily: "Vazirmatn",
            src: `url('${heavy}') format("woff2")`,
            fontWeight: 700,
            fontStyle: "normal",
          },
        },
        {
          body: {
            fontFamily: "Vazirmatn",
          },
        },
      ]}
    />
  );
}
