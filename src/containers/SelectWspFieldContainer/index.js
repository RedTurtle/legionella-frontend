// @flow
import React, { Component } from 'react';
import Select from 'react-select';

type Props = {
  isEditable: boolean,
  wsps: Array<any>,
  onChange: $FlowFixMe,
  onBlur: () => void,
  value: string,
};

class SelectWspFieldContainer extends Component<Props> {
  render() {
    const { wsps, onChange, onBlur, value, isEditable } = this.props;
    const wspsData = wsps
      ? wsps.reduce(
          (acc, wsp) => {
            acc.wspsSelectEntries.push({
              value: wsp.id,
              label: wsp.description
                ? `${wsp.code} - ${wsp.description}`
                : wsp.code,
            });
            if (wsp.id === value) {
              acc.selectedWsp = wsp;
            }
            return acc;
          },
          {
            wspsSelectEntries: [],
            selectedWsp: null,
          },
        )
      : undefined;
    let wspDetails = '';
    const wspsSelectEntries = wspsData ? wspsData.wspsSelectEntries : [];
    if (wspsData && wspsData.selectedWsp) {
      const { selectedWsp } = wspsData;
      const sector =
        selectedWsp.sector && selectedWsp.sector.edges.length
          ? selectedWsp.sector.edges[0].node
          : null;
      wspDetails = (
        <div className="WSPDetails">
          <div className="WSPRiskLevel">
            <div className="WSPLabel">liv. rischio</div>
            <div
              className="RiskLevel"
              style={{ color: selectedWsp.riskLevel.description }}
            >
              {selectedWsp.riskLevel.value}
            </div>
          </div>
          <div className="WSPRooms">
            <div className="WSPLabel">Settore / area ospedaliera</div>
            <div className="Rooms">
              {selectedWsp.floor && <span>P {selectedWsp.floor.label}</span>}
              {selectedWsp.building && (
                <span>E {selectedWsp.building.label}</span>
              )}
              {sector && (
                <span className="sector-label">
                  {sector.label} - {selectedWsp.description}
                </span>
              )}
            </div>
            {/* <div>Sottocentrale: {selectedWsp.structure.label}</div> */}
          </div>
          {/* <div className="WSPState"> */}
          {/* <div className="WSPLabel">
              Situazione al {format('2017-11-20', 'DD-MM-YYYY')}
            </div> */}
          {/* <div className="state-circles">
              <span className={stateCircleCssClass} /> */}
          {/* <span className="state-circle state-orange" />
              <span className="state-circle state-green" /> */}
          {/* </div> */}
          {/* $QUI COSA CI VA????$
            <span>Filtri assoluti permanenti</span> */}
          {/* </div> */}
        </div>
      );
    }

    return (
      <div className="wsp-field">
        {isEditable ? (
          <Select
            name="wsp"
            value={value}
            options={wspsData ? wspsSelectEntries : []}
            clearable={false}
            placeholder="Seleziona un WSP"
            onChange={option => onChange(wspsSelectEntries, option)}
            onBlur={onBlur}
          />
        ) : null}
        {wspDetails}
      </div>
    );
  }
}

export default SelectWspFieldContainer;
