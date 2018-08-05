// @flow
import React from 'react';
import './styles.css';
import ChartFilter from '../ChartFilter';
import type { Props as FilterProps } from '../ChartFilter';
import Chart from '../Chart';
import type { Props as ChartProps } from '../Chart';
import Spinner from '../Spinner';
import { graphql, compose } from 'react-apollo';
import { ChartsQuery } from '../../graphql/queries/chart';
import { SimpleAllStructuresQuery } from '../../graphql/queries/structures';

type Props = {
  onUpdateStructureField: $FlowFixMe,
  onUpdateDateField: $FlowFixMe,
  startDate: string,
  endDate: string,
  structType: string,
  structId: string,
  structures?: $PropertyType<FilterProps, 'options'>,
  timeFrames: {
    options: $PropertyType<FilterProps, 'options'>,
    value: $PropertyType<FilterProps, 'value'>,
  },
  loading: boolean,
  chart: {
    coldChart: {
      ranges: $PropertyType<ChartProps, 'ranges'>,
      totalCount: $PropertyType<ChartProps, 'totalCount'>,
      wspsPercentage: $PropertyType<ChartProps, 'wspsPercentage'>,
    },
    hotChart: {
      ranges: $PropertyType<ChartProps, 'ranges'>,
      totalCount: $PropertyType<ChartProps, 'totalCount'>,
      wspsPercentage: $PropertyType<ChartProps, 'wspsPercentage'>,
    },
  },
  rangeLevels: {
    perfect: string,
    good: string,
    bad: string,
    danger: string,
    critical: string,
  },
};

const ChartsSection = ({
  structures = [],
  timeFrames,
  chart,
  loading,
  rangeLevels,
  structType,
  structId,
  onUpdateStructureField,
  onUpdateDateField,
}: Props) => {
  if (loading) {
    return (
      <div className="charts-section container">
        <Spinner />
      </div>
    );
  }
  const { coldChart, hotChart } = chart;
  const structuresDict = structures
    ? structures.reduce(
        (dict, structure) => ({
          ...dict,
          [structure.value]: structure.label,
        }),
        {},
      )
    : {};

  let statusLabel = 'Acqua di rete';
  if (structType.length) {
    statusLabel = structuresDict[structType];
  } else if (structId.length) {
    statusLabel = structuresDict[structId];
  }
  return (
    <div className="charts-section container">
      <div className="charts-content">
        <div className="filters-row">
          <div className="filters">
            <ChartFilter
              name="structures"
              title="Impianto"
              options={structures}
              value={structType || structId}
              onChange={({ value }: { value: string }) => {
                let data = {};
                switch (value) {
                  case 'torre':
                    data = { structType: value, structId: '' };
                    break;
                  case '':
                    data = { structType: '', structId: '' };
                    break;
                  default:
                    data = { structType: '', structId: value };
                    break;
                }
                onUpdateStructureField(data);
              }}
            />
            <ChartFilter
              name="time-frame"
              title="Periodo"
              {...timeFrames}
              onChange={({ value }: { value: string }) => {
                onUpdateDateField(value);
              }}
            />
          </div>
          <div className="charts-section-title">
            <span>Stato complessivo UFC/L {statusLabel}</span>
          </div>
        </div>
        <div className="charts-row">
          <div className="legend">
            {Object.keys(rangeLevels).map(key => (
              <div key={key} className="legend-item">
                <span className={`range-${key}`} />
                <p className="legend-text">{rangeLevels[key]}</p>
              </div>
            ))}
          </div>
          <div className="charts">
            <Chart className="cold-chart" title="Acqua fredda" {...coldChart} />
            {structType !== 'torre' && (
              <Chart className="hot-chart" title="Acqua calda" {...hotChart} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// $FlowFixMe
export default compose(
  // $FlowFixMe
  graphql(SimpleAllStructuresQuery, {
    // $FlowFixMe
    props: ({ data: { loading, allStructure } }) => {
      const singleStructures = ['ingresso', 'sottocentrale'];
      const filteredStructures =
        allStructure && allStructure.edges.length
          ? allStructure.edges.reduce(
              (items, node) => {
                const structure = node.node;
                if (!singleStructures.includes(structure.structureType)) {
                  return items;
                }
                items[structure.structureType].push({
                  value: structure.id,
                  label: structure.label,
                });
                return items;
              },
              { sottocentrale: [], ingresso: [] },
            )
          : { sottocentrale: [], ingresso: [] };
      return {
        loading,
        structures: [
          { value: '', label: 'Acqua di rete' },
          { value: 'torre', label: 'Torri di raffreddamento' },
          ...filteredStructures.ingresso,
          ...filteredStructures.sottocentrale,
        ],
      };
    },
  }),
  graphql(ChartsQuery, {
    options: ({ startDate, endDate, structType, structId }) => {
      return {
        fetchPolicy: 'cache-and-network',
        variables: { startDate, endDate, structType, structId },
      };
    },
    props: ({ data: { loading, chart } }) => ({
      loading,
      chart,
    }),
  }),
)(ChartsSection);
