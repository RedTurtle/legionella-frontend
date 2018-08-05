// @flow
import * as React from 'react';
import { Component } from 'react';

type Props = $FlowFixMe;

export function freezedReport(WrappedComponent: React.ComponentType<Props>) {
  class FreezedReport extends Component<Props> {
    render() {
      return (
        <WrappedComponent
          {...this.props}
          report={this.getCurrentReportData()}
        />
      );
    }
  }
  FreezedReport.displayName = `FreezedReport(${getDisplayName(
    WrappedComponent,
  )})`;
  return FreezedReport;
}

const getDisplayName = (WrappedComponent: React.ComponentType<Props>): string =>
  WrappedComponent.displayName || WrappedComponent.name || 'Component';
