// @flow
import * as React from 'react';
import './index.css';
import GenericModal from '../GenericModal';

type Props = {
  confirmAction: $FlowFixMe,
  valueId: string,
  elementType: string,
};

type State = {
  modalIsOpen: boolean,
};

class FormDeleteButton extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      modalIsOpen: false,
    };
  }

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

  render() {
    const { confirmAction, valueId, elementType } = this.props;
    const { modalIsOpen } = this.state;

    return [
      <button
        key={`confirm-button-${valueId}`}
        type="button"
        onClick={this.openModal}
        className="delete-link"
      >
        ELIMINA
      </button>,
      modalIsOpen ? (
        <GenericModal
          key={`confirm-modal-${valueId}`}
          onHandleConfirm={() => {
            confirmAction(valueId);
            this.closeModal();
          }}
          onHandleCloseModal={this.closeModal}
          isOpen={modalIsOpen}
          confirmLabel="Elimina"
          title="Conferma eliminazione"
        >
          <p>
            Questa operazione è <strong>IRREVERSIBILE</strong>, confermi di
            voler <strong>eliminare</strong> questo {elementType}?
          </p>
        </GenericModal>
      ) : (
        ''
      ),
    ];
  }
}

export default FormDeleteButton;
