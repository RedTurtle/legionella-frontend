import React, { Component } from 'react';
import {
  addErrorMessage,
  resetForm,
  updateFormField,
  updateNotesActions,
} from '../../actions/sampleRangeForm';
import { compose, graphql } from 'react-apollo';
import SampleForm from '../../components/SampleForm';
import { connect } from 'react-redux';
import { filter } from 'graphql-anywhere';
import { openCloseMenu } from '../../actions/menu';
import reportFragments from '../../graphql/fragments/report';
import { DashboardQuery } from '../../graphql/queries/sampleRanges';
import { ExpandedSampleRowContainerQuery } from '../../graphql/queries/structures';
import { ReportFormQuery } from '../../graphql/queries/reports';
import { WspListQuery } from '../../graphql/queries/wsp';
import { AllStructuresQuery } from '../../graphql/queries/structures';
import {
  CreateReportMutation,
  UpdateReportMutation,
  DeleteReportMutation,
} from '../../graphql/mutations/reports';
import Spinner from '../../components/Spinner';
import { fieldWithPermissions } from '../../hocs/fields';

const fieldsToFix = [
  'coldChlorineDioxide',
  'coldFlowChlorineDioxide',
  'coldFlowTemperature',
  'coldFlowUfcl',
  'coldTemperature',
  'coldUfcl',
  'hotChlorineDioxide',
  'hotFlowChlorineDioxide',
  'hotFlowTemperature',
  'hotFlowUfcl',
  'hotTemperature',
  'hotUfcl',
];

class SampleFormContainer extends Component {
  componentWillReceiveProps(newProps) {
    //update form state with actions
    const { sampleRangeForm } = this.props;
    const oldMenuIsOpen = this.props.menuIsOpen;
    const { actions, menuIsOpen } = newProps;
    if (!menuIsOpen) {
      // we've just closed the menu, and the store has been updated.
      // skip to avoid maximum recursion depth
      if (oldMenuIsOpen !== menuIsOpen) {
        this.props.updateFormField({
          validationErrors: false,
          formErrors: null,
          visibleFields: [],
          restrictedFields: [],
        });
      }

      return;
    }
    const formHasValidationError = this.validateInputForms(
      newProps.sampleRangeForm,
    );
    if (newProps.validationErrors !== formHasValidationError) {
      this.props.updateFormField({ validationErrors: formHasValidationError });
    }
    if (
      this.props.restrictedFields.length === 0 &&
      this.props.visibleFields.length === 0 &&
      newProps.fields &&
      newProps.fields.edges.length > 0
    ) {
      this.props.updateFormField({ ...this.extractVisibleFields(newProps) });
    }
    if (
      newProps.actions &&
      newProps.actions.edges.length > 0 &&
      (!newProps.sampleRangeForm.notesActions ||
        newProps.sampleRangeForm.notesActions.length === 0) &&
      (!sampleRangeForm.notesActions ||
        sampleRangeForm.notesActions.length === 0)
    ) {
      //actions are not set in the report, so set the form with default ones
      this.props.updateNotesActions(
        actions.edges.map(({ node }) => {
          const typeActions =
            node.notesActionsJson.length === 0
              ? []
              : JSON.parse(node.notesActionsJson);
          return {
            label: node.value,
            actions: typeActions.map(action => {
              const subActions = action.children ? action.children : [];
              return {
                label: action.label,
                value: false,
                children: subActions,
                selectedChildren: null,
              };
            }),
            text: '',
          };
        }),
      );
    }
  }

  canDeleteReport = () => {
    const validations = this.sampleRangeValidations(this.props);
    return (
      !validations.tecnicoBlock &&
      !validations.managerBlock &&
      !validations.finalBlock
    );
  };

  sampleRangeValidations = props => {
    const { sampleRangeForm, allSampleranges } = props;
    const sampleRangeId = sampleRangeForm ? sampleRangeForm.sampleRange : null;
    const selectedSampleRange =
      sampleRangeId && allSampleranges
        ? allSampleranges.edges.reduce((sampleRange, { node }) => {
            if (sampleRange) {
              return sampleRange;
            }
            return node.id === sampleRangeId ? node : null;
          }, null)
        : null;
    return {
      tecnicoBlock: selectedSampleRange
        ? selectedSampleRange.tecnicoBlock
        : false,
      managerBlock: selectedSampleRange
        ? selectedSampleRange.managerBlock
        : false,
      finalBlock: selectedSampleRange ? selectedSampleRange.finalBlock : false,
    };
  };

  validateInputForms = form => {
    return Object.keys(form).reduce((hasError, key) => {
      if (hasError) {
        return hasError;
      }
      if (fieldsToFix.includes(key) && typeof form[key] === 'string') {
        //check if numeric fields have a numeric value
        hasError = form[key].match(/^-?\d*((?:\.|,)\d+)?$/) === null;
      }
      return hasError;
    }, false);
  };

