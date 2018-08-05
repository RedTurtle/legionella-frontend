// @flow

import 'react-select/dist/react-select.css';
import './index.css';
import React, { Component } from 'react';
import {
  addErrorMessage,
  updateFormField,
} from '../../actions/sampleRangeForm';
import { compose, graphql } from 'react-apollo';

import MdClose from 'react-icons/lib/md/close';
import MdWarning from 'react-icons/lib/md/warning';
import { connect } from 'react-redux';
import gql from 'graphql-tag';
import { openCloseMenu } from '../../actions/menu';
import Select from 'react-select';
import SettingsJsonFieldContainer from '../SettingsJsonFieldContainer';
import {
  CreateRangeLegionellaSettingsMutation,
  UpdateRangeLegionellaSettingsMutation,
} from '../../graphql/mutations/ranges';
import FieldWithValidation from '../../components/FieldWithValidation';

const fragments = {
  range: gql`
    fragment RangeDetails on Range {
      id
      coldTemperature
      coldFlowTemperature
      hotTemperature
      hotFlowTemperature
      chlorineDioxide
      ufcl
      rangeType {
        id
        value
        description
      }
    }
  `,
};

const RangeLegionellaSettingsFormQuery = gql`
  query {
    allRanges {
      edges {
        node {
          ...RangeDetails
        }
      }
    }
    settings(settingType: "struct_type") {
      edges {
        node {
          id
          value
          description
        }
      }
    }
  }
  ${fragments.range}
`;

type State = {
  rangeType: ?string,
  coldTemperature: $FlowFixMe,
  coldFlowTemperature: $FlowFixMe,
  hotTemperature: $FlowFixMe,
  hotFlowTemperature: $FlowFixMe,
  ufcl: $FlowFixMe,
  chlorineDioxide: $FlowFixMe,
  error: string,
  validationError: string,
  formDisabled: boolean,
};
type Props = {
  formMode: ?string,
  menuIsOpen: boolean,
  submit: $FlowFixMe,
  update: $FlowFixMe,
  openCloseMenu: $FlowFixMe,
  entryId: string,
  loading: boolean,
  allRanges: $FlowFixMe,
  settings: $FlowFixMe,
};

const initialState = {
  rangeType: '',
  coldTemperature: [],
  coldFlowTemperature: [],
  hotTemperature: [],
  hotFlowTemperature: [],
  ufcl: [],
  chlorineDioxide: [],
  error: '',
  validationError: '',
  formDisabled: false,
};

class RangeLegionellaSettingsFormContainer extends Component<Props, State> {
  static fragments = fragments;

  constructor() {
    super();
    this.state = initialState;
  }

  disableForm = () => {
    this.setState({
      ...this.state,
      formDisabled: true,
    });
  };

  enableForm = () => {
    this.setState({
      ...this.state,
      formDisabled: false,
    });
  };

  extractJsonFieldsValue(jsonValue) {
    // we set values to string, to handle them better on the input fields
    let value = JSON.parse(jsonValue);
    return value.length
      ? value.map(item => {
          item.to = item.to ? item.to.toString() : '';
          item.from = item.from ? item.from.toString() : '';
          return item;
        })
      : value;
  }

  convertJsonFieldsValue(value) {
    // get back to numeric format. If there is a problem, set an error and disable the form
    const fixedValue = value.length
      ? value.map(item => {
          const range = { ...item };
          if (range.to.length) {
            range.to = parseFloat(range.to);
          } else {
            delete range.to;
          }
          if (range.from.length) {
            range.from = parseFloat(range.from);
          } else {
            delete range.from;
          }
          return range;
        })
      : value;
    return JSON.stringify(fixedValue);
  }

  updateStateWithProps(props) {
    const { entryId, allRanges } = props;
    const jsonFields = [
      'coldTemperature',
      'coldFlowTemperature',
      'hotTemperature',
      'hotFlowTemperature',
      'ufcl',
      'chlorineDioxide',
    ];
    if (allRanges) {
      const matchRange = allRanges.edges.filter(
        ({ node }) => node.id === entryId,
      );
      const range = matchRange[0].node;
      if (range) {
        let newState = {};
        Object.keys(this.state).map(key => {
          const value =
            jsonFields.indexOf(key) === -1
              ? range[key]
              : this.extractJsonFieldsValue(range[key]);
          if (value) {
            if (key !== 'rangeType') {
              newState[key] = value;
            } else {
              newState[key] = value.id;
            }
          }
          return value;
        });

        this.setState({ ...this.state, ...newState });
      }
    }
  }

  componentWillMount() {
    this.updateStateWithProps(this.props);
  }

  componentWillReceiveProps(nextProps) {
    const { formMode } = nextProps;
    if (formMode === 'add') {
      this.setState(Object.assign({}, initialState));
    } else {
      this.updateStateWithProps(nextProps);
    }
  }

  resetState = () => {
    this.setState(initialState);
  };

  updateField = data => {
    const { event, fieldName } = data;
    this.setState({ ...this.state, [fieldName]: event.target.value });
  };

  updateSelectField = data => {
    const { value } = data;
    this.setState({ ...this.state, rangeType: value });
  };

  updateJSONField = infos => {
    const { data, stateField } = infos;
    const newState = [...this.state[stateField]];
    //BBB: in data c'è anche la priority aggiornata. Questa potrebbe servire per l'ordinamento
    newState[data.index][data.fieldId] = data.value;
    if (data.priority) newState[data.index].priority = data.priority;
    this.setState({ ...this.state, [stateField]: newState }, () =>
      this.validateForm(),
    );
  };

  generateMutationForm = () => {
    let formFields = { ...this.state };
    delete formFields.error;
    delete formFields.validationError;
    delete formFields.formDisabled;
    const jsonFields = [
      'coldTemperature',
      'coldFlowTemperature',
      'hotTemperature',
      'hotFlowTemperature',
      'ufcl',
      'chlorineDioxide',
    ];
    Object.keys(formFields).map(key => {
      if (jsonFields.indexOf(key) !== -1) {
        formFields[key] = this.convertJsonFieldsValue(formFields[key]);
      }
      return key;
    });
    return formFields;
  };

  removeJSONField = data => {
    const { index, stateField } = data;
    const newState = this.state[stateField]
      .filter((item, idx) => index !== idx)
      .map((item, index) => {
        return { ...item, priority: index };
      });
    this.setState({ ...this.state, [stateField]: newState });
  };

  addJsonItem = infos => {
    const { stateField } = infos;
    const newState = this.state[stateField].map(item => item);
    newState.push({
      priority: newState.length,
      to: '',
      from: '',
      level: '',
    });
    this.setState({ ...this.state, [stateField]: newState });
  };

  updateSortOnJsonField = data => {
    let { newIndex, oldIndex, values, stateField } = data;
    while (oldIndex < 0) {
      oldIndex += values.length;
    }
    while (newIndex < 0) {
      newIndex += values.length;
    }
    if (newIndex >= values.length) {
      var k = newIndex - values.length;
      while (k-- + 1) {
        values.push(undefined);
      }
    }
    values.splice(newIndex, 0, values.splice(oldIndex, 1)[0]);
    // update priority value
    values = values.map((item, index) => {
      return { ...item, priority: index };
    });
    this.setState(
      Object.assign({}, this.state, {
        [stateField]: values,
      }),
    );
  };

  closeMenu = ({ resetForm }) => {
    this.props.openCloseMenu();
    if (resetForm) {
      this.resetState();
    }
  };

  validateForm = () => {
    const jsonFields = [
      'coldTemperature',
      'coldFlowTemperature',
      'hotTemperature',
      'hotFlowTemperature',
      'ufcl',
      'chlorineDioxide',
    ];
    const hasError = Object.keys(this.state).reduce((error, key) => {
      if (error) {
        return error;
      }
      if (jsonFields.indexOf(key) === -1) {
        return error;
      }
      const value: $FlowFixMe = this.state[key] || [];
      return value.length
        ? value.reduce((valueError, item) => {
            if (valueError) {
              return valueError;
            }
            valueError =
              item.to.match(/^-?\d*((?:\.|,)\d+)?$/) === null ||
              item.from.match(/^-?\d*((?:\.|,)\d+)?$/) === null ||
              item.level === '';
            return valueError;
          }, false)
        : true;
    }, false);
    if (hasError) {
      this.setState({
        formDisabled: true,
        validationError:
          'Impossibile salvare. Correggi prima gli errori evidenziati e che i campi obbligatori siano tutti compilati.',
      });
    } else {
      if (this.state.formDisabled && this.state.validationError.length) {
        this.setState({
          formDisabled: false,
          validationError: '',
        });
      }
    }
    return hasError;
  };

  addNewRangeLegionellaSettings = () => {
    const hasValidationError = this.validateForm();
    if (hasValidationError) {
      return;
    }
    const { submit, openCloseMenu } = this.props;
    const formFields = this.generateMutationForm();

    submit({ input: formFields })
      .then(({ data }) => {
        openCloseMenu();
      })
      .catch(error => this.handleErrors(error));
  };

  editRangeLegionellaSettings = () => {
    const { update, openCloseMenu, entryId } = this.props;
    const hasValidationError = this.validateForm();
    if (hasValidationError) {
      return;
    }
    //filter parameters only with the ones accepted by the mutation
    let formFields = this.generateMutationForm();
    formFields.rangeId = entryId;

    update({ input: formFields })
      .then(({ data }) => {
        openCloseMenu();
      })
      .catch(error => this.handleErrors(error));
  };

  // deleteRangeLegionellaSettings = () => {
  //   const { deleteMutation, openCloseMenu, entryId } = this.props;
  //   const data = { samplerangeId: entryId };
  //   deleteMutation({ input: data })
  //     .then(({ data }) => {
  //       openCloseMenu();
  //     })
  //     .catch(error => this.handleErrors(error));
  // };

  handleErrors = (error: any) => {
    //if error isn't passed, reset the state
    if (!error) {
      this.setState({ ...this.state, error: '' });
      return;
    }
    console.trace(error);
    let errorMessage = '';
    const { graphQLErrors, networkError } = error;
    if (graphQLErrors && graphQLErrors.length > 0) {
      errorMessage = graphQLErrors.map(errorItem => errorItem.message);
    } else if (networkError) {
      errorMessage =
        "Errore di connessione. Impossible salvare l'intervallo di campionamento.";
    } else {
      errorMessage = error.message;
    }
    this.setState({
      ...this.state,
      error: errorMessage,
    });
  };

  handleSubmit = e => {
    e.preventDefault();
    this.addNewRangeLegionellaSettings();
  };

  handleEdit = e => {
    e.preventDefault();
    this.editRangeLegionellaSettings();
  };

  // handleDelete = e => {
  //   e.preventDefault();
  //   this.deleteRangeLegionellaSettings();
  // };

