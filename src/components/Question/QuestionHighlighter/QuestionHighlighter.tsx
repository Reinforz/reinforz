import React from "react";
import Highlight, { defaultProps } from "prism-react-renderer";
import DarkTheme from "prism-react-renderer/themes/vsDark";
import LightTheme from "prism-react-renderer/themes/github";
import { useTheme } from "@material-ui/core/styles";

import { ExtendedTheme, QuestionHighlighterProps } from "../../../types";

import "./QuestionHighlighter.scss";

export default function QuestionHighlighter(props: QuestionHighlighterProps) {
  const { code, language, format, type, fibRefs } = props;
  const theme = useTheme() as ExtendedTheme;

  return <Highlight {...defaultProps} theme={theme.palette.type === "dark" ? DarkTheme : LightTheme} code={code.trim()} language={language}>
    {({ className, style, tokens, getLineProps, getTokenProps }) => {
      let current_fib_index = -1;
      return <pre className={className + " QuestionHighlighter-pre"} style={{ ...style, backgroundColor: theme.color.light }}>
        {tokens.map((line, i) => {
          let line_contents = [];
          for (let i = 0; i < line.length; i++) {
            const token = line[i];
            if (type === "FIB" && format === "html" && token.content === "%" && line[i + 1].content === "_" && line[i + 2].content === "%") {
              current_fib_index++;
              line_contents.push(<input style={{ color: theme.palette.text.primary, backgroundColor: theme.color.dark }} key={i} spellCheck={false} className="Highlighter-FIB-Code" ref={fibRefs.current[current_fib_index]} />)
              i += 2;
            }
            else line_contents.push(<span key={i} {...getTokenProps({ token, key: i })} />)
          }
          const line_props = getLineProps({ line, key: i });
          line_props.className = `${line_props.className} QuestionHighlighter-pre-line`
          return <div key={i} {...line_props}>
            <span className="QuestionHighlighter-pre-line-num">{i + 1}</span>
            <span className="QuestionHighlighter-pre-content">
              {line_contents.map(line_content => line_content)}
            </span>
          </div>
        })}
      </pre>
    }}
  </Highlight>
};