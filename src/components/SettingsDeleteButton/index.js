// @flow
import * as React from 'react';
import './index.css';
import GenericModal from '../GenericModal';
import MdClose from 'react-icons/lib/md/close';

type Props = {
  confirmAction: $FlowFixMe,
  settingLabel: string,
  settingId: string,
};

type State = {
  modalIsOpen: boolean,
};

class SettingsDeleteButton extends React.Component<Props, State> {
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
    const { confirmAction, settingLabel, settingId } = this.props;
    const { modalIsOpen } = this.state;

    return [
      <button
        key={`delete-button-${settingId}`}
        className="delete"
        type="button"
        onClick={this.openModal}
      >
        <MdClose />
        <span>Elimina</span>
      </button>,
      modalIsOpen ? (
        <GenericModal
          key={`confirm-modal-${settingId}`}
          onHandleConfirm={() => {
            confirmAction();
            this.closeModal();
          }}
          onHandleCloseModal={this.closeModal}
          isOpen={modalIsOpen}
          confirmLabel="Elimina"
          title="Conferma eliminazione"
        >
          <p>
            Questa operazione è <strong>IRREVERSIBILE</strong>, confermi di
            voler <strong>eliminare</strong> {settingLabel}?
          </p>
        </GenericModal>
      ) : (
        ''
      ),
    ];
  }
}

export default SettingsDeleteButton;
