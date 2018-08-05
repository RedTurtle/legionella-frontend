// @flow
import React, { Component } from 'react';
import Action from '../../components/reportFormFields/Action';
import FaPencil from 'react-icons/lib/fa/pencil-square';

type Props = {
  category: $FlowFixMe,
  onUpdateCategory: any,
  isEditable: boolean,
  id: string,
};

type State = {
  textIsOpen: boolean,
};

class ActionCategoryContainer extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    const { category } = props;
    const text = category ? category.text || '' : '';
    this.state = {
      textIsOpen: text.length > 0,
    };
  }

  componentWillReceiveProps(nextProps: any) {
    const { category } = nextProps;
    if (category && category.text.length > 0) {
      this.setState((state: State): State => ({
        ...state,
        textIsOpen: true,
      }));
    }
  }

  toggleTextField = (e: Event): void => {
    e.preventDefault();
    this.setState((state: State): State => ({
      ...state,
      textIsOpen: !state.textIsOpen,
    }));
  };

  updateTextField = (e: any): void => {
    const { category, onUpdateCategory } = this.props;
    onUpdateCategory(Object.assign({}, category, { text: e.target.value }));
  };

  handleUpdateAction = (data: { updatedAction: $FlowFixMe, index: number }) => {
    const { updatedAction, index } = data;
    const { category, onUpdateCategory } = this.props;
    const newCategory = Object.assign({}, category, {
      actions: category.actions.map((action, actionIndex) => {
        return index === actionIndex ? updatedAction : action;
      }),
    });
    onUpdateCategory(newCategory);
  };

  render() {
    const { category, isEditable, id } = this.props;
    const { textIsOpen } = this.state;
    const textField = textIsOpen ? (
      <textarea
        className="user-input-area"
        id={`${id}-text`}
        value={category.text || ''}
        onChange={this.updateTextField}
        disabled={!isEditable}
      />
    ) : (
      ''
    );
    return (
      <div className="SamplingAction">
        <div className="SamplingActionLabel">{category.label}</div>
        {category.actions.length > 0
          ? category.actions.map((action, index) => (
              <Action
                key={`action-${index}`}
                action={action}
                index={index}
                isEditable={isEditable}
                onUpdateAction={updatedAction =>
                  this.handleUpdateAction({ updatedAction, index })
                }
              />
            ))
          : null}
        <div className="UserInputButton">
          {isEditable ? (
            <button type="button" onClick={this.toggleTextField}>
              <FaPencil />
              <span className="ButtonText">Scrivi testo libero</span>
            </button>
          ) : null}
        </div>
        {textField}
      </div>
    );
  }
}

export default ActionCategoryContainer;
