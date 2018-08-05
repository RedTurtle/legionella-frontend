// @flow
import './index.css';
import DateRangeWrapper from '../DateRangeWrapper';
import FormDeleteButton from '../FormDeleteButton';
import MdClose from 'react-icons/lib/md/close';
import React from 'react';
import FieldWithValidation from '../FieldWithValidation';
import ReviewDateField from '../reportFormFields/ReviewDateField';
import SampleRangeField from '../reportFormFields/SampleRangeField';
import SampleReportFormActionsContainer from '../../containers/SampleReportFormActionsContainer';
import SampleReportMeasureField from '../reportFormFields/SampleReportMeasureField';
import SelectWspContainer from '../../containers/SelectWspContainer';
import moment from 'moment';
import type { SampleRangeFormState } from '../../reducers/sampleRangeForm';

type Props = {
  sampleRangeForm: $PropertyType<SampleRangeFormState, 'fields'>,
  formErrors: $PropertyType<SampleRangeFormState, 'formErrors'>,
  formMode: string,
  menuIsOpen: boolean,
  samplingValues: Array<$FlowFixMe>,
  legionellaTypes: Array<$FlowFixMe>,
  validationErrors: $PropertyType<SampleRangeFormState, 'validationErrors'>,
  ranges: Array<$FlowFixMe>,
  selectedWsp: string,
  wsps: Array<$FlowFixMe>,
  canDeleteReport: boolean,
  onDeleteReport: () => void,
  onCloseMenu: ({ resetForm?: boolean }) => void,
  handleFormSubmit: () => void,
  onUpdateSelectField: ({
    options: Array<$FlowFixMe>,
    selectedOption: string,
    fieldName: string,
  }) => void,
  onUpdateDateField: ({
    value: string,
    fieldName: string,
  }) => void,
  onUpdateLegionellaField: () => void,
  onSetFormFieldState: ({
    notesActions: Array<$FlowFixMe>,
  }) => void,
};

