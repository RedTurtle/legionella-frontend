// @flow

import './index.css';
import moment from 'moment';
import * as React from 'react';
import {
  addErrorMessage,
  updateFormField,
} from '../../actions/sampleRangeForm';
import { compose, graphql } from 'react-apollo';
import Select from 'react-select';
import DateRangeWrapper from '../../components/DateRangeWrapper';
import FormDeleteButton from '../../components/FormDeleteButton';
import MdClose from 'react-icons/lib/md/close';
import { connect } from 'react-redux';
import { openCloseMenu } from '../../actions/menu';
import { SampleRangeDetailsQuery } from '../../graphql/queries/sampleRanges';
import { DashboardQuery } from '../../graphql/queries/sampleRanges';
import { SettingsQuery } from '../../graphql/queries/settings';
import FieldWithValidation from '../../components/FieldWithValidation';
import {
  CreateSampleRangeMutation,
  UpdateSampleRangeMutation,
  DeleteSampleRangeMutation,
} from '../../graphql/mutations/sampleRanges';
import client from '../../helpers/create-apollo-client';
import { sampleRange as requiredFields } from '../../constants/requiredFields';

type State = {
  fields: {
    datesList: Array<any>,
    company: ?string,
    title: ?string,
    description: ?string,
    filterOn: boolean,
  },
  error: ?string,
  validationError: boolean,
};
type Props = {
  formMode: ?string,
  menuIsOpen: boolean,
  submit: $FlowFixMe,
  openCloseMenu: $FlowFixMe,
  sampleRange: $FlowFixMe,
  companies: $FlowFixMe,
  sampleRangeId: string,
  update: $FlowFixMe,
  deleteMutation: $FlowFixMe,
};

const initialState = {
  fields: {
    datesList: [],
    company: '',
    title: '',
    description: '',
    filterOn: false,
  },
  error: null,
  validationError: false,
};

class SampleRangeFormContainer extends React.Component<Props, State> {
  constructor() {
    super();
    this.state = initialState;
  }

  componentWillReceiveProps(nextProps) {
    const { sampleRange, formMode, menuIsOpen } = nextProps;
    const previousFormMode = this.props.formMode;
    if (!menuIsOpen && this.state.error) {
      this.setState({ ...this.state, error: null });
    }
    if (formMode === 'add' && formMode !== previousFormMode) {
      this.setState(Object.assign({}, initialState));
    } else {
      if (sampleRange) {
        const fields = Object.keys(this.state.fields).reduce(
          (newFields, key) => {
            const value = sampleRange[key];
            if (value) {
              newFields[key] = value;
            } else {
              newFields[key] = this.state.fields[key];
            }
            return newFields;
          },
          {},
        );
        // $FlowFixMe
        this.setState({ ...this.state, fields });
      }
    }
  }

  resetState = () => {
    this.setState(Object.assign({}, this.state, initialState));
  };

  hasValidationError = () => {
    const { fields } = this.state;
    const validationResult = Object.keys(fields).reduce(
      (validation, fieldId) => {
        if (!validation) {
          return validation;
        }
        if (!requiredFields.includes(fieldId)) {
          return validation;
        }
        const value = fields[fieldId];
        // $FlowFixMe
        return value !== null && value !== undefined && value.length > 0;
      },
      true,
    );
    return !validationResult;
  };

  updateField = data => {
    const { value, fieldName } = data;
    const newFields = { ...this.state.fields, [fieldName]: value };
    this.setState({
      ...this.state,
      fields: newFields,
      validationError: false,
    });
  };

  updateCheckboxField = data => {
    const { fieldName } = data;
    const newFields = {
      ...this.state.fields,
      [fieldName]: !this.state.fields[fieldName],
    };
    this.setState({
      ...this.state,
      fields: newFields,
      validationError: false,
    });
  };

  updateDateList = date => {
    this.setState((state: State): State => {
      if (!state.fields.datesList.includes(date.format('YYYY-MM-DD'))) {
        const newFields = {
          ...this.state.fields,
          datesList: [...state.fields.datesList, date.format('YYYY-MM-DD')],
        };
        return {
          ...state,
          fields: newFields,
          validationError: false,
        };
      }
      return { ...state, validationError: false };
    });
  };

  removeDateFromList = date => {
    const newFields = {
      ...this.state.fields,
      datesList: this.state.fields.datesList.filter(
        dateItem => dateItem !== date,
      ),
    };
    this.setState({
      ...this.state,
      fields: newFields,
      validationError: false,
    });
  };

  closeMenu = ({ resetForm }) => {
    this.props.openCloseMenu();
    if (resetForm) {
      this.setState(initialState);
    }
  };

