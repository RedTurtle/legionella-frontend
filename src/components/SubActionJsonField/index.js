// @flow
import React, { Component } from 'react';
import { SortableElement } from 'react-sortable-hoc';
import './styles.css';
import DragHandle from '../DragHandle';
import FaTrash from 'react-icons/lib/fa/trash';
import FaPlus from 'react-icons/lib/fa/plus';

type Props = {
  value: any,
  name: string,
  priority: number,
  handleChange: $FlowFixMe,
  handleRemoveVoice: $FlowFixMe,
};

class SubActionJsonField extends Component<Props> {
  updateAction = (data: { label?: string, children?: $FlowFixMe }) => {
    const { handleChange, value, priority } = this.props;
    const { label, children } = data;
    const newValue = Object.assign({}, value);
    if (label) {
      newValue.label = label;
    }
    if (children) {
      newValue.children[children.index] = children.value;
    }
    handleChange({ index: priority, value: newValue });
  };

  addSubAction = () => {
    const { handleChange, value, priority } = this.props;
    const newValue = Object.assign({}, value);
    if (newValue.children) {
      newValue.children.push('');
    } else {
      newValue.children = [''];
    }
    handleChange({ index: priority, value: newValue });
  };

  removeSubAction = index => {
    const { handleChange, value, priority } = this.props;
    const newValue = Object.assign({}, value);
    newValue.children = newValue.children.filter(
      (item, childrenIndex) => index !== childrenIndex,
    );
    handleChange({ index: priority, value: newValue });
  };

  render() {
    const { value, name, priority, handleRemoveVoice } = this.props;
    const label = value ? value.label : '';
    const children = value ? value.children : [];
    let childrenValues = '';
    if (children && children.length > 0) {
      childrenValues = children.map((item, index) => (
        <div className="sub-action" key={index}>
          <input
            type="text"
            name={`sub-action-${index}`}
            value={item}
            onChange={e =>
              this.updateAction({
                children: { value: e.target.value, index },
              })
            }
          />
          <button
            type="button"
            className="remove-range-item"
            onClick={() => this.removeSubAction(index)}
            title="Rimuovi voce di dettaglio"
          >
            <FaTrash />
          </button>
        </div>
      ));
    }

    return (
      <div className="json-field action-json-field">
        <DragHandle />
        <div className="field-actions">
          <div className="main-text">
            <label>
              <span>Testo</span>
              <input
                type="text"
                name={`${name}.${priority}`}
                value={label}
                onChange={e =>
                  this.updateAction({
                    label: e.target.value,
                  })
                }
              />
            </label>
          </div>
          <div className="sub-actions">
            <h4>Ulteriori dettagli (menù a tendina)</h4>
            {childrenValues}
            <button
              type="button"
              className="add-subaction"
              onClick={this.addSubAction}
            >
              <FaPlus />
              <span>Aggiungi dettaglio</span>
            </button>
          </div>
        </div>
        <button
          type="button"
          className="remove-range-item"
          title="Rimuovi l'intera azione"
          onClick={() => handleRemoveVoice({ index: priority })}
        >
          <FaTrash />
        </button>
      </div>
    );
  }
}

export default SortableElement(SubActionJsonField);
