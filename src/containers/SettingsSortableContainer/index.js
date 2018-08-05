// @flow
import './styles.css';
import React, { Component } from 'react';
import { SortableContainer } from 'react-sortable-hoc';
import { SortableElement } from 'react-sortable-hoc';
import DragHandle from '../../components/DragHandle';

type Props = {
  children: $FlowFixMe,
};

const SortableSetting = SortableElement(({ children }: Props) => {
  return (
    <div className="sortable-field">
      <DragHandle />
      {children}
    </div>
  );
});

class SettingsSortableContainer extends Component<Props> {
  render() {
    return (
      <div className="setting-sortable-wrapper">
        {this.props.children.map((child, index) => (
          <SortableSetting key={index} index={index}>
            {child}
          </SortableSetting>
        ))}
      </div>
    );
  }
}

export default SortableContainer(SettingsSortableContainer);
