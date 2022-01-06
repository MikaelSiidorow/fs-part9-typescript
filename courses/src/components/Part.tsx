import React from "react";
import { CoursePart } from "../types";

interface PartProps {
  course: CoursePart
}

const assertNever = (value: never): never => {
  throw new Error(
    `Unhandled discriminated union member: ${JSON.stringify(value)}`
  );
};

const Part = (props: PartProps) => {
  switch(props.course.type) {
    case "normal":
      return (
        <p style={{whiteSpace: 'pre-line'}}>
          <b>{props.course.name} {props.course.exerciseCount}</b>
          {'\n'}
          <i>{props.course.description}</i>
        </p>
      );
    case "groupProject":
      return (
        <p style={{whiteSpace: 'pre-line'}}>
          <b>{props.course.name} {props.course.exerciseCount}</b>
          {'\n'}
          project exercises {props.course.groupProjectCount}
        </p>
      );
    case "submission":
      return (
        <p style={{whiteSpace: 'pre-line'}}>
          <b>{props.course.name} {props.course.exerciseCount}</b>
          {'\n'}
          <i>{props.course.description}</i>
          {'\n'}
          submit to {props.course.exerciseSubmissionLink}
        </p>
      );
    case "special":
      return (
        <p style={{whiteSpace: 'pre-line'}}>
          <b>{props.course.name} {props.course.exerciseCount}</b>
          {'\n'}
          <i>{props.course.description}</i>
          {'\n'}
          required skills: {props.course.requirements.join(', ')}
        </p>
      )
    default:
      return assertNever(props.course)
  }
};

export default Part