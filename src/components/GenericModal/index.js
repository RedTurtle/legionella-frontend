// @flow
import * as React from 'react';
import './index.css';
import Modal from 'react-modal';

type Props = {
  onHandleConfirm: $FlowFixMe,
  onHandleCloseModal: $FlowFixMe,
  isOpen: boolean,
  children: $FlowFixMe,
  confirmLabel: string,
  title: string,
  showCancelButton?: boolean,
};

const GenericModal = ({
  onHandleConfirm,
  onHandleCloseModal,
  isOpen,
  children,
  confirmLabel,
  title,
  showCancelButton = true,
}: Props) => (
  <Modal
    isOpen={isOpen}
    className="validate-modal"
    overlayClassName="validate-modal-overlay"
  >
    <h2>{title}</h2>
    <div className="modal-content">
      {/* 
      <p>
        Questa operazione è <strong>IRREVERSIBILE</strong>, confermi di voler{' '}
        <strong>validare</strong> tutti i campionamenti inseriti nell'intervallo{' '}
        <em>{title}</em> ?
      </p>
      <p>
        Se confermi, non sarà più possibile aggiungere campionamenti o
        modificare quelli già inseriti.
      </p> */}
      {children}
      <div className="workflow-modal-controls">
        {showCancelButton ? (
          <button
            type="button"
            className="modal-cancel"
            onClick={onHandleCloseModal}
          >
            Annulla
          </button>
        ) : null}
        <button
          type="button"
          className="modal-confirm"
          onClick={onHandleConfirm}
        >
          {confirmLabel}
        </button>
      </div>
    </div>
  </Modal>
);

export default GenericModal;