  setFormFieldState = (data: any) => {
    const { sampleRangeForm } = this.props;
    const updatedForm = { ...sampleRangeForm, ...data };
    const formHasValidationError = this.validateInputForms(updatedForm);

    this.props.updateFormField({
      fields: { ...sampleRangeForm, ...data },
      validationErrors: formHasValidationError,
    });
  };

  extractVisibleFields = newProps => {
    const { fields, userRoles, formMode } = newProps;
    const sampleRangeValidations = this.sampleRangeValidations(newProps);
    if (!fields) {
      return {};
    }
    const canEditFields =
      userRoles.length > 0 &&
      !sampleRangeValidations.finalBlock &&
      formMode !== 'view';
    return fields.edges.reduce(
      (accumulator, { node }) => {
        const splittedValue = node.value.split('.');
        if (splittedValue.length < 2) {
          return accumulator;
        }
        if (splittedValue[0] !== 'Report') {
          return accumulator;
        }
        // graphql wants field ids in camelcase
        const fieldId = splittedValue[1]
          .replace(/_/g, ' ')
          .replace(/(?:^\w|[A-Z]|\b\w|\s+)/g, function(match, index) {
            if (+match === 0) return ''; // or if (/\s+/.test(match)) for white spaces
            return index === 0 ? match.toLowerCase() : match.toUpperCase();
          });
        accumulator.restrictedFields.push(fieldId);
        const roleName = node.owner.name;
        if (
          userRoles.includes(roleName) &&
          (!sampleRangeValidations[`${roleName}Block`] ||
            fieldId === 'notesActions') &&
          canEditFields
        ) {
          // if user can edit this field &&
          // sampleRange doesn't have the block on this field's role (manager or tecnico)
          accumulator.visibleFields.push(fieldId);
        }
        return accumulator;
      },
      {
        restrictedFields: [],
        visibleFields: [],
      },
    );
  };

  updateSelectField = data => {
    const { options, selectedOption, fieldName } = data;
    const selected = options.reduce((acc, item) => {
      acc = item.value === selectedOption.value ? item : acc;
      return acc;
    }, null);
    if (selected) {
      const newState = {
        [fieldName]: selected.value,
      };
      this.setFormFieldState(newState);
    }
  };

  updateDateField = data => {
    const { value, fieldName } = data;
    const newState = {
      [fieldName]: value.format('YYYY-MM-DD'),
    };
    this.setFormFieldState(newState);
  };

  updateLegionellaField = data => {
    this.setFormFieldState(data);
  };

  closeMenu = ({ resetForm }) => {
    this.props.openCloseMenu();
    resetForm
      ? this.props.resetForm()
      : this.props.updateFormField({
          validationErrors: false,
          formErrors: null,
        });
  };

  validateField = ({ id, value }) => {
    switch (id) {
      case 'wsp':
        return value.length === 0 ? 'WSP è un campo obbligatorio.' : '';
      case 'sampleRange':
        return value.length === 0
          ? 'Intervallo di campionamento è un campo obbligatorio.'
          : '';
      default:
        return '';
    }
  };
  extractDataFromForm = source => {
    const {
      isFieldEditable,
      sampleRangeForm,
      samplingValues,
      allStructure,
    } = this.props;

    if (!source) {
      source = sampleRangeForm;
    }

    const selectedWsp = allStructure
      ? allStructure.edges
          .reduce((acc, { node }) => {
            acc.push(...node.wspSet.edges.map(wspsNode => wspsNode.node));
            return acc;
          }, [])
          .filter(wsp => {
            return wsp.id === sampleRangeForm.wsp;
          })[0]
      : null;
    const filteredFields = Object.keys(source).filter(key => {
      if (!isFieldEditable(key)) {
        return false;
      }
      // if wsp ha some disabled group fields (cold, coldFlow, hot, hotFlow),
      // don't pass them to the mutation.
      if (selectedWsp) {
        if (
          !selectedWsp.cold &&
          (key.startsWith('cold') && !key.startsWith('coldFlow'))
        ) {
          return false;
        }
        if (!selectedWsp.coldFlow && key.startsWith('coldFlow')) {
          return false;
        }
        if (
          !selectedWsp.hot &&
          (key.startsWith('hot') && !key.startsWith('hotFlow'))
        ) {
          return false;
        }
        if (!selectedWsp.hotFlow && key.startsWith('hotFlow')) {
          return false;
        }
      }
      return true;
    });
    return filteredFields.reduce(
      (obj, key) => {
        let value = source[key];
        if (fieldsToFix.includes(key)) {
          value = !value || value === '' ? null : parseFloat(value, 10);
        }
        if (key.endsWith('UfclSamplingSelection')) {
          const lastSamplingValue = samplingValues.edges.slice(-1)[0];
          if (lastSamplingValue.node.id !== value) {
            //if we set a different legionellaType, clean the value in legionella field
            const preLabel = key.slice(0, -'UfclSamplingSelection'.length);
            obj.input[`${preLabel}Ufcl`] = null;
          }
        }
        obj.input[key] = value;
        const fieldError = this.validateField({ id: key, value });
        if (fieldError.length > 0) {
          obj.errors.push(fieldError);
        }
        return obj;
      },
      { input: {}, errors: [] },
    );
  };

