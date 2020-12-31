import React, { useContext } from "react";
import { PlaySettings, PlayListContext } from "..";
import List from "../../Basic/List";
import { PlayErrorlogsContext } from "../Errorlogs";

import "./style.scss";

export const PlayList = () => {
  const { correct_quizzes } = useContext(PlayErrorlogsContext);
  return <List className="Play-List" header="Uploaded Quizzes" items={correct_quizzes} fields={["subject", "title", (item: any) => item.questions.length + " Qs"]}>
    {({ selected_items }) => <PlayListContext.Provider value={{ selected_items }}><PlaySettings /></PlayListContext.Provider>}
  </List>
}

export * from "./types";
export * from "./context";