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
import { connect } from 'react-redux';
import { SettingDetailsQuery } from '../../graphql/queries/settings';
import { SettingsQuery } from '../../graphql/queries/settings';
import SettingsJsonFieldContainer from '../SettingsJsonFieldContainer';
import {
  CreateSettingMutation,
  UpdateSettingMutation,
} from '../../graphql/mutations/settings';
import { openCloseMenu } from '../../actions/menu';
import { actions as requiredFields } from '../../constants/requiredFields';
import FieldWithValidation from '../../components/FieldWithValidation';

type State = {
  fields: {
    value: ?string,
    notesActionsJson: Array<string>,
  },
  error: ?string,
  validationError: boolean,
};
type Props = {
  formMode: ?string,
  menuIsOpen: boolean,
  submit: $FlowFixMe,
  update: $FlowFixMe,
  openCloseMenu: $FlowFixMe,
  setting: $FlowFixMe,
  entryId: string,
  settingType: string,
};

class ActionsSettingsFormContainer extends Component<Props, State> {
  constructor() {
    super();
    this.state = this.initialState();
  }

  initialState = () => {
    return {
      fields: {
        value: '',
        notesActionsJson: [],
      },
      error: null,
      validationError: false,
    };
  };

  updateStateWithProps(props) {
    const { setting } = props;
    if (setting) {
      this.setState({
        ...this.state,
        fields: {
          value: setting.value,
          notesActionsJson: JSON.parse(setting.notesActionsJson),
        },
      });
    }
  }

  componentWillMount() {
    this.updateStateWithProps(this.props);
  }

  componentWillReceiveProps(nextProps) {
    const { formMode } = nextProps;
    if (formMode === 'add') {
      this.setState(this.initialState());
    } else {
      this.updateStateWithProps(nextProps);
    }
  }

  resetState = () => {
    this.setState(this.initialState());
  };

  updateField = data => {
    const { event, fieldName } = data;
    const fields = { ...this.state.fields };
    fields[fieldName] = event.target.value;
    this.setState({ ...this.state, fields });
  };

  updateJSONField = infos => {
    const { data } = infos;
    const notesActionsJson = this.state.fields.notesActionsJson.map(
      item => item,
    );
    notesActionsJson[data.index] = data.value;
    this.setState({
      ...this.state,
      fields: { ...this.state.fields, notesActionsJson },
    });
  };

  removeJSONField = data => {
    const { index } = data;
    this.setState({
      ...this.state,
      fields: {
        ...this.state.fields,
        notesActionsJson: this.state.fields.notesActionsJson.filter(
          (item, idx) => index !== idx,
        ),
      },
    });
  };

  addJsonItem = () => {
    const notesActionsJson = this.state.fields.notesActionsJson.map(
      item => item,
    );
    notesActionsJson.push('');
    this.setState({
      ...this.state,
      fields: {
        ...this.state.fields,
        notesActionsJson,
      },
    });
  };

  updateSortOnJsonField = data => {
    let { newIndex, oldIndex } = data;
    let values = this.state.fields.notesActionsJson.map(item => item);
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

    this.setState({
      ...this.state,
      fields: {
        ...this.state.fields,
        // $FlowFixMe
        notesActionsJson: values,
      },
    });
  };

