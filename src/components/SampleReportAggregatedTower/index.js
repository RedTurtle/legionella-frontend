// @flow
import * as React from 'react';
import { Component } from 'react';
import TempIcon from '../icons/TempIcon';
import BacteriaIcon from '../icons/BacteriaIcon';
import MoleculeIcon from '../icons/MoleculeIcon';
import PieChartIcon from '../icons/PieChartIcon';
import FlaskIcon from '../icons/FlaskIcon';
import type { AlertLevels } from '../../helpers/types.js.flow';
import { aggregatedReportWithOverlays } from '../../hocs/SampleReportAggregated';

type AggregatedTemps = {
  coldFlowTemperature: AlertLevels,
  coldTemperature: AlertLevels,
  hotFlowTemperature: AlertLevels,
  hotTemperature: AlertLevels,
};

type AggregatedData = {
  aggregatedBioxCold: AlertLevels,
  aggregatedBioxHot: AlertLevels,
  aggregatedLegionellaCold: AlertLevels,
  aggregatedLegionellaHot: AlertLevels,
  aggregatedTemps: AggregatedTemps,
  samplesNumCold: number,
  samplesNumHot: number,
  wspsPercentage: number,
};

type Props = {
  aggregatedData?: AggregatedData,
  coldTemperatureOverlay: $FlowFixMe,
  coldFlowTemperatureOverlay: $FlowFixMe,
  hotTemperatureOverlay: $FlowFixMe,
  hotFlowTemperatureOverlay: $FlowFixMe,
  coldLegionellaOverlay: $FlowFixMe,
  hotLegionellaOverlay: $FlowFixMe,
  coldBioxOverlay: $FlowFixMe,
  hotBioxOverlay: $FlowFixMe,
  openOverlay: $FlowFixMe,
  generateRanges: $FlowFixMe,
};

class SampleReportAggregatedTower extends Component<Props> {
  render() {
    const {
      aggregatedData,
      coldFlowTemperatureOverlay,
      coldLegionellaOverlay,
      coldBioxOverlay,
      openOverlay,
      generateRanges,
    } = this.props;
    const aggregatedTemps = aggregatedData
      ? aggregatedData.aggregatedTemps
      : null;
    return (
      <div className="aggregated-data-wrapper aggregated-tower">
        <div className="aggregated-data">
          <div className="temp-row">
            <figure>
              <TempIcon />
            </figure>
            <span className="label">Temperatura F-S</span>
            <button
              className="cold-after"
              type="button"
              onClick={e => openOverlay('coldFlowTemperature', e.currentTarget)}
            >
              <div className="ranges">
                {generateRanges({
                  values: aggregatedTemps,
                  key: 'coldFlowTemperature',
                })}
              </div>
            </button>
            {coldFlowTemperatureOverlay}
          </div>
          <div className="legionella-row">
            <figure>
              <BacteriaIcon />
            </figure>
            <span className="label">UFC/L legionella</span>
            <button
              className="legionella"
              type="button"
              onClick={e => openOverlay('coldLegionella', e.currentTarget)}
            >
              <div className="ranges">
                {generateRanges({
                  values: aggregatedData,
                  key: 'aggregatedLegionellaCold',
                })}
              </div>
            </button>
            {coldLegionellaOverlay}
          </div>
          <div className="biox-row">
            <figure>
              <MoleculeIcon />
            </figure>
            <span className="label">Biossido di cloro</span>
            <button
              className="biox"
              type="button"
              onClick={e => openOverlay('coldBiox', e.currentTarget)}
            >
              <div className="ranges">
                {generateRanges({
                  values: aggregatedData,
                  key: 'aggregatedBioxCold',
                })}
              </div>
            </button>
            {coldBioxOverlay}
          </div>
          <div className="aggregate-row">
            <div className="samples">
              <figure>
                <FlaskIcon />
              </figure>
              <div className="cold">
                <span className="value">
                  {aggregatedData ? aggregatedData.samplesNumCold : 0}
                </span>
                <span className="label">camp.</span>
                <span className="sub-label">Acqua fredda</span>
              </div>
            </div>
            <div className="wsps">
              <figure>
                <PieChartIcon />
              </figure>
              <span className="value">
                {aggregatedData ? aggregatedData.wspsPercentage : 0}%
              </span>
              <span className="label">wsp</span>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default aggregatedReportWithOverlays(SampleReportAggregatedTower);
