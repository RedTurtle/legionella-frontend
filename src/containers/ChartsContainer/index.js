// @flow
import React, { Component } from 'react';
import ChartsSection from '../../components/ChartsSection';
import moment from 'moment';

type State = {
  startDate: string,
  endDate: string,
  structType: ?string,
  structId: ?string,
  pastMonths: number,
};

class ChartsContainer extends Component<{}, State> {
  constructor() {
    super();
    this.state = {
      startDate: moment()
        .subtract(2, 'years')
        .format('YYYY-MM-DD'),
      endDate: moment().format('YYYY-MM-DD'),
      structType: '',
      structId: '',
      pastMonths: 24,
    };
  }

  updateStructureField = (data: any) => {
    this.setState({ ...this.state, ...data });
  };

  updateDateField = (months: number) => {
    this.setState({
      ...this.state,
      pastMonths: months,
      startDate: moment()
        .subtract(months, 'months')
        .format('YYYY-MM-DD'),
    });
  };

  render() {
    const chartsData = {
      rangeLevels: {
        perfect: 'Conformità assoluta',
        good: 'Conformità limitata',
        bad: 'Parziale NON conformità',
        danger: 'Grave NON conformità',
        critical: 'NON conformità Critica',
      },
      timeFrames: {
        options: [
          { value: 24, label: 'Situazione generale ad oggi' },
          { value: 3, label: 'Ultimi 3 mesi' },
          { value: 6, label: 'Ultimi 6 mesi' },
          { value: 12, label: 'Ultimo anno' },
        ],
        value: this.state.pastMonths,
      },
    };

    return (
      <ChartsSection
        {...this.state}
        onUpdateStructureField={this.updateStructureField}
        onUpdateDateField={this.updateDateField}
        {...chartsData}
      />
    );
  }
}

export default ChartsContainer;
