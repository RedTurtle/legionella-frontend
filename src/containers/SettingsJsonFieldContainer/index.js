// @flow

import * as React from 'react';
import './styles.css';
import SettingsRangeJsonFieldContainer from '../SettingsRangeJsonFieldContainer';
import SubActionJsonField from '../../components/SubActionJsonField';
import { SortableContainer } from 'react-sortable-hoc';
import FaPlus from 'react-icons/lib/fa/plus';
import FieldWithValidation from '../../components/FieldWithValidation';

type Props = {
  data: $FlowFixMe,
  handleChange: $FlowFixMe,
  handleAddVoice: $FlowFixMe,
  handleRemoveVoice: $FlowFixMe,
  label: string,
  udm: string,
  fieldType: string,
};

class SettingsJsonFieldContainer extends React.Component<Props> {
  generateField = ({
    handleValidation,
    required,
    error,
  }: {
    handleValidation: () => void,
    required: boolean,
    error: React.Node,
  }) => {
    const {
      data,
      handleChange,
      handleAddVoice,
      handleRemoveVoice,
      label,
      udm,
      fieldType,
    } = this.props;
    const children =
      data.length > 0
        ? data.map((field, index) => {
            const props = {
              key: index,
              indexValue: index,
              name: fieldType,
              index: index,
              handleChange,
              handleRemoveVoice,
            };
            return fieldType === 'range' ? (
              <SettingsRangeJsonFieldContainer {...props} {...field} />
            ) : (
              <SubActionJsonField {...props} value={field} priority={index} />
            );
          })
        : '';
    return (
      <div className="json-setting-wrapper Field">
        <h3 className="FieldName">
          {label}
          <span className="udm"> {udm}</span>
          {required && (
            <span title="Campo obbligatorio" className="required-label" />
          )}
        </h3>
        {error ? <div className="error-message">{error}</div> : null}
        {children}
        <button
          type="button"
          className="add-range-item"
          onClick={handleAddVoice}
        >
          <FaPlus /> Aggiungi
        </button>
      </div>
    );
  };

  render() {
    return (
      <FieldWithValidation
        required={true}
        value={this.props.data}
        resetState={this.props.data.length}
        render={({ value, handleValidation, required, error }) =>
          this.generateField({ handleValidation, required, error })
        }
      />
    );
  }
}

export default SortableContainer(SettingsJsonFieldContainer);
