// @flow

import './index.css';
import React, { Component } from 'react';
import {
  addErrorMessage,
  updateFormField,
} from '../../actions/sampleRangeForm';
import { compose, graphql } from 'react-apollo';
import MdClose from 'react-icons/lib/md/close';
import { connect } from 'react-redux';
import { openCloseMenu } from '../../actions/menu';
import { SampleRangeFilesQuery } from '../../graphql/queries/sampleRanges';
import { DeleteDocumentMutation } from '../../graphql/mutations/sampleRanges';
import Spinner from '../../components/Spinner';
import SampleRangeFileupload from '../../components/SampleRangeFileupload';
import GenericModal from '../../components/GenericModal';

type State = {
  modalIsOpen: boolean,
  error: string,
  fileToBeDeleted: ?{
    id: string,
    description: string,
  },
};
type Props = {
  loading: boolean,
  formMode: ?string,
  openCloseMenu: $FlowFixMe,
  sampleRange: $FlowFixMe,
  sampleRangeId: string,
  refetch: $FlowFixMe,
  deleteDocument: $FlowFixMe,
};

const initialState = {
  error: '',
  modalIsOpen: false,
  fileToBeDeleted: null,
};

class SampleRangeFilesFormContainer extends Component<Props, State> {
  constructor() {
    super();
    this.state = initialState;
  }

  resetState = () => {
    this.setState(initialState);
  };

  closeMenu = () => {
    this.props.openCloseMenu();
  };

  openModal = (): void => {
    this.setState((state: State): State => ({
      ...state,
      modalIsOpen: true,
    }));
  };

  closeModal = (): void => {
    this.setState((state: State): State => ({
      ...state,
      modalIsOpen: false,
    }));
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

  confirmDeleteFile = file => {
    this.setState({
      ...this.state,
      fileToBeDeleted: {
        id: file.id,
        description: file.description,
      },
      modalIsOpen: true,
    });
  };

  deleteFile = () => {
    const { fileToBeDeleted } = this.state;
    const { deleteDocument, sampleRangeId } = this.props;
    const documentId = fileToBeDeleted ? fileToBeDeleted.id : '';
    deleteDocument({ input: { documentId }, sampleRangeId }).catch(error =>
      this.handleErrors(error),
    );
  };

  render() {
    const { loading, refetch, sampleRange } = this.props;
    const { modalIsOpen, fileToBeDeleted } = this.state;
    if (loading) {
      return <Spinner />;
    }
    const baseUrl =
      process && process.env.NODE_ENV === 'development'
        ? 'http://localhost:8000'
        : '';
    const savedFiles = sampleRange
      ? sampleRange.documentSet.edges.map(({ node }, index) => (
          <li key={`file-${index}`} className="saved-file">
            <a href={`${baseUrl}${node.fileUrl}`} target="_blank">
              {node.description} ({node.documentSizeHuman})
            </a>
            <button
              type="button"
              className="remove-uploading-file"
              title="Rimuovi file salvato"
              onClick={() => this.confirmDeleteFile(node)}
            >
              <MdClose />
            </button>
          </li>
        ))
      : '';
    return (
      <div className="AddSample sample-range-files-form">
        <div className="AddSampleHeader">
          <h2 className="AddSampleHeaderLabel">Gestisci allegati</h2>
          <button type="button" onClick={this.closeMenu}>
            <MdClose />
          </button>
        </div>
        <div className="form">
          <div className="Field attachments-list">
            <h3 className="FieldName">Allegati salvati</h3>
            {savedFiles.length ? <ul>{savedFiles}</ul> : 'Nessun file allegato'}
          </div>
          <SampleRangeFileupload handleRefetch={refetch} />
        </div>
        {modalIsOpen ? (
          <GenericModal
            key={`confirm-modal-delete`}
            onHandleConfirm={() => {
              this.deleteFile();
              this.closeModal();
            }}
            onHandleCloseModal={this.closeModal}
            isOpen={modalIsOpen}
            confirmLabel="Elimina"
            title="Conferma eliminazione"
          >
            <p>
              Questa operazione è <strong>IRREVERSIBILE</strong>, confermi di
              voler <strong>eliminare</strong> il file{' '}
              {fileToBeDeleted ? fileToBeDeleted.description : ''}?
            </p>
          </GenericModal>
        ) : (
          ''
        )}
      </div>
    );
  }
}

const mapStateToProps = state => ({
  formMode: state.menu.formMode,
  sampleRangeId: state.menu.entryId,
  userToken: state.user.token,
});

const actionMethods = {
  openCloseMenu,
  updateFormField,
  addErrorMessage,
};

export default compose(
  //$FlowFixMe
  connect(mapStateToProps, actionMethods),
  //$FlowFixMe
  graphql(SampleRangeFilesQuery, {
    options: ({ sampleRangeId }) => ({
      variables: { id: sampleRangeId },
    }),
    props: ({ data: { loading, sampleRange, refetch } }) => ({
      loading,
      sampleRange,
      refetch,
    }),
  }),
  //$FlowFixMe
  graphql(DeleteDocumentMutation, {
    props: ({ mutate }) => ({
      deleteDocument: ({ input, sampleRangeId }) => {
        return mutate({
          variables: { input },
          //$FlowFixMe
          refetchQueries: [
            {
              query: SampleRangeFilesQuery,
              variables: { id: sampleRangeId },
            },
          ],
        });
      },
    }),
  }),
)(SampleRangeFilesFormContainer);
