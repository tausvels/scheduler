import React from 'react';

import DayListItem from "components/DayListItem";

// export default function DayList(props) {
//   const daysArr = props;

//   return (
//     <ul></ul>
//   )
// }

export default function DayList (props) {
  const daysArr = props.days;
  const output = daysArr.map(day => (
    <DayListItem 
      key={day.id}
      name={day.name}
      spots={day.spots}
      selected={day.name === props.day}
      setDay={props.setDay}
    />
  ));
  return (
    <ul>{output}</ul>
  )
}