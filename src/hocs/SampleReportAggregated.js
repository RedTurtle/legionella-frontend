// @flow
import * as React from 'react';
import { Component } from 'react';
import type { AlertLevels } from '../helpers/types.js.flow';
import { filter } from 'graphql-anywhere';
import SampleReportOverlay from '../components/SampleReportOverlay';
import sampleReportFragments from '../graphql/fragments/report';

type State = {
  coldBioxOverlayIsOpen: boolean,
  hotBioxOverlayIsOpen: boolean,
  coldLegionellaOverlayIsOpen: boolean,
  hotLegionellaOverlayIsOpen: boolean,
  coldTemperatureOverlayIsOpen: boolean,
  hotTemperatureOverlayIsOpen: boolean,
  coldFlowTemperatureOverlayIsOpen: boolean,
  hotFlowTemperatureOverlayIsOpen: boolean,
  overlayX: number,
  overlayY: number,
};

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
  structureLabel: string,
  structureType: string,
};

// type Props = {
//   aggregatedData?: AggregatedData,
// };
type Props = $FlowFixMe;

const getInitialState = (): State => ({
  coldBioxOverlayIsOpen: false,
  hotBioxOverlayIsOpen: false,
  coldLegionellaOverlayIsOpen: false,
  hotLegionellaOverlayIsOpen: false,
  coldTemperatureOverlayIsOpen: false,
  hotTemperatureOverlayIsOpen: false,
  coldFlowTemperatureOverlayIsOpen: false,
  hotFlowTemperatureOverlayIsOpen: false,
  overlayX: 0,
  overlayY: 0,
});

export function aggregatedReportWithOverlays(
  WrappedComponent: React.ComponentType<Props>,
) {
  class AggregatedReportWithOverlays extends Component<Props, State> {
    constructor(props: Props) {
      super(props);
      this.state = getInitialState();
    }

    openOverlay = (key: string, element: HTMLElement): void => {
      this.setState((state: State): State => {
        const k = `${key}OverlayIsOpen`;
        const dashboard = document.querySelector('.dashboard');
        if (state[k] || !dashboard || !dashboard.offsetTop) {
          return { ...state };
        } else {
          const rect = element.getBoundingClientRect();
          const scrollX: number = window.scrollX || window.pageXOffset;
          const scrollY: number = window.scrollY || window.pageYOffset;
          const x = (rect.right - rect.left) / 2 + rect.left + scrollX - 165; // 165 is half of the overlay width;
          const y = rect.bottom + scrollY - dashboard.offsetTop;
          return { ...getInitialState(), [k]: true, overlayX: x, overlayY: y };
        }
      });
    };

    generateRanges = (data: {
      values: ?(AggregatedData | AggregatedTemps),
      key: string,
    }) => {
      const { values, key } = data;
      const rangeValues: ?AlertLevels = values ? values[key] : null;
      if (!rangeValues) {
        return '';
      }
      const ranges = ['perfect', 'good', 'bad', 'danger', 'critical'];
      return ranges.map((range, id) => {
        const className = `range-${range}`;
        return (
          <span
            key={id}
            className={className}
            style={{ width: `${rangeValues[range]}%` }}
          />
        );
      });
    };

    closeOverlay = (): void => {
      this.setState(() => ({ ...getInitialState() }));
    };

    render() {
      const {
        coldBioxOverlayIsOpen,
        hotBioxOverlayIsOpen,
        coldLegionellaOverlayIsOpen,
        hotLegionellaOverlayIsOpen,
        coldTemperatureOverlayIsOpen,
        hotTemperatureOverlayIsOpen,
        coldFlowTemperatureOverlayIsOpen,
        hotFlowTemperatureOverlayIsOpen,
        overlayX,
        overlayY,
      } = this.state;
      const { aggregatedData } = this.props;

      const overflows = filter(
        sampleReportFragments.sampleReportOverlay,
        this.props.aggregatedData,
      );
      const coldTemperatureOverlay =
        !!aggregatedData && coldTemperatureOverlayIsOpen ? (
          <SampleReportOverlay
            structureLabel={aggregatedData.structureLabel}
            structureType={aggregatedData.structureType}
            data={overflows.overlayTemps.coldTemperature}
            onCloseClick={this.closeOverlay}
            x={overlayX}
            y={overlayY}
            overlayTitle="Rapporti di prova - Acqua fredda"
            rangeType="temp"
          />
        ) : null;
      const hotTemperatureOverlay =
        !!aggregatedData && hotTemperatureOverlayIsOpen ? (
          <SampleReportOverlay
            structureLabel={aggregatedData.structureLabel}
            structureType={aggregatedData.structureType}
            data={overflows.overlayTemps.hotTemperature}
            onCloseClick={this.closeOverlay}
            x={overlayX}
            y={overlayY}
            overlayTitle="Rapporti di prova - Acqua calda"
            rangeType="temp"
          />
        ) : null;
      const coldFlowTemperatureOverlay =
        !!aggregatedData && coldFlowTemperatureOverlayIsOpen ? (
          <SampleReportOverlay
            structureLabel={aggregatedData.structureLabel}
            structureType={aggregatedData.structureType}
            data={overflows.overlayTemps.coldFlowTemperature}
            onCloseClick={this.closeOverlay}
            x={overlayX}
            y={overlayY}
            overlayTitle="Rapporti di prova - Acqua fredda dopo scorrimento"
            rangeType="temp"
          />
        ) : null;
      const hotFlowTemperatureOverlay =
        !!aggregatedData && hotFlowTemperatureOverlayIsOpen ? (
          <SampleReportOverlay
            structureLabel={aggregatedData.structureLabel}
            structureType={aggregatedData.structureType}
            data={overflows.overlayTemps.hotFlowTemperature}
            onCloseClick={this.closeOverlay}
            x={overlayX}
            y={overlayY}
            overlayTitle="Rapporti di prova - Acqua calda dopo scorrimento"
            rangeType="temp"
          />
        ) : null;
      const coldLegionellaOverlay =
        !!aggregatedData && coldLegionellaOverlayIsOpen ? (
          <SampleReportOverlay
            structureLabel={aggregatedData.structureLabel}
            structureType={aggregatedData.structureType}
            data={overflows.overlayLegionellaCold}
            onCloseClick={this.closeOverlay}
            x={overlayX}
            y={overlayY}
            overlayTitle="Rapporti di prova UFC/L in acqua fredda"
            rangeType="ufcl"
          />
        ) : null;
      const hotLegionellaOverlay =
        !!aggregatedData && hotLegionellaOverlayIsOpen ? (
          <SampleReportOverlay
            structureLabel={aggregatedData.structureLabel}
            structureType={aggregatedData.structureType}
            data={overflows.overlayLegionellaHot}
            onCloseClick={this.closeOverlay}
            x={overlayX}
            y={overlayY}
            overlayTitle="Rapporti di prova UFC/L in acqua calda"
            rangeType="ufcl"
          />
        ) : null;
      const coldBioxOverlay =
        !!aggregatedData && coldBioxOverlayIsOpen ? (
          <SampleReportOverlay
            structureLabel={aggregatedData.structureLabel}
            structureType={aggregatedData.structureType}
            data={overflows.overlayBioxCold}
            onCloseClick={this.closeOverlay}
            x={overlayX}
            y={overlayY}
            overlayTitle="Rapporti di prova Biossido di cloro in acqua fredda"
            rangeType="diox"
          />
        ) : null;
      const hotBioxOverlay =
        !!aggregatedData && hotBioxOverlayIsOpen ? (
          <SampleReportOverlay
            structureLabel={aggregatedData.structureLabel}
            structureType={aggregatedData.structureType}
            data={overflows.overlayBioxHot}
            onCloseClick={this.closeOverlay}
            x={overlayX}
            y={overlayY}
            overlayTitle="Rapporti di prova Biossido di cloro in acqua fredda"
            rangeType="diox"
          />
        ) : null;
      return (
        <WrappedComponent
          {...this.props}
          coldTemperatureOverlay={coldTemperatureOverlay}
          coldFlowTemperatureOverlay={coldFlowTemperatureOverlay}
          hotTemperatureOverlay={hotTemperatureOverlay}
          hotFlowTemperatureOverlay={hotFlowTemperatureOverlay}
          coldLegionellaOverlay={coldLegionellaOverlay}
          hotLegionellaOverlay={hotLegionellaOverlay}
          coldBioxOverlay={coldBioxOverlay}
          hotBioxOverlay={hotBioxOverlay}
          openOverlay={this.openOverlay}
          generateRanges={this.generateRanges}
        />
      );
    }
  }
  AggregatedReportWithOverlays.displayName = `AggregatedReportWithOverlays(${getDisplayName(
    WrappedComponent,
  )})`;
  return AggregatedReportWithOverlays;
}

const getDisplayName = (WrappedComponent: React.ComponentType<Props>): string =>
  WrappedComponent.displayName || WrappedComponent.name || 'Component';
