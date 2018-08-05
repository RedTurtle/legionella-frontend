// @flow

import 'react-select/dist/react-select.css';
import './index.css';
import React, { Component } from 'react';
import {
  addErrorMessage,
  updateFormField,
} from '../../actions/sampleRangeForm';
import { compose, graphql } from 'react-apollo';
import reactCSS from 'reactcss';
import { SwatchesPicker } from 'react-color';
import MdClose from 'react-icons/lib/md/close';
import { connect } from 'react-redux';
import { openCloseMenu } from '../../actions/menu';
import { SettingsQuery } from '../../graphql/queries/settings';
import FieldWithValidation from '../../components/FieldWithValidation';
import {
  UpdateSettingMutation,
  CreateSettingMutation,
} from '../../graphql/mutations/settings';

type State = {
  fields: {
    value: ?string,
    description: ?string,
  },
  error: string,
  validationError: boolean,
  displayColorPicker: boolean,
};
type Props = {
  formMode: ?string,
  menuIsOpen: boolean,
  submit: $FlowFixMe,
  update: $FlowFixMe,
  openCloseMenu: $FlowFixMe,
  settings: $FlowFixMe,
  entryId: string,
  settingType: string,
};

const initialState = {
  fields: {
    value: '',
    description: '#fff',
  },
  error: '',
  validationError: false,
  displayColorPicker: false,
};

class StandardSettingsFormContainer extends Component<Props, State> {
  constructor() {
    super();
    this.state = initialState;
  }

  handleColorPickerClick = () => {
    this.setState({
      displayColorPicker: !this.state.displayColorPicker,
    });
  };

  handleCloseColorPicker = () => {
    this.setState({ displayColorPicker: false });
  };

  handleColorPickerChange = color => {
    this.setState({
      ...this.state,
      fields: { ...this.state.fields, description: color.hex },
    });
  };

