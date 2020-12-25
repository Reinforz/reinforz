import React from "react";
import Highlight, { defaultProps, Language } from "prism-react-renderer";
import DarkTheme from "prism-react-renderer/themes/vsDark";
import LightTheme from "prism-react-renderer/themes/github";
import { useTheme } from "@material-ui/core/styles";
import Prism from "prismjs";
import "prismjs/components/prism-dart";
import "prismjs/components/prism-csharp";
import "prismjs/components/prism-java";
import "prismjs/components/prism-git";

import { ExtendedTheme } from "../../types";
import { HighlighterProps } from "../Question/Highlighter";

export default React.memo((props: HighlighterProps) => {
  const { code, language } = props;
  const theme = useTheme() as ExtendedTheme;
  return <Highlight {...defaultProps} theme={theme.palette.type === "dark" ? DarkTheme : LightTheme} code={code.trim()} language={language.trim() as Language} Prism={Prism as any}>
    {({ className, style, tokens, getLineProps, getTokenProps }) => {
      return <pre className={className + " Highlighter"} style={{ ...style, backgroundColor: theme.color.dark }}>
        {tokens.map((line, i) => (
          <div {...getLineProps({ line, key: i })}>
            {line.map((token, key) => (
              <span {...getTokenProps({ token, key })} />
            ))}
          </div>
        ))}
      </pre>
    }}
  </Highlight>
});