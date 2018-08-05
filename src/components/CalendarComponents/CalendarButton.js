// @flow
import React from 'react';
import FaCaretDown from 'react-icons/lib/fa/caret-down';
import FaCaretUp from 'react-icons/lib/fa/caret-up';
import CalendarIcon from './CalendarIcon';
import 'moment/locale/it';
/**
 * Bottone per mostrare/nascondere il CalendarPicker
 *
 * @see Vedi [DateRangeWrapper](#daterangewrapper)
 */
const CalendarButton = ({
  handleOpenCloseCalendar,
  calendarIsOpen,
  startDate,
  endDate,
  selectedLanguage = 'it',
}: {
  handleOpenCloseCalendar: () => mixed,
  calendarIsOpen: boolean,
  startDate: *,
  endDate: *,
  selectedLanguage?: string,
}) => {
  let dates = '';
  if (startDate) {
    dates = startDate.locale(selectedLanguage).format('LL');
    if (endDate) {
      dates = `${dates} - ${endDate.locale(selectedLanguage).format('LL')}`;
    }
  }

  return (
    <button
      type="button"
      className="calendar-button"
      onClick={handleOpenCloseCalendar}
    >
      <CalendarIcon />
      <span className="calendar-dates">{dates}</span>
      <div className="caret-wrapper">
        {calendarIsOpen ? <FaCaretUp /> : <FaCaretDown />}
      </div>
    </button>
  );
};

export default CalendarButton;