  updateStateWithProps(props) {
    const { entryId, settings } = props;
    if (settings) {
      const matchSettings = settings.edges.filter(
        ({ node }) => node.id === entryId,
      );
      const setting = matchSettings[0].node;
      if (setting) {
        const fields = Object.keys(this.state.fields).reduce(
          (newFields, key) => {
            let value = setting[key];
            if (value) {
              if (key === 'description') {
                // check if is a valid hex color
                value = /(^#[0-9A-F]{6}$)|(^#[0-9A-F]{3}$)/i.test(value)
                  ? value
                  : '#FFF';
              }
              newFields[key] = value;
            } else {
              newFields[key] = this.state.fields[key];
            }
            return newFields;
          },
          {},
        );
        this.setState({ ...this.state, fields, validationError: false });
      }
    }
  }

  componentWillMount() {
    this.updateStateWithProps(this.props);
  }

  componentWillReceiveProps(nextProps) {
    const { formMode } = nextProps;
    if (formMode === 'add') {
      this.resetState();
    } else {
      this.updateStateWithProps(nextProps);
    }
  }

  resetState = () => {
    this.setState(initialState);
  };

  updateField = data => {
    const { event, fieldName } = data;
    const value = event.target.value;
    const fields = { ...this.state.fields };
    fields[fieldName] = value;

    this.setState({ ...this.state, fields });
  };

  closeMenu = ({ resetForm }) => {
    this.props.openCloseMenu();
    if (resetForm) {
      this.setState(initialState);
    }
  };

  isFormValid = () => {
    const { value } = this.state.fields;
    if (!value || value.length === 0) {
      this.setState({
        ...this.state,
        validationError: true,
      });
      return false;
    }
    return true;
  };

  addNewSettings = () => {
    const { submit, openCloseMenu, settingType } = this.props;
    if (!this.isFormValid()) {
      return;
    }

    let formFields = { ...this.state.fields };
    formFields.settingType = settingType;

    submit({ input: formFields, settingType })
      .then(({ data }) => {
        openCloseMenu();
      })
      .catch(error => this.handleErrors(error));
  };

  editSettings = () => {
    if (!this.isFormValid()) {
      return;
    }
    const { update, openCloseMenu, entryId, settingType } = this.props;

    let formFields = { ...this.state.fields };
    formFields.settingId = entryId;

    update({ input: formFields, settingType })
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
    const { value, description } = this.state.fields;
    const { formMode, menuIsOpen } = this.props;
    let errorMessage = '';
    if (error.length > 0) {
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
          <div className="error-message-text">
            Impossibile salvare. Tutti i campi obbligatori devono essere
            compilati.
          </div>
        </div>
      );
    }

    // const deleteSettings =
    //   formMode === 'edit' ? (
    //     <div className="delete-report">
    //       oppure{' '}
    //       <button
    //         type="button"
    //         onClick={this.handleDelete}
    //         className="delete-link"
    //       >
    //         ELIMINA
    //       </button>{' '}
    //       questo intervallo di campionamento
    //     </div>
    //   ) : null;

    const styles = reactCSS({
      default: {
        color: {
          width: '36px',
          height: '14px',
          borderRadius: '2px',
          background: description,
        },
        swatch: {
          padding: '5px',
          background: '#fff',
          borderRadius: '1px',
          boxShadow: '0 0 0 1px rgba(0,0,0,.1)',
          display: 'inline-block',
          cursor: 'pointer',
        },
        popover: {
          position: 'absolute',
          zIndex: '2',
        },
        cover: {
          position: 'fixed',
          top: '0px',
          right: '0px',
          bottom: '0px',
          left: '0px',
        },
      },
    });

    return (
      <div className="AddSample standard-settings-form">
        <div className="AddSampleHeader">
          <h2 className="AddSampleHeaderLabel">
            {formMode === 'edit' ? 'Aggiorna' : 'Aggiungi'} livello di rischio
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
            <FieldWithValidation
              required={true}
              value={value}
              resetState={!menuIsOpen}
              render={({ value, handleValidation, required, error }) => (
                <label>
                  <h3 className="FieldName">
                    Nome{required && (
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
              )}
            />
          </div>
          <div className="Field">
            <label>
              <h3 className="FieldName">Colore livello</h3>
              <span className="FieldDescription">
                Seleziona un colore che identifichi questo livello di rischio.
              </span>
              <div style={styles.swatch} onClick={this.handleColorPickerClick}>
                <div style={styles.color} />
              </div>
              {this.state.displayColorPicker ? (
                <div style={styles.popover}>
                  <div
                    style={styles.cover}
                    onClick={this.handleCloseColorPicker}
                  />
                  <SwatchesPicker
                    color={description}
                    onChange={this.handleColorPickerChange}
                  />
                </div>
              ) : null}
            </label>
          </div>
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
    graphql(SettingsQuery, {
      options: ({ settingType }) => ({
        variables: { settingType },
      }),
      skip: ({ entryId }) => !entryId,
      props: ({ data: { loading, settings } }) => ({
        loading,
        settings,
      }),
    }),
    // $FlowFixMe
    graphql(CreateSettingMutation, {
      props: ({ mutate }) => ({
        submit: ({ input, settingType }) => {
          return mutate({
            variables: { input }, // $FlowFixMe
            // update: (store, pippo) => {
            //   debugger;
            // },
            refetchQueries: [
              {
                query: SettingsQuery,
                variables: { settingType, orderBy: 'position' },
              },
            ],
          });
        },
      }),
    }),
    // $FlowFixMe
    graphql(UpdateSettingMutation, {
      props: ({ mutate }) => ({
        update: ({ input, settingType }) => {
          return mutate({
            variables: { input }, // $FlowFixMe
            refetchQueries: [
              {
                query: SettingsQuery,
                variables: { settingType, orderBy: 'position' },
              },
            ],
          });
        },
      }),
    }),
    // graphql(DeleteSettingsMutation, {
    //   props: ({ mutate }) => ({
    //     deleteMutation: input => {
    //       return mutate({ variables: { ...input } });
    //     },
    //   }),
    // }),
  )(StandardSettingsFormContainer),
);