  formHasValidationErrors = () => {
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

  addNewSettings = () => {
    if (this.formHasValidationErrors()) {
      this.setState({
        ...this.state,
        validationError: true,
      });
      return;
    }
    const { submit, openCloseMenu, settingType, entryId } = this.props;
    let formFields = { ...this.state.fields };
    formFields.settingType = settingType;
    submit({ input: formFields, entryId })
      .then(({ data }) => {
        openCloseMenu();
        this.resetState();
      })
      .catch(error => this.handleErrors(error));
  };

  editSettings = () => {
    if (this.formHasValidationErrors()) {
      this.setState({
        ...this.state,
        validationError: true,
      });
      return;
    }
    const { update, openCloseMenu, entryId } = this.props;
    //filter parameters only with the ones accepted by the mutation
    let formFields = { ...this.state.fields };
    formFields.settingId = entryId;
    formFields.notesActionsJson = JSON.stringify(formFields.notesActionsJson);
    update({ input: formFields, entryId })
      .then(({ data }) => {
        openCloseMenu();
      })
      .catch(error => this.handleErrors(error));
  };

  // deleteSettings = () => {
  //   const { deleteMutation, openCloseMenu, entryId } = this.props;
  //   const data = { samplerangeId: entryId };
  //   deleteMutation({ input: data })
  //     .then(({ data }) => {
  //       openCloseMenu();
  //     })
  //     .catch(error => this.handleErrors(error));
  // };

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

  closeMenu = ({ resetForm }) => {
    this.props.openCloseMenu();
    if (resetForm) {
      this.resetState();
    }
  };

  handleSubmit = e => {
    e.preventDefault();
    this.addNewSettings();
  };

  handleEdit = e => {
    e.preventDefault();
    this.editSettings();
  };

  // handleDelete = e => {
  //   e.preventDefault();
  //   this.deleteSettings();
  // };

  render() {
    const { error, validationError } = this.state;
    const { value, notesActionsJson } = this.state.fields;
    const { formMode, openCloseMenu, menuIsOpen } = this.props;
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
    return (
      <div className="AddSample standard-settings-form">
        <div className="AddSampleHeader">
          <h2 className="AddSampleHeaderLabel">
            {formMode === 'edit' ? 'Aggiorna' : 'Aggiungi'} azioni
          </h2>
          <button type="button" onClick={openCloseMenu}>
            <MdClose />
          </button>
        </div>
        <form
          className="form"
          onSubmit={formMode === 'edit' ? this.handleEdit : this.handleSubmit}
        >
          <FieldWithValidation
            required={true}
            value={value}
            resetState={!menuIsOpen}
            render={({ value, handleValidation, required, error }) => (
              <div className="Field">
                <label>
                  <h3 className="FieldName">
                    Titolo{required && (
                      <span
                        title="Campo obbligatorio"
                        className="required-label"
                      />
                    )}
                  </h3>
                  {error ? <div className="error-message">{error}</div> : null}
                  <input
                    type="text"
                    name="value"
                    value={value}
                    onBlur={handleValidation}
                    onChange={event =>
                      this.updateField({ event, fieldName: 'value' })
                    }
                  />
                </label>
              </div>
            )}
          />
          <SettingsJsonFieldContainer
            data={notesActionsJson}
            label="Azioni"
            fieldType="azioni"
            handleChange={data =>
              this.updateJSONField({
                data,
              })
            }
            handleRemoveVoice={this.removeJSONField}
            handleAddVoice={data => this.addJsonItem()}
            onSortEnd={({ newIndex, oldIndex }) =>
              this.updateSortOnJsonField({
                newIndex,
                oldIndex,
              })
            }
            useDragHandle={true}
            lockAxis="y"
            helperClass="moving-range"
            lockToContainerEdges
          />
          <div className="Controls">
            {errorMessage}
            <button className="Save" type="submit">
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
          {/* {deleteSettings} */}
        </form>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  formMode: state.menu.formMode,
  menuIsOpen: state.menu.open,
  entryId: state.menu.entryId,
  settingType: state.menu.settingType,
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
    graphql(SettingDetailsQuery, {
      options: ({ entryId }) => ({
        variables: { id: entryId },
      }),
      skip: ({ entryId }) => !entryId || entryId.length < 0,
      props: ({ data: { loading, setting } }) => ({
        loading,
        setting,
      }),
    }),
    // $FlowFixMe
    graphql(CreateSettingMutation, {
      props: ({ mutate }) => ({
        submit: ({ input, entryId }) => {
          return mutate({
            variables: { input },
            // $FlowFixMe
            refetchQueries: [
              {
                query: SettingsQuery,
                variables: { settingType: 'noteaction' },
              },
            ],
          });
        },
      }),
    }),
    // $FlowFixMe
    graphql(UpdateSettingMutation, {
      props: ({ mutate }) => ({
        update: ({ input, entryId }) => {
          return mutate({
            variables: { input },
            // $FlowFixMe
            refetchQueries: [
              {
                query: SettingsQuery,
                variables: { settingType: 'noteaction' },
              },
            ],
          });
        },
      }),
    }),
    // $FlowFixMe
    // graphql(DeleteSettingsMutation, {
    //   props: ({ mutate }) => ({
    //     deleteMutation: input => {
    //       return mutate({ variables: { ...input } });
    //     },
    //   }),
    // }),
  )(ActionsSettingsFormContainer),
);