  addNewReport = () => {
    const { submit, openCloseMenu, resetForm } = this.props;
    const { input, errors } = this.extractDataFromForm();
    if (errors.length > 0) {
      this.props.addErrorMessage({ validationErrors: errors });
      return;
    }
    submit({ input })
      .then(({ data }) => {
        resetForm();
        openCloseMenu();
      })
      .catch(error => this.handleErrors(error));
  };

  editReport = () => {
    const { update, openCloseMenu, resetForm, sampleRangeForm } = this.props;
    //filter parameters only with the ones accepted by the mutation
    // const data = filter(
    //   SampleReport.fragments.sampleReportEdit,
    //   this.extractDataFromForm(),
    // );
    const { input, errors } = this.extractDataFromForm(
      filter(reportFragments.reportEdit, sampleRangeForm),
    );
    if (errors.length > 0) {
      this.props.addErrorMessage({ validationErrors: errors });
      return;
    }
    update({
      input: filter(reportFragments.reportEdit, input),
    })
      .then(({ data }) => {
        resetForm();
        openCloseMenu();
      })
      .catch(error => this.handleErrors(error));
  };

  deleteReport = () => {
    const {
      deleteMutation,
      openCloseMenu,
      resetForm,
      sampleRangeForm,
    } = this.props;
    const input = { input: { reportId: sampleRangeForm.reportId } };
    deleteMutation({ input, wspId: sampleRangeForm.wsp })
      .then(({ data }) => {
        resetForm();
        openCloseMenu();
      })
      .catch(error => this.handleErrors(error));
  };

  handleErrors = error => {
    console.trace(error);
    let errors = {};
    const graphQLErrors = error.graphQLErrors;
    const networkErrors = error.networkErrors;
    if (graphQLErrors && graphQLErrors.length > 0) {
      errors.graphQLErrors = graphQLErrors.map(errorItem => errorItem.message);
    }
    if (networkErrors && networkErrors.length > 0) {
      errors.networkErrors = networkErrors.map(errorItem => errorItem.message);
    }
    this.props.addErrorMessage(errors);
  };

  handleAdd = e => {
    e.preventDefault();
    this.addNewReport();
  };

  handleEdit = e => {
    e.preventDefault();
    this.editReport();
  };

  render() {
    const {
      loading,
      allSampleranges,
      allStructure,
      sampleRangeForm,
      formErrors,
      formMode,
      samplingValues,
      legionellaTypes,
      validationErrors,
      menuIsOpen,
    } = this.props;
    if (loading) {
      return <Spinner />;
    }

    const ranges = allSampleranges
      ? allSampleranges.edges
          .filter(({ node }) => !node.tecnicoBlock && !node.managerBlock)
          .map(node => {
            const range = node.node;
            return {
              value: range.id,
              label: range.title,
            };
          })
      : null;

    const wspsInRanges = allSampleranges
      ? allSampleranges.edges.reduce((accumulator, sampleRangeNode) => {
          const sampleRange = sampleRangeNode.node;
          const reports = sampleRange.reportSet;
          if (!reports) {
            return accumulator;
          }
          accumulator[sampleRange.id] = reports.edges.map(
            ({ node }) => node.wsp.id,
          );
          return accumulator;
        }, {})
      : null;
    const wsps = allStructure
      ? allStructure.edges.reduce((acc, node) => {
          const structure = node.node;
          const selectedSampleRange = this.props.sampleRangeForm.sampleRange;
          const formMode = this.props.formMode;
          acc.push(
            ...structure.wspSet.edges
              .filter(
                //remove wsps that have already a report from selected sampleRange (only in add mode)
                ({ node }) =>
                  formMode === 'add'
                    ? selectedSampleRange || selectedSampleRange.length
                      ? !wspsInRanges[selectedSampleRange].includes(node.id)
                      : true
                    : true,
              )
              .map(({ node }) => node),
          );
          return acc;
        }, [])
      : null;

    const selectedWsp = wsps.filter(wsp => {
      return wsp.id === sampleRangeForm.wsp;
    })[0];
    const props = {
      sampleRangeForm,
      formErrors,
      formMode,
      menuIsOpen,
      samplingValues,
      legionellaTypes,
      validationErrors,
      ranges,
      selectedWsp,
      canDeleteReport: this.canDeleteReport(),
      onDeleteReport: this.deleteReport,
      onCloseMenu: this.closeMenu,
      handleFormSubmit: formMode === 'add' ? this.handleAdd : this.handleEdit,
      onUpdateSelectField: this.updateSelectField,
      onUpdateDateField: this.updateDateField,
      onUpdateLegionellaField: this.updateLegionellaField,
      onSetFormFieldState: this.setFormFieldState,
      wsps,
    };
    return <SampleForm {...props} />;
  }
}

