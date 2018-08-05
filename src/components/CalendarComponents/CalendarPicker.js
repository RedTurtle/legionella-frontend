// @flow
import React from 'react';
import { DateRange, Calendar } from 'react-date-range';
import MdClose from 'react-icons/lib/md/close';

/**
 * CalendarPicker per DateRangeWrapper
 *
 * @see Vedi [DateRangeWrapper](#daterangewrapper)
 */
const CalendarPicker = ({
  startDate,
  endDate,
  selectedLanguage = 'it',
  handleOpenCloseCalendar,
  handleDateChange,
  calendarType = 'range',
}: {
  startDate: *,
  endDate: *,
  selectedLanguage?: string,
  handleOpenCloseCalendar: () => mixed,
  handleDateChange: () => mixed,
  calendarType: string,
}) => {
  const calendar =
    calendarType === 'range' ? (
      <DateRange
        startDate={startDate}
        endDate={endDate}
        onChange={handleDateChange}
        lang={selectedLanguage}
        twoStepChange
      />
    ) : (
      <Calendar
        date={startDate}
        lang={selectedLanguage}
        onChange={handleDateChange}
      />
    );

  return (
    <div className="calendar-picker">
      <div className="picker-close">
        <button onClick={handleOpenCloseCalendar}>
          <MdClose />
        </button>
      </div>
      {calendar}
    </div>
  );
};

export default CalendarPicker;
