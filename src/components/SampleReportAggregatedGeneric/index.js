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

class SampleReportAggregatedGeneric extends Component<Props> {
  render() {
    const {
      aggregatedData,
      coldTemperatureOverlay,
      coldFlowTemperatureOverlay,
      hotTemperatureOverlay,
      hotFlowTemperatureOverlay,
      coldLegionellaOverlay,
      hotLegionellaOverlay,
      coldBioxOverlay,
      hotBioxOverlay,
      openOverlay,
      generateRanges,
    } = this.props;
    const aggregatedTemps = aggregatedData
      ? aggregatedData.aggregatedTemps
      : null;
    return (
      <div className="aggregated-data-wrapper">
        <div className="aggregated-data">
          <div className="temp-row">
            <button
              className="cold-before"
              type="button"
              onClick={e => openOverlay('coldTemperature', e.currentTarget)}
            >
              <p>F</p>
              <div className="ranges">
                {generateRanges({
                  values: aggregatedTemps,
                  key: 'coldTemperature',
                })}
              </div>
            </button>
            {coldTemperatureOverlay}
            <button
              className="cold-after"
              type="button"
              onClick={e => openOverlay('coldFlowTemperature', e.currentTarget)}
            >
              <p>F-S</p>
              <div className="ranges">
                {generateRanges({
                  values: aggregatedTemps,
                  key: 'coldFlowTemperature',
                })}
              </div>
            </button>
            {coldFlowTemperatureOverlay}
            <figure>
              <TempIcon />
            </figure>
            <button
              className="warm-before"
              type="button"
              onClick={e => openOverlay('hotTemperature', e.currentTarget)}
            >
              <p>C</p>
              <div className="ranges">
                {generateRanges({
                  values: aggregatedTemps,
                  key: 'hotTemperature',
                })}
              </div>
            </button>
            {hotTemperatureOverlay}
            <button
              className="warm-after"
              type="button"
              onClick={e => openOverlay('hotFlowTemperature', e.currentTarget)}
            >
              <p>C-S</p>
              <div className="ranges">
                {generateRanges({
                  values: aggregatedTemps,
                  key: 'hotFlowTemperature',
                })}
              </div>
            </button>
            {hotFlowTemperatureOverlay}
          </div>
          <div className="legionella-biox-row">
            <div className="cold-column">
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
              <span className="cold-label">ACQUA FREDDA</span>
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
            <div className="icons-column">
              <div className="legionella-icon">
                <figure>
                  <BacteriaIcon />
                </figure>
                <div>UFC/L</div>
              </div>
              <div className="biox-icon">
                <figure>
                  <MoleculeIcon />
                </figure>
                <div>
                  ClO<sub>2</sub>
                </div>
              </div>
            </div>
            <div className="warm-column">
              <button
                type="button"
                className="legionella"
                onClick={e => openOverlay('hotLegionella', e.currentTarget)}
              >
                <div className="ranges">
                  {generateRanges({
                    values: aggregatedData,
                    key: 'aggregatedLegionellaHot',
                  })}
                </div>
              </button>
              {hotLegionellaOverlay}
              <span className="hot-label">ACQUA CALDA</span>
              <button
                type="button"
                className="biox"
                onClick={e => openOverlay('hotBiox', e.currentTarget)}
              >
                <div className="ranges">
                  {generateRanges({
                    values: aggregatedData,
                    key: 'aggregatedBioxHot',
                  })}
                </div>
              </button>
              {hotBioxOverlay}
            </div>
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
              <div className="warm">
                <span className="value">
                  {aggregatedData ? aggregatedData.samplesNumHot : 0}
                </span>
                <span className="label">camp.</span>
                <span className="sub-label">Acqua calda</span>
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

export default aggregatedReportWithOverlays(SampleReportAggregatedGeneric);
