// @flow
import * as React from 'react';
import './styles.css';

type Props = {
  canAddReport: boolean,
  highlighted: boolean,
  handleClick?: Event => void,
};

const EmptySampleSlot = ({
  /** Se vera, diventa un bottone che permette di aggiungere un nuovo campionamento */
  canAddReport,
  /** Indica se il riquadro deve essere evidenziato */
  highlighted,
  /** Funzione da eseguire al click sul bottone */
  handleClick,
}: Props) => {
  return (
    <div
      className={`empty-sample-slot${highlighted ? ' highlighted' : ''}${
        canAddReport ? ' enabled' : ''
      }`}
    >
      <div className="slot-content">
        {canAddReport ? (
          <button type="button" onClick={handleClick || (() => {})}>
            <span>+</span>
          </button>
        ) : (
          <div />
        )}
      </div>
    </div>
  );
};

EmptySampleSlot.defaultProps = {
  canAddReport: false,
  highlighted: false,
};

export default EmptySampleSlot;