  addNewSampleRange = () => {
    const { submit, openCloseMenu } = this.props;
    const { fields } = this.state;
    const validationError = this.hasValidationError();
    if (validationError) {
      this.setState({
        ...this.state,
        validationError,
      });
      return;
    }
    submit({ input: fields })
      .then(({ data }) => {
        openCloseMenu();
        this.setState(initialState);
        //BBB need to refactor. Better approach should be re-fetch queries,
        client.resetStore();
      })
      .catch(error => this.handleErrors(error));
  };

  editSampleRange = () => {
    const { update, openCloseMenu, sampleRangeId } = this.props;
    const validationError = this.hasValidationError();
    if (validationError) {
      this.setState({
        ...this.state,
        validationError,
      });
      return;
    }
    //filter parameters only with the ones accepted by the mutation
    const fields = { ...this.state.fields };
    fields.samplerangeId = sampleRangeId;

    update({ input: fields, sampleRangeId })
      .then(({ data }) => {
        openCloseMenu();
        this.setState(initialState);
      })
      .catch(error => this.handleErrors(error));
  };

  deleteSampleRange = () => {
    const { deleteMutation, openCloseMenu, sampleRangeId } = this.props;
    const data = { samplerangeId: sampleRangeId };
    deleteMutation({ input: data })
      .then(({ data }) => {
        openCloseMenu();
        this.setState(initialState);
        //BBB need to refactor. Better approach should be re-fetch queries,
        //but the list seems doesn't get updated
        setTimeout(() => client.resetStore(), 1000);
      })
      .catch(error => this.handleErrors(error));
  };

  handleErrors = error => {
    console.trace(error);
    let errorMessage = '';
    const graphQLErrors = error.graphQLErrors;
    const networkError = error.networkError;
    if (graphQLErrors && graphQLErrors.length > 0) {
      errorMessage = graphQLErrors.map(errorItem => errorItem.message);
    }
    if (networkError) {
      errorMessage =
        "Errore di connessione. Impossiible salvare l'intervallo di campionamento.";
    }
    this.setState(
      Object.assign({}, this.state, {
        error: errorMessage,
      }),
    );
  };

  handleSubmit = e => {
    e.preventDefault();
    this.addNewSampleRange();
  };

  handleEdit = e => {
    e.preventDefault();
    this.editSampleRange();
  };

