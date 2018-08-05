// @flow
import * as React from 'react';
import './index.css';
import { graphql, compose } from 'react-apollo';
import ClickOutComponent from 'react-onclickout';
import GenericModal from '../GenericModal';
import FaCaretDown from 'react-icons/lib/fa/caret-down';
import FaCaretUp from 'react-icons/lib/fa/caret-up';
import { UpdateSampleRangeMutation } from '../../graphql/mutations/sampleRanges';
import { DashboardQuery } from '../../graphql/queries/sampleRanges';
import moment from 'moment';
import { connect } from 'react-redux';
import { setApplicationError } from '../../actions/error';
import type { ReduxState } from '../../reducers';
// import type { Action } from '../../constants/ActionTypes';

type Props = {
  userRoles: Array<string>,
  finalBlock: boolean,
  managerBlock: boolean,
  tecnicoBlock: boolean,
  title: string,
  freezeDate: string,
  validateMutation: $FlowFixMe,
  id: string,
  setApplicationError: $FlowFixMe,
};

type State = {
  workflowMenuOpen: boolean,
  validateModalIsOpen: boolean,
  closeModalIsOpen: boolean,
  validationInput: $FlowFixMe,
};

class ValidationWorkflowButton extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      workflowMenuOpen: false,
      validateModalIsOpen: false,
      closeModalIsOpen: false,
      validationInput: null,
    };
  }

  toggleWorkflowMenu = (): void => {
    this.setState((state: State): State => ({
      ...state,
      workflowMenuOpen: !state.workflowMenuOpen,
    }));
  };

  closeWorkflowMenu = (): void => {
    this.setState((state: State): State => ({
      ...state,
      workflowMenuOpen: false,
    }));
  };

  openValidateModal = (input): void => {
    this.setState((state: State): State => ({
      ...state,
      validationInput: input,
      validateModalIsOpen: true,
    }));
  };

  openClosingModal = (input): void => {
    this.setState((state: State): State => ({
      ...state,
      validationInput: input,
      closeModalIsOpen: true,
    }));
  };

  closeModals = (): void => {
    this.setState((state: State): State => ({
      ...state,
      validationType: null,
      validateModalIsOpen: false,
      closeModalIsOpen: false,
    }));
  };

  confirmValidation = (): void => {
    const { validateMutation, id } = this.props;
    validateMutation({
      input: { samplerangeId: id, ...this.state.validationInput },
    })
      .then(() => this.closeModals())
      .catch(error => this.handleError(error));
  };

  handleError = error => {
    console.trace(error);
    this.closeModals();
    this.props.setApplicationError({
      message: `Si è verificato un errore nella validazione di un intervallo di campionamento: ${
        error.message
      }`,
    });
  };

  render() {
    const {
      title,
      userRoles,
      finalBlock,
      managerBlock,
      tecnicoBlock,
      freezeDate,
    } = this.props;
    const {
      workflowMenuOpen,
      validateModalIsOpen,
      closeModalIsOpen,
    } = this.state;

    const workflowState = ((): 'open' | 'validated' | 'closed' => {
      if (managerBlock || tecnicoBlock) {
        return !finalBlock ? 'validated' : 'closed';
      }
      return 'open';
    })();

    const workflowActions = (() => {
      if (finalBlock) {
        return [];
      }
      if (managerBlock && tecnicoBlock && userRoles.includes('manager')) {
        //sample range is totally validated, and the user can freeze it
        return [
          <button
            type="button"
            key="validate-close"
            className="workflow-action-close"
            onClick={() => this.openClosingModal({ finalBlock: true })}
          >
            Chiudi intervallo di campionamento
          </button>,
        ];
      }
      let actions = [];
      if (!tecnicoBlock && userRoles.includes('tecnico')) {
        actions.push(
          <button
            key="validate-tecnico"
            type="button"
            className="workflow-action-validate"
            onClick={() => this.openValidateModal({ tecnicoBlock: true })}
          >
            Valida questi campionamenti{' '}
            {userRoles.length > 1 ? '(tecnico)' : ''}
          </button>,
        );
      }
      if (!managerBlock && userRoles.includes('manager')) {
        actions.push(
          <button
            key="validate-manager"
            type="button"
            className="workflow-action-validate"
            onClick={() => this.openValidateModal({ managerBlock: true })}
          >
            Valida questi campionamenti{' '}
            {userRoles.length > 1 ? '(manager)' : ''}
          </button>,
        );
      }
      return actions;
    })();
    const workflowClass = `state-${workflowState}`;
    return (
      <div
        className={`workflow-wrapper ${workflowClass} ${
          workflowMenuOpen ? 'menu-open' : 'menu-closed'
        }`}
      >
        <div className="toggle-wrapper">
          <button
            className={`workflow-toggle ${
              workflowActions.length ? 'active' : ''
            }`}
            type="button"
            disabled={workflowActions.length === 0}
            onClick={this.toggleWorkflowMenu}
            {...(workflowState !== 'closed'
              ? {
                  title: `Clicca per ${
                    workflowState === 'open'
                      ? 'validare i campionamenti'
                      : "chiudere l'intervallo di campionamento"
                  }`,
                }
              : {})}
          >
            {workflowState === 'open' ? (
              <React.Fragment>
                <span className="state">Aperto</span>
                {workflowActions.length ? (
                  workflowMenuOpen ? (
                    <FaCaretUp />
                  ) : (
                    <FaCaretDown />
                  )
                ) : (
                  ''
                )}
              </React.Fragment>
            ) : workflowState === 'validated' ? (
              <React.Fragment>
                <span className="state">Validato</span>
                {workflowActions.length ? (
                  workflowMenuOpen ? (
                    <FaCaretUp />
                  ) : (
                    <FaCaretDown />
                  )
                ) : (
                  ''
                )}
              </React.Fragment>
            ) : (
              <React.Fragment>
                <span className="closed" />
                <span className="state">Chiuso</span>
                {freezeDate ? (
                  <span className="date">
                    {' '}
                    il {moment(freezeDate).format('DD-MM-YYYY')}
                  </span>
                ) : (
                  ''
                )}
              </React.Fragment>
            )}
          </button>
        </div>
        {workflowMenuOpen && workflowActions.length ? (
          <ClickOutComponent onClickOut={this.closeWorkflowMenu}>
            <div className="workflow-actions">{workflowActions}</div>
          </ClickOutComponent>
        ) : (
          ''
        )}
        {workflowActions.length && workflowState !== 'closed' ? (
          <React.Fragment>
            <GenericModal
              onHandleConfirm={this.confirmValidation}
              onHandleCloseModal={this.closeModals}
              isOpen={validateModalIsOpen}
              confirmLabel="Valida campionamenti"
              title="Conferma validazione"
            >
              <p>
                Questa operazione è <strong>IRREVERSIBILE</strong>, confermi di
                voler <strong>validare</strong> tutti i campionamenti inseriti
                nell'intervallo <em>{title}</em> ?
              </p>
              <p>
                Se confermi, non sarà più possibile aggiungere campionamenti o
                modificare quelli già inseriti.
              </p>
            </GenericModal>
            <GenericModal
              onHandleConfirm={this.confirmValidation}
              onHandleCloseModal={this.closeModals}
              isOpen={closeModalIsOpen}
              confirmLabel="Chiudi intervallo"
              title="Conferma chiusura"
            >
              <p>
                Questa operazione è <strong>IRREVERSIBILE</strong>, confermi di
                voler <strong>chiudere</strong> l'intervallo di campionamento{' '}
                <em>{title}</em> ?
              </p>
              <p>
                Se confermi, non sarà più possibile aggiungere azioni correttive
                o modificare quelle già inserite.
              </p>
            </GenericModal>
          </React.Fragment>
        ) : (
          ''
        )}
      </div>
    );
  }
}

const mapStateToProps = (state: ReduxState): {} => ({});

const actionMethods = { setApplicationError };

// $FlowFixMe
export default compose(
  // $FlowFixMe
  connect(mapStateToProps, actionMethods),
  // $FlowFixMe
  graphql(UpdateSampleRangeMutation, {
    props: ({ mutate }) => ({
      validateMutation: ({ input }) => {
        return mutate({
          variables: { input },
          refetchQueries: [
            {
              query: DashboardQuery,
            },
          ],
        });
      },
    }),
  }),
)(ValidationWorkflowButton);