const mapStateToProps = state => ({
  sampleRangeForm: state.sampleRangeForm.fields,
  formErrors: state.sampleRangeForm.formErrors,
  validationErrors: state.sampleRangeForm.validationErrors,
  restrictedFields: state.sampleRangeForm.restrictedFields,
  visibleFields: state.sampleRangeForm.visibleFields,
  formMode: state.menu.formMode,
  menuIsOpen: state.menu.open,
  userRoles: state.user.roles,
});

const actionMethods = {
  openCloseMenu,
  updateFormField,
  resetForm,
  addErrorMessage,
  updateNotesActions,
};

export default compose(
  graphql(ReportFormQuery, {
    props: ({
      data: {
        loading,
        allSampleranges,
        allStructure,
        samplingValues,
        legionellaTypes,
        actions,
        fields,
      },
    }) => ({
      loading,
      allSampleranges,
      allStructure,
      samplingValues,
      legionellaTypes,
      actions,
      fields,
    }),
  }),
  graphql(CreateReportMutation, {
    props: ({ mutate, ownProps }) => ({
      submit: input => {
        const openStructure = ownProps.allStructure.edges.reduce(
          (structureId, structureNode) => {
            if (structureId) {
              return structureId;
            }
            const structure = structureNode.node;
            const foundWsp = structure.wspSet.edges.reduce((found, wspNode) => {
              if (found) {
                return found;
              }
              if (input.input.wsp === wspNode.node.id) {
                found = true;
              }
              return found;
            }, false);
            if (foundWsp) {
              structureId = structure.id;
            }
            return structureId;
          },
          null,
        );
        const refetchQueries = [
          {
            query: DashboardQuery,
          },
          {
            query: AllStructuresQuery,
          },
        ];
        if (openStructure) {
          refetchQueries.push({
            query: ExpandedSampleRowContainerQuery,
            variables: { id: openStructure },
          });
          refetchQueries.push({
            query: WspListQuery,
            variables: { id: openStructure },
          });
        }
        return mutate({
          variables: { ...input },
          refetchQueries,
        });
      },
    }),
  }),
  graphql(UpdateReportMutation, {
    props: ({ mutate, ownProps }) => ({
      update: ({ input }) => {
        const openStructure = ownProps.allStructure.edges.reduce(
          (structureId, structureNode) => {
            if (structureId) {
              return structureId;
            }
            const structure = structureNode.node;
            const foundWsp = structure.wspSet.edges.reduce((found, wspNode) => {
              if (found) {
                return found;
              }
              if (input.wsp === wspNode.node.id) {
                found = true;
              }
              return found;
            }, false);
            if (foundWsp) {
              structureId = structure.id;
            }
            return structureId;
          },
          null,
        );
        return mutate({
          variables: { input },
          refetchQueries: [
            {
              query: DashboardQuery,
            },
            {
              query: AllStructuresQuery,
            },
            {
              query: ExpandedSampleRowContainerQuery,
              variables: { id: openStructure },
            },
            {
              query: WspListQuery,
              variables: { id: openStructure },
            },
          ],
        });
      },
    }),
  }),
  graphql(DeleteReportMutation, {
    props: ({ mutate, ownProps }) => ({
      deleteMutation: ({ input, wspId }) => {
        const openStructure = ownProps.allStructure.edges.reduce(
          (structureId, structureNode) => {
            if (structureId) {
              return structureId;
            }
            const structure = structureNode.node;
            const foundWsp = structure.wspSet.edges.reduce((found, wspNode) => {
              if (found) {
                return found;
              }
              if (wspId === wspNode.node.id) {
                found = true;
              }
              return found;
            }, false);
            if (foundWsp) {
              structureId = structure.id;
            }
            return structureId;
          },
          null,
        );
        const refetchQueries = [
          {
            query: DashboardQuery,
          },
        ];
        if (openStructure) {
          refetchQueries.push({
            query: ExpandedSampleRowContainerQuery,
            variables: { id: openStructure },
          });
          refetchQueries.push({
            query: WspListQuery,
            variables: { id: openStructure },
          });
        }
        return mutate({
          variables: { ...input },
          refetchQueries,
        });
      },
    }),
  }),
  connect(mapStateToProps, actionMethods),
  fieldWithPermissions,
)(SampleFormContainer);