  render() {
    const { error, validationError } = this.state;
    const {
      datesList,
      filterOn,
      company,
      title,
      description,
    } = this.state.fields;
    const { formMode, companies, menuIsOpen } = this.props;
    const companiesList = companies
      ? companies.edges.map(({ node }) => {
          return { value: node.value, label: node.value };
        })
      : [];
    let errorMessage = '';
    if (error) {
      errorMessage = (
        <div className="error-message">
          Si &egrave; verificato un errore nella sottomissione del form:
          <div className="error-message-text" key="idx">
            {error}
          </div>
        </div>
      );
    } else if (validationError) {
      errorMessage = (
        <div className="error-message">
          <div className="error-message-text" key="idx">
            Impossibile salvare. Tutti i campi obbligatori devono essere
            compilati.
          </div>
        </div>
      );
    }

    const deleteSampleRange =
      formMode === 'edit' ? (
        <div className="delete-report">
          oppure{' '}
          <FormDeleteButton
            confirmAction={this.deleteSampleRange}
            valueId={this.props.sampleRangeId}
            elementType="intervallo di campionamento"
          />
          <span> questo intervallo di campionamento</span>
        </div>
      ) : null;

    return (
      <div className="AddSample sample-range-form">
        <div className="AddSampleHeader">
          <h2 className="AddSampleHeaderLabel">
            {formMode === 'edit' ? 'Aggiorna' : 'Aggiungi nuovo'} intervallo di
            campionamento
          </h2>
          <button type="button" onClick={this.closeMenu}>
            <MdClose />
          </button>
        </div>
        <form
          className="form"
          onSubmit={formMode === 'edit' ? this.handleEdit : this.handleSubmit}
        >
          <div className="Field">
            <h3 className="FieldName">Campionamento</h3>
            <FieldWithValidation
              required={true}
              value={datesList}
              resetState={!menuIsOpen}
              render={({ value, handleValidation, required, error }) => (
                <React.Fragment>
                  <span className="FieldDescription">
                    Date dei campionamenti{required && (
                      <span
                        title="Campo obbligatorio"
                        className="required-label"
                      />
                    )}
                  </span>
                  <div className="date-range">
                    <div className="dates">
                      {error ? (
                        <div className="error-message">{error}</div>
                      ) : null}
                      <DateRangeWrapper
                        calendarType="single"
                        onBlur={handleValidation}
                        handleDateChange={this.updateDateList}
                        key="date-field"
                      />
                      <ul key="dates-list">
                        {datesList.map((date, idx) => (
                          <li key={idx}>
                            {moment(date).format('DD-MM-YYYY')}{' '}
                            <button
                              type="button"
                              onClick={() => this.removeDateFromList(date)}
                              title="Rimuovi data"
                            >
                              <MdClose />
                            </button>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="filter">
                      <label>
                        <span className="FieldDescription">
                          Campionamenti con filtri
                        </span>
                        <input
                          type="checkbox"
                          name="filterOn"
                          checked={filterOn}
                          onChange={event =>
                            this.updateCheckboxField({
                              event,
                              fieldName: 'filterOn',
                            })
                          }
                        />
                      </label>
                    </div>
                  </div>
                </React.Fragment>
              )}
            />
            <label>
              <FieldWithValidation
                required={true}
                resetState={!menuIsOpen}
                value={company}
                render={({ value, handleValidation, required, error }) => (
                  <React.Fragment>
                    <span className="FieldDescription">
                      Azienda / Laboratorio{required && (
                        <span
                          title="Campo obbligatorio"
                          className="required-label"
                        />
                      )}
                    </span>
                    {error ? (
                      <div className="error-message">{error}</div>
                    ) : null}
                    <Select
                      name="company"
                      value={company}
                      options={companiesList}
                      clearable={false}
                      placeholder="Seleziona..."
                      onBlur={handleValidation}
                      onChange={option =>
                        this.updateField({
                          value: option.value,
                          fieldName: 'company',
                        })
                      }
                    />
                  </React.Fragment>
                )}
              />
            </label>
            <hr />
            <label>
              <FieldWithValidation
                required={true}
                value={title}
                resetState={!menuIsOpen}
                render={({ value, handleValidation, required, error }) => (
                  <React.Fragment>
                    <span className="FieldDescription">
                      Titolo{required && (
                        <span
                          title="Campo obbligatorio"
                          className="required-label"
                        />
                      )}
                    </span>
                    {error ? (
                      <div className="error-message">{error}</div>
                    ) : null}
                    <input
                      type="text"
                      name="title"
                      value={value}
                      onBlur={handleValidation}
                      onChange={event =>
                        this.updateField({
                          value: event.target.value,
                          fieldName: 'title',
                        })
                      }
                    />
                  </React.Fragment>
                )}
              />
            </label>
            <label>
              <span className="FieldDescription">Descrizione, note</span>
              <textarea
                name="description"
                value={description}
                onChange={event =>
                  this.updateField({
                    value: event.target.value,
                    fieldName: 'description',
                  })
                }
              />
            </label>
          </div>
          <div className="Controls">
            {errorMessage}
            <button className="Save" type="submit" disabled={validationError}>
              {formMode === 'edit' ? 'Modifica' : 'Salva'}
            </button>
            <button
              className="Cancel"
              type="button"
              onClick={() => this.closeMenu({ resetForm: true })}
            >
              Annulla
            </button>
          </div>
          {deleteSampleRange}
        </form>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  formMode: state.menu.formMode,
  menuIsOpen: state.menu.open,
  sampleRangeId: state.menu.sampleRangeId,
});

const actionMethods = {
  openCloseMenu,
  updateFormField,
  addErrorMessage,
};

// $FlowFixMe
export default connect(mapStateToProps, actionMethods)(
  compose(
    // $FlowFixMe
    graphql(SampleRangeDetailsQuery, {
      options: ({ sampleRangeId }) => ({
        variables: { id: sampleRangeId },
        fetchPolicy: 'cache-and-network',
      }),
      skip: ({ sampleRangeId }) => !sampleRangeId,
      props: ({ data: { loading, sampleRange } }) => ({
        loading,
        sampleRange,
      }),
    }),
    // $FlowFixMe
    graphql(SettingsQuery, {
      // $FlowFixMe
      options: () => ({
        variables: { settingType: 'company' },
      }),
      props: ({ data: { loading, settings } }) => ({
        loading,
        companies: settings,
      }),
    }),
    // $FlowFixMe
    graphql(CreateSampleRangeMutation, {
      props: ({ mutate }) => ({
        submit: ({ input }) => {
          return mutate({
            variables: { input },
          });
        },
      }),
    }),
    // $FlowFixMe
    graphql(UpdateSampleRangeMutation, {
      props: ({ mutate }) => ({
        update: input => {
          return mutate({
            variables: { ...input }, // $FlowFixMe
            refetchQueries: [
              {
                query: DashboardQuery,
              },
            ],
          });
        },
      }),
    }),
    // $FlowFixMe
    graphql(DeleteSampleRangeMutation, {
      props: ({ mutate }) => ({
        deleteMutation: input => {
          return mutate({
            variables: { ...input },
            // $FlowFixMe
          });
        },
      }),
    }),
  )(SampleRangeFormContainer),
);
