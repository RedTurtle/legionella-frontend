// @flow
import * as React from 'react';
import FaChevronDown from 'react-icons/lib/fa/chevron-down';
import FaChevronRight from 'react-icons/lib/fa/chevron-right';
import type { GraphqlConnection } from '../../helpers/types.js.flow';
import WSPDetailsButton from '../WSPDetailsButton';
import './styles.css';

type Props = {
  wsps: GraphqlConnection<$FlowFixMe>,
  structureId: string,
  isOpen: boolean,
  onHandleClick: string => void,
};

const StructureDetailsButton = ({
  wsps,
  structureId,
  isOpen,
  onHandleClick,
}: Props) => {
  let wspsButtonsList = '';
  if (wsps.edges.length > 0 && isOpen) {
    wspsButtonsList = (
      <div className="child-buttons">
        {wsps.edges.map(({ node }) => (
          <WSPDetailsButton key={node.id} wspId={node.id} />
        ))}
      </div>
    );
  }
  return (
    <div className={`structure-details-button${isOpen ? ' open' : ''}`}>
      <div className="button-wrapper">
        <button onClick={() => onHandleClick(structureId)}>
          {isOpen ? <FaChevronDown /> : <FaChevronRight />}
        </button>
      </div>
      {wspsButtonsList}
    </div>
  );
};

export default StructureDetailsButton;