const SampleForm = (props: Props) => {
  const {
    sampleRangeForm,
    formErrors,
    formMode,
    samplingValues,
    legionellaTypes,
    validationErrors,
    ranges,
    selectedWsp,
    canDeleteReport,
    onDeleteReport,
    onCloseMenu,
    handleFormSubmit,
    onUpdateSelectField,
    onUpdateDateField,
    onUpdateLegionellaField,
    onSetFormFieldState,
    wsps,
    menuIsOpen,
  } = props;

  let errorMessage = '';
  if (formErrors) {
    errorMessage = (
      <div className="error-message">
        Si sono verificati degli errori nella sottomissione del form:
        {formErrors.validationErrors
          ? formErrors.validationErrors.map((error, idx) => (
              <div
                className="error-message-text"
                key={`validation-error-${idx}`}
              >
                {error}
              </div>
            ))
          : null}
        {formErrors.graphQLErrors
          ? formErrors.graphQLErrors.map((error, idx) => (
              <div className="error-message-text" key={`graphql-error-${idx}`}>
                {error}
              </div>
            ))
          : null}
        {formErrors.networkErrors ? (
          <div className="error-message-text">Errore di connessione.</div>
        ) : null}
      </div>
    );
  } else if (validationErrors) {
    errorMessage = (
      <div className="error-message">
        Impossibile salvare. Correggi prima gli errori evidenziati.
      </div>
    );
  }

  const deleteReport =
    formMode === 'edit' && canDeleteReport ? (
      <p className="delete-report">
        oppure{' '}
        <FormDeleteButton
          confirmAction={onDeleteReport}
          valueId={sampleRangeForm.reportId}
          elementType="rapporto di campionamento"
        />
        <span> il campionamento per questo WSP</span>
      </p>
    ) : null;

  let titleLabel = '';
  let confirmButtonLabel = '';
  switch (formMode) {
    case 'view':
      titleLabel = 'Visualizza';
      break;
    case 'edit':
      titleLabel = 'Aggiorna';
      confirmButtonLabel = 'Salva';
      break;
    case 'add':
      titleLabel = 'Aggiungi';
      confirmButtonLabel = 'Crea';
      break;
    default:
      break;
  }

  return (
    <div className="AddSample">
      <div className="AddSampleHeader">
        <h2 className="AddSampleHeaderLabel">
          {titleLabel} rapporto di campionamento
        </h2>
        <button type="button" onClick={onCloseMenu}>
          <MdClose />
        </button>
      </div>
      <form className="form" onSubmit={handleFormSubmit}>
        <FieldWithValidation
          required={true}
          resetState={!menuIsOpen}
          value={sampleRangeForm.sampleRange || ''}
          render={({ value, handleValidation, required, error }) => (
            <SampleRangeField
              value={value}
              options={ranges}
              disabled={formMode !== 'add'}
              handleBlur={handleValidation}
              onHandleChange={option =>
                onUpdateSelectField({
                  options: ranges,
                  selectedOption: option,
                  fieldName: 'sampleRange',
                })
              }
              required={required}
              error={error}
            />
          )}
        />
        <FieldWithValidation
          required={true}
          resetState={!menuIsOpen}
          value={sampleRangeForm.wsp ? sampleRangeForm.wsp : ''}
          render={({ value, handleValidation, required, error }) => (
            <SelectWspContainer
              wsps={wsps}
              disabled={formMode !== 'add'}
              value={value}
              onBlur={handleValidation}
              onChange={(wsps, option) =>
                onUpdateSelectField({
                  options: wsps,
                  selectedOption: option,
                  fieldName: 'wsp',
                })
              }
              required={required}
              error={error}
            />
          )}
        />
        <div className="Field">
          <h3 className="FieldName">Rapporto di campionamento</h3>
          <span className="FieldDescription">Data di campionamento</span>
          <div className="date-range-wrapper">
            <DateRangeWrapper
              disabled={formMode !== 'add'}
              calendarType="single"
              startDate={
                sampleRangeForm.samplingDate.length > 0
                  ? moment(sampleRangeForm.samplingDate)
                  : undefined
              }
              handleDateChange={value => {
                return onUpdateDateField({
                  value,
                  fieldName: 'samplingDate',
                });
              }}
            />
          </div>
          <SampleReportMeasureField
            label="Acqua fredda"
            fieldId="cold"
            sampleRangeForm={sampleRangeForm}
            onChangeHandler={onUpdateLegionellaField}
            samplingValues={samplingValues}
            legionellaTypes={legionellaTypes}
            selectedWsp={selectedWsp}
          />
          <SampleReportMeasureField
            label="Acqua fredda dopo scorrimento"
            fieldId="coldFlow"
            sampleRangeForm={sampleRangeForm}
            onChangeHandler={onUpdateLegionellaField}
            samplingValues={samplingValues}
            legionellaTypes={legionellaTypes}
            selectedWsp={selectedWsp}
          />
          <SampleReportMeasureField
            label="Acqua calda"
            fieldId="hot"
            sampleRangeForm={sampleRangeForm}
            onChangeHandler={onUpdateLegionellaField}
            samplingValues={samplingValues}
            legionellaTypes={legionellaTypes}
            selectedWsp={selectedWsp}
          />
          <SampleReportMeasureField
            label="Acqua calda dopo scorrimento"
            fieldId="hotFlow"
            sampleRangeForm={sampleRangeForm}
            onChangeHandler={onUpdateLegionellaField}
            samplingValues={samplingValues}
            legionellaTypes={legionellaTypes}
            selectedWsp={selectedWsp}
          />
        </div>
        <div className="Field">
          <h3 className="FieldName">Note e azioni di campionamento</h3>
          <span className="FieldDescription">
            Seleziona da un set predefinito o aggiungi testo libero
          </span>
          {sampleRangeForm.notesActions &&
          sampleRangeForm.notesActions.length > 0 ? (
            <SampleReportFormActionsContainer
              actions={sampleRangeForm.notesActions}
              onActionChange={notesActions =>
                onSetFormFieldState({
                  notesActions,
                })
              }
            />
          ) : null}
        </div>
        {/* <div className="Field">
          <h3 className="FieldName">Situazione WSP dopo campionamento</h3>
          <span className="FieldDescription">
            Seleziona da un set predefinito o aggiungi testo libero
          </span>
          <div className="SamplingActionFields">
            <div className="SamplingActionField">
              <label>
                <input type="checkbox" name="after_sample_one" />
                <span>Filtri assoluti permanenti</span>
              </label>
            </div>
            <div className="SamplingActionField">
              <label>
                <input type="checkbox" name="after_sample_two" />
                <span>Filtri assoluti temporanei</span>
              </label>
            </div>
            <div className="SamplingActionField">
              <label>
                <input type="checkbox" name="after_sample_three" />
                <span>Chiuso</span>
              </label>
            </div>
            <div className="SamplingActionField">
              <label>
                <input type="checkbox" name="after_sample_four" />
                <span>In funzione</span>
              </label>
            </div>
          </div>
        </div> */}
        <ReviewDateField
          value={sampleRangeForm.reviewDate || ''}
          onHandleChange={onUpdateSelectField}
        />
        <div className="Controls">
          {errorMessage}
          {formMode !== 'view' ? (
            <button className="Save" type="submit" disabled={validationErrors}>
              {confirmButtonLabel}
            </button>
          ) : null}
          <button
            className="Cancel"
            type="button"
            onClick={() => onCloseMenu({ resetForm: true })}
          >
            Annulla
          </button>
        </div>
        {deleteReport}
      </form>
    </div>
  );
};

export default SampleForm;
