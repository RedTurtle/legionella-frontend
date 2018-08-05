// @flow

import './index.css';
import React, { Component } from 'react';
import { compose, graphql } from 'react-apollo';
import MdClose from 'react-icons/lib/md/close';
import MdCloudUpload from 'react-icons/lib/md/cloud-upload';
import MdWarning from 'react-icons/lib/md/warning';
import { connect } from 'react-redux';
import { SettingsQuery } from '../../graphql/queries/settings';
import DropzoneStyled from 'react-dropzone-styled';
import Spinner from '../../components/Spinner';
import prettyBytes from '../../helpers/pretty-bytes';

const uuidv4 = require('uuid/v4');

type State = {
  files: Array<{
    file: any,
    description: string,
    id: string,
    error?: string | null,
    uploading?: boolean,
  }>,
  rejectedFiles: Array<any>,
  error: ?string,
  modalIsOpen: boolean,
};
type Props = {
  loading: boolean,
  userToken: string,
  sampleRangeId: string,
  handleRefetch: $FlowFixMe,
  allowedExtensions: Array<string>,
  maxUploadSize: string,
};

const initialState = {
  files: [],
  rejectedFiles: [],
  error: null,
  modalIsOpen: false,
};

class SampleRangeFileupload extends Component<Props, State> {
  constructor() {
    super();
    this.state = initialState;
  }

  resetState = () => {
    this.setState(initialState);
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
        "Errore di connessione. Impossibile salvare l'intervallo di campionamento.";
    }
    this.setState((state: State): State =>
      Object.assign({}, this.state, {
        error: errorMessage,
      }),
    );
  };

  onHandleDrop = (accepted, rejected) => {
    this.setState((state: State): State => ({
      ...state,
      files: [
        ...state.files,
        ...accepted.map(file => {
          return { file: file, description: file.name, id: uuidv4() };
        }),
      ],
      rejectedFiles: [
        ...rejected.map(file => {
          return { file: file, description: file.name, id: uuidv4() };
        }),
      ],
    }));
  };

  updateFileDescription = ({ event, id }: { event: any, id: string }) => {
    const files = this.state.files.map(file => {
      if (id === file.id) {
        return {
          ...file,
          description: event.target.value,
        };
      }
      return file;
    });
    this.setState((state: State): State => ({
      ...state,
      files,
    }));
  };

  setFileUploading = id => {
    this.setState((state: State): State => ({
      ...state,
      files: state.files.map(file => {
        if (id === file.id) {
          return {
            ...file,
            uploading: true,
            error: null,
          };
        }
        return file;
      }),
    }));
  };

  removeFileFromQueue = id => {
    this.setState((state: State): State => ({
      ...state,
      files: state.files.filter(file => id !== file.id),
    }));
  };

  addErrorToFile = ({ id, message }: { id: string, message: string }) => {
    this.setState((state: State): State => ({
      ...state,
      files: state.files.map(file => {
        if (file.id === id) {
          return {
            ...file,
            error: message,
          };
        }
        return file;
      }),
    }));
  };

  uploadFiles = () => {
    const { userToken, sampleRangeId, handleRefetch } = this.props;
    const headers = new Headers({
      authorization: `JWT ${userToken}`,
    });
    const baseUrl =
      process && process.env.NODE_ENV === 'development'
        ? 'http://localhost:8000'
        : '';
    this.state.files.map((file, index) => {
      const data = new FormData();
      data.append('file', file.file);
      data.append(
        'query',
        `mutation{uploadFile (input:{samplerangeId: "${sampleRangeId}", fileDescription:"${
          file.description
        }"}){success}}`,
      );
      const query = {
        headers,
        method: 'POST',
        body: data,
      };
      this.setFileUploading(file.id);
      fetch(`${baseUrl}/graphqlapp/graphql`, query)
        .then(res => {
          return res.json();
        })
        .then(({ data, errors }: { data: any, errors: Array<any> }) => {
          if (!errors && data.uploadFile.success) {
            this.removeFileFromQueue(file.id);
            handleRefetch();
            return;
          }
          if (errors && errors.length) {
            this.addErrorToFile({
              id: file.id,
              message: errors.map(error => error.message).join(),
            });
          }
        })
        .catch(error => {
          console.trace(error);
          this.setState({
            error: error.message,
          });
        });
      return file;
    });
    this.setState({
      rejectedFiles: [],
    });
  };

  render() {
    const { files, rejectedFiles } = this.state;
    const { maxUploadSize, allowedExtensions } = this.props;
    const maxSize =
      maxUploadSize && maxUploadSize.length
        ? parseInt(maxUploadSize, 10)
        : null;

    const rejectedFilesRender = rejectedFiles.length ? (
      <div className="rejected-files">
        <p>
          I seguenti file sono stati scartati perchè sono troppo grandi (max.{' '}
          {prettyBytes(maxSize)}) oppure non sono in un formato consentito ({allowedExtensions.join(
            ', ',
          )})
        </p>
        <ul>
          {rejectedFiles.map(file => <li key={file.id}>{file.description}</li>)}
        </ul>
      </div>
    ) : (
      ''
    );
    return (
      <div className="Field add-new-files">
        <h3 className="FieldName">Aggiungi allegati</h3>
        <DropzoneStyled
          activeClassName="active"
          onDrop={this.onHandleDrop}
          {...(allowedExtensions
            ? { accept: allowedExtensions.join(', ') }
            : {})}
          {...(maxSize ? { maxSize } : {})}
        >
          <div className="dropzone-content">
            <span className="icon-line">
              <MdCloudUpload />
            </span>
            <p className="main-line">Trascina i file qui</p>
            <p className="or-line">oppure</p>
            <p>
              <button type="button" className="browse-button">
                Sfoglia file e cartelle
              </button>
            </p>
          </div>
        </DropzoneStyled>
        {files.length ? (
          <ul>
            {files.map(file => (
              <li key={`uploaded-file-${file.id}`} className="uploaded-file">
                {file.error ? (
                  <div className="error">
                    <MdWarning /> {file.error}
                  </div>
                ) : (
                  ''
                )}
                {file.file.name} ({prettyBytes(file.file.size)}){' '}
                <button
                  type="button"
                  className="remove-uploading-file"
                  title="Rimuovi file"
                  onClick={() => this.removeFileFromQueue(file.id)}
                  {...(file.uploading ? { disabled: 'disabled' } : {})}
                >
                  <MdClose />
                </button>
                {file.uploading ? <Spinner /> : ''}
                <div className="field">
                  <label>
                    Descrizione
                    <input
                      type="text"
                      value={file.description}
                      name={`file-description-${file.id}`}
                      onChange={event =>
                        this.updateFileDescription({ event, id: file.id })
                      }
                      {...(file.uploading ? { disabled: 'disabled' } : {})}
                    />
                  </label>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          ''
        )}
        {rejectedFilesRender}
        <div className="Controls">
          <button className="Save" type="button" onClick={this.uploadFiles}>
            Carica
          </button>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  sampleRangeId: state.menu.entryId,
  userToken: state.user.token,
});

const actionMethods = {};

export default compose(
  // $FlowFixMe
  connect(mapStateToProps, actionMethods),
  // $FlowFixMe
  graphql(SettingsQuery, {
    // $FlowFixMe
    options: () => ({
      variables: { settingType: 'allowed_file_ext' },
    }),
    props: ({ data: { loading, settings } }) => {
      const allowedExtensions =
        settings && settings.edges.length
          ? settings.edges.map(({ node }) => node.value)
          : [];
      return {
        loading,
        allowedExtensions,
      };
    },
  }),
  // $FlowFixMe
  graphql(SettingsQuery, {
    // $FlowFixMe
    options: () => ({
      variables: { settingType: 'max_upload_size' },
    }),
    // $FlowFixMe
    props: ({ data: { loading, settings } }) => {
      const maxUploadSize =
        settings && settings.edges.length
          ? settings.edges.reduce((size, { node }) => {
              if (size) {
                return size;
              }
              size = node.value;
              return size;
            }, null)
          : null;
      return {
        loading,
        maxUploadSize,
      };
    },
  }),
)(SampleRangeFileupload);