  render() {
    const {
      error,
      validationError,
      rangeType,
      coldTemperature,
      coldFlowTemperature,
      hotTemperature,
      hotFlowTemperature,
      ufcl,
      chlorineDioxide,
    } = this.state;
    const { formMode, settings, menuIsOpen } = this.props;
    const editMode = formMode === 'edit';
    const availableRanges = settings
      ? settings.edges.map(({ node }) => {
          return { value: node.id, label: node.description };
        })
      : [];
    let errorMessage = '';
    if (error.length) {
      errorMessage = (
        <div className="error-message">
          Si &egrave; verificato un errore nella sottomissione del form:
          <div className="error-message-text" key="idx">
            {error}
          </div>
        </div>
      );
    }
    const validationErrorMessage = validationError.length ? (
      <div className="error-message">{validationError}</div>
    ) : null;

    const ranges = [
      {
        label: 'Acqua calda',
        udm: '(°C)',
        data: hotTemperature,
        stateField: 'hotTemperature',
      },
      {
        label: 'Acqua fredda',
        data: coldTemperature,
        udm: '(°C)',
        stateField: 'coldTemperature',
      },
      {
        label: 'Acqua calda scorrimento',
        udm: '(°C)',
        data: hotFlowTemperature,
        stateField: 'hotFlowTemperature',
      },
      {
        label: 'Acqua fredda scorrimento',
        udm: '(°C)',
        data: coldFlowTemperature,
        stateField: 'coldFlowTemperature',
      },
      { label: 'Legionella', udm: '(UFC/L)', data: ufcl, stateField: 'ufcl' },
      {
        label: 'Biossido',
        udm: '(mg/L)',
        data: chlorineDioxide,
        stateField: 'chlorineDioxide',
      },
    ];

    const selectRangeType = editMode ? (
      ''
    ) : (
      <FieldWithValidation
        required
        resetState={!menuIsOpen}
        value={rangeType}
        render={({ value, handleValidation, required, error }) => (
          <div className="Field">
            <label>
              Seleziona il tipo di impianto a cui applicare il range{required && (
                <span title="Campo obbligatorio" className="required-label" />
              )}
              {error ? <div className="error-message">{error}</div> : null}
              <Select
                name="wsp"
                value={value}
                options={availableRanges}
                clearable={false}
                onChange={this.updateSelectField}
                placeholder="Seleziona..."
                onBlur={handleValidation}
              />
            </label>
          </div>
        )}
      />
    );
    return (
      <div className="AddSample range-legionella-settings-form">
        <div className="AddSampleHeader">
          <h2 className="AddSampleHeaderLabel">
            {editMode ? 'Aggiorna' : 'Aggiungi'} range
          </h2>
          <button type="button" onClick={this.closeMenu}>
            <MdClose />
          </button>
        </div>
        {editMode ? (
          ''
        ) : (
          <p className="description">
            <MdWarning />Aggiungendo un nuovo range per un tipo di struttura,
            verr&agrave; disabilitato l'attuale range attivo.
          </p>
        )}
        <form
          className="form"
          onSubmit={editMode ? this.handleEdit : this.handleSubmit}
        >
          {selectRangeType}
          {ranges.map((range, index) => (
            <SettingsJsonFieldContainer
              key={index}
              data={range.data}
              label={range.label}
              udm={range.udm}
              fieldType="range"
              handleChange={data =>
                this.updateJSONField({
                  stateField: range.stateField,
                  data,
                })
              }
              handleAddVoice={data =>
                this.addJsonItem({
                  stateField: range.stateField,
                })
              }
              onSortEnd={({ newIndex, oldIndex }) =>
                this.updateSortOnJsonField({
                  newIndex,
                  oldIndex,
                  values: range.data,
                  stateField: range.stateField,
                })
              }
              handleRemoveVoice={({ index }) =>
                this.removeJSONField({
                  index,
                  stateField: range.stateField,
                })
              }
              handleErrors={this.handleErrors}
              useDragHandle={true}
              lockAxis="y"
              helperClass="moving-range"
              lockToContainerEdges
            />
          ))}
          <div className="Controls">
            {errorMessage}
            {validationErrorMessage}
            <button
              className="Save"
              type="submit"
              disabled={this.state.formDisabled}
            >
              {formMode === 'edit' ? 'Salva' : 'Crea'}
            </button>
            <button
              className="Cancel"
              type="button"
              onClick={() => this.closeMenu({ resetForm: true })}
            >
              Annulla
            </button>
          </div>
          {/* {deleteRangeLegionellaSettings} */}
        </form>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  formMode: state.menu.formMode,
  menuIsOpen: state.menu.open,
  entryId: state.menu.entryId,
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
    graphql(RangeLegionellaSettingsFormQuery, {
      props: ({ data: { loading, allRanges, settings } }) => ({
        loading,
        allRanges,
        settings,
      }),
    }),
    // $FlowFixMe
    graphql(CreateRangeLegionellaSettingsMutation, {
      props: ({ mutate }) => ({
        submit: input => {
          return mutate({
            variables: { ...input },
            // $FlowFixMe
            refetchQueries: [
              {
                query: RangeLegionellaSettingsFormQuery,
              },
            ],
          });
        },
      }),
    }),
    // $FlowFixMe
    graphql(UpdateRangeLegionellaSettingsMutation, {
      props: ({ mutate }) => ({
        update: input => {
          return mutate({
            variables: { ...input }, // $FlowFixMe
            refetchQueries: [
              {
                query: RangeLegionellaSettingsFormQuery,
              },
            ],
          });
        },
      }),
    }),
    // graphql(DeleteRangeLegionellaSettingsMutation, {
    //   props: ({ mutate }) => ({
    //     deleteMutation: input => {
    //       return mutate({ variables: { ...input } });
    //     },
    //   }),
    // }),
  )(RangeLegionellaSettingsFormContainer),
);
