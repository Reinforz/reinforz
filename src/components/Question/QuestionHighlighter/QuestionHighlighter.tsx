import React from "react";
import Highlight, { defaultProps, Language } from "prism-react-renderer";
import vsDark from "prism-react-renderer/themes/vsDark";

import { QuestionType, QuestionFormat } from "../../../types";

import "./QuestionHighlighter.scss";

interface QuestionHighlighterProps {
  code: string,
  language: Language,
  type: QuestionType,
  format: QuestionFormat,
  fibRefs: React.MutableRefObject<React.RefObject<HTMLInputElement>[]>
}

export default function QuestionHighlighter(props: QuestionHighlighterProps) {
  const { code, language, format, type, fibRefs } = props;

  return <Highlight {...defaultProps} theme={vsDark} code={code.trim()} language={language}>
    {({ className, style, tokens, getLineProps, getTokenProps }) => {
      let current_fib_index = -1;
      return <pre className={className + " QuestionHighlighter-pre"} style={style}>
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