import React from "react";

import { StatsProps } from "../../types";

import "./Stats.scss";

function Stats(props: StatsProps) {
  const { stats, item } = props;
  const convertKey = (key: string) => key.split("_").map(c => c.charAt(0).toUpperCase() + c.substr(1)).join(" ")
  return (
    <div className="Stats">
      {stats.map(stat => <div key={`${item._id}stats-${stat}`} className={`Stats-item Stats-item-${stat}`}><span>{convertKey(stat) + ": "}</span><span className={"value"}>{item[stat].toString()}</span></div>)}
    </div>
  );
}

export default Stats;