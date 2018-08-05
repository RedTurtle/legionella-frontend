// @flow
import React, { Component } from 'react';
import moment from 'moment';
import ClickOutComponent from 'react-onclickout';
import './styles.css';
import {
  CalendarButton,
  CalendarPicker,
} from '../../components/CalendarComponents';

type State = { calendarIsOpen: boolean };
type Props = {
  calendarType: string,
  handleDateChange: $FlowFixMe,
  onBlur?: $FlowFixMe,
  startDate?: $FlowFixMe,
  endDate?: $FlowFixMe,
  disabled?: boolean,
};

class DateRangeWrapper extends Component<Props, State> {
  static defaultProps = {
    calendarType: 'range',
  };

  constructor() {
    super();
    this.state = {
      calendarIsOpen: false,
      // startDate: moment(),
      // endDate: moment().add(1, 'weeks'),
    };
  }

  // https://discuss.reactjs.org/t/handling-global-click-events/6897/8
  // Non so se sia la soluzione migliore
  onClickOut = (event: Event): void => {
    if (this.state.calendarIsOpen) {
      //call onBlur function only when calendar is open, unless this is
      // called on every click outside calendar
      this.props.onBlur && this.props.onBlur();
    }
    this.closeCalendar();
  };

  closeCalendar = (): void =>
    this.setState((): State => ({
      calendarIsOpen: false,
    }));

  handleOpenCloseCalendar = (): void => {
    this.setState((prevState): State => ({
      calendarIsOpen: !prevState.calendarIsOpen,
    }));
  };

  render() {
    const { calendarType, disabled } = this.props;
    const startDate = this.props.startDate ? this.props.startDate : moment();
    const endDate =
      calendarType !== 'single'
        ? this.props.endDate ? this.props.endDate : startDate.add(1, 'weeks')
        : undefined;

    return disabled ? (
      <div className="review-date-view">{startDate.format('DD-MM-YYYY')}</div>
    ) : (
      <ClickOutComponent onClickOut={this.onClickOut}>
        <div className={`date-range-wrapper ${calendarType}`}>
          <CalendarButton
            handleOpenCloseCalendar={this.handleOpenCloseCalendar}
            calendarIsOpen={this.state.calendarIsOpen}
            startDate={startDate}
            endDate={endDate}
            selectedLanguage="it"
          />
          {this.state.calendarIsOpen && (
            <CalendarPicker
              startDate={moment()}
              endDate={moment().add(1, 'weeks')}
              handleOpenCloseCalendar={this.handleOpenCloseCalendar}
              selectedLanguage="it"
              {...this.props}
            />
          )}
        </div>
      </ClickOutComponent>
    );
  }
}

export default DateRangeWrapper;
