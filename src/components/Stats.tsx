import styled from "styled-components";
import React from "react";

interface StatsProps {
  item: any,
  stats: string[],
};

const StatsContainer = styled.div`
  user-select: none;
  display: flex;
  justify-content: space-evenly;
  margin-bottom: 10px;
  background-color : #1b1b1b;
  border-radius: 3px;
  margin: 20px;
  padding: 5px;
`;

const StatsContainerItem = styled.div`
  user-select: none;
  font-weight: 500;
  font-size: 1rem;
  padding: 5px;

  .value{
    padding: 2px 5px;
    border-radius: 3px; 
    background-color: #2c2c2c;
  }
`;

function Stats(props: StatsProps) {
  const { stats, item } = props;
  const convertKey = (key: string) => key.split("_").map(c => c.charAt(0).toUpperCase() + c.substr(1)).join(" ")
  return (
    <StatsContainer className="Stats-container">
      {stats.map(stat => <StatsContainerItem key={`${item._id}stats-${stat}`} className={`Stats-container-item Stats-container-item-${stat}`}><span>{convertKey(stat) + ": "}</span><span className={"value"}>{item[stat].toString()}</span></StatsContainerItem>)}
    </StatsContainer>
  );
}

export default Stats;