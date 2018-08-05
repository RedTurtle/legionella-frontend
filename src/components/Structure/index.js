// @flow
import './index.css';
import * as React from 'react';
import StructureAggregatedSamples from '../StructureAggregatedSamples';
import WSPListContainer from '../../containers/WSPListContainer';
import type { AlertLevels } from '../../helpers/types.js.flow';

type StructureType = {
  id: string,
  label: string,
  aggregatedWsps: number,
  aggregatedSamplesHot: number,
  aggregatedSamplesCold: number,
  structType: {
    value: 'ingresso' | 'sottocentrale' | 'torre',
  },
  alertLevel: {
    alHot: AlertLevels,
    alCold: AlertLevels,
  },
};

type Props = {
  structure: StructureType,
  isOpen?: boolean,
};

const Structure = ({ isOpen, structure }: Props) => {
  let aggregatedWsps = '';
  let wspsDetails = '';
  const wsps = structure ? structure.aggregatedWsps : 0;
  const { aggregatedSamplesCold, aggregatedSamplesHot, alertLevel } = structure;
  aggregatedWsps = (
    <div className="wsps-num">
      <span className="structure-data-label">WSP</span>
      <span className="structure-data-number">{structure.aggregatedWsps}</span>
    </div>
  );

  if (wsps > 0 && isOpen) {
    wspsDetails = <WSPListContainer structureId={structure.id} />;
  }
  return (
    <div
      className={`structure${isOpen ? ' highlighted' : ''}${
        structure.structType.value === 'torre' ? ' tower' : ''
      }`}
    >
      <div className="structure-content">
        <div className="structure-header">
          <h3 className="structure-title">{structure.label}</h3>
          {aggregatedWsps}
        </div>
        <div className="structure-data">
          <StructureAggregatedSamples
            type="cold"
            structType={structure.structType.value}
            counter={aggregatedSamplesCold}
            data={alertLevel.alCold}
            label="ACQUA FREDDA"
          />
          {structure.structType.value !== 'torre' && (
            <StructureAggregatedSamples
              type="hot"
              structType={structure.structType.value}
              counter={aggregatedSamplesHot}
              data={alertLevel.alHot}
              label="ACQUA CALDA"
            />
          )}
        </div>
      </div>
      {wspsDetails}
    </div>
  );
};

Structure.defaultProps = {
  isOpen: false,
};

export default Structure;
