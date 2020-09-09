import React from "react";
import styled from "styled-components";
import Highlight, { defaultProps, Language } from "prism-react-renderer";
import vsDark from "prism-react-renderer/themes/vsDark";

import "./Highlighter.scss";
import { QuestionType, QuestionFormat } from "../types";

const Pre = styled.pre`
  text-align: left;
  margin: 1em 0;
  padding: 0.5em;
  overflow: auto;
  font-family:"Consolas";
  width: calc(100% - 50px);
`;

const Line = styled.div`
  display: table-row;
`;

const LineNo = styled.span`
  display: table-cell;
  text-align: right;
  padding-right: 1em;
  user-select: none;
  opacity: 0.5;
`;

const LineContent = styled.span`
  display: table-cell;
`;

interface HighlighterProps {
  code: string,
  language: Language,
  type: QuestionType,
  format: QuestionFormat,
  fibRefs: React.MutableRefObject<React.RefObject<HTMLInputElement>[]>
}

export default function Highlighter(props: HighlighterProps) {
  const { code, language, format, type, fibRefs } = props;

  return <Highlight {...defaultProps} theme={vsDark} code={code.trim()} language={language}>
    {({ className, style, tokens, getLineProps, getTokenProps }) => {
      let current_fib_index = -1;
      return <Pre className={className} style={style}>
        {tokens.map((line, i) => {
          let line_contents = [];
          for (let i = 0; i < line.length; i++) {
            const token = line[i];
            if (type === "FIB" && format === "html" && token.content === "%" && line[i + 1].content === "_" && line[i + 2].content === "%") {
              current_fib_index++;
              line_contents.push(<input key={i} spellCheck={false} className="Highlighter-FIB-Code" ref={fibRefs.current[current_fib_index]} />)
              i += 2;
            }
            else line_contents.push(<span key={i} {...getTokenProps({ token, key: i })} />)
          }
          return <Line key={i} {...getLineProps({ line, key: i })}>
            <LineNo>{i + 1}</LineNo>
            <LineContent>
              {line_contents.map(line_content => line_content)}
            </LineContent>
          </Line>
        })}
      </Pre>
    }}
  </Highlight>
};