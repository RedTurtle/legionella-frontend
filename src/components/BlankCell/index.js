// @flow
import React from 'react';
import './styles.css';

const BlankCell = ({
  small = false,
  childrenNum = 0,
}: {
  small?: boolean,
  childrenNum?: number,
}) => (
  <div
    className={`blank-cell${childrenNum ? ' highlighted' : ''}${
      small ? ' small' : ''
    }`}
  >
    <div className="main-body" />
    <div className="child-blanks">
      {Array.from(Array(childrenNum).keys()).map((num, idx) => (
        <BlankCell key={idx} small />
      ))}
    </div>
  </div>
);

export default BlankCell;
