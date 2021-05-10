import { useTheme } from "@material-ui/styles";
import React from "react";
import { ExtendedTheme, StatsProps } from "../../types";
import flattenObj from "../../utils/flattenObj";
import "./style.scss";

function Stats(props: StatsProps) {
  const theme = useTheme() as ExtendedTheme;

  const { stats, item } = props;
  const flattened_item = flattenObj(item);
  const convertKey = (key: string) => key.replace(/(_|\.)/g, " ").split(" ").map(c => c.charAt(0).toUpperCase() + c.substr(1)).join(" ")
  return (
    <div className="Stats" style={{ backgroundColor: theme.color.dark, color: theme.palette.text.primary }}>
      {stats.map(stat => stat && <div key={`${item._id}stats-${stat}`} className={`Stats-item Stats-item-${stat}`}><span>{convertKey(stat) + ": "}</span><span style={{ backgroundColor: theme.color.base }} className={"value"}>{flattened_item[stat].toString()}</span></div>)}
    </div>
  );
}

export default Stats;