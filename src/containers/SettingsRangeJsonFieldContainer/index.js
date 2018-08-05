// @flow
import React, { Component } from 'react';
import SettingsRangeJsonField from '../../components/SettingsRangeJsonField';
import type { Props as SettingRangeJsonFieldProps } from '../../components/SettingsRangeJsonField';
// import { SortableElement } from 'react-sortable-hoc';

type Props = {
  ...SettingRangeJsonFieldProps,
  index: number,
};

type State = {
  errors: $PropertyType<SettingRangeJsonFieldProps, 'errors'>,
  toValidationTimeout: number,
  fromValidationTimeout: number,
};

const initialState = {
  errors: {
    to: null,
    from: null,
  },
  toValidationTimeout: 0,
  fromValidationTimeout: 0,
};

class SettingsRangeJsonFieldContainer extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = initialState;
    this.validateField({
      fieldId: 'from',
      label: 'Da',
    });
    this.validateField({
      fieldId: 'to',
      label: 'a',
    });
  }

  handleFieldChange = (data: $FlowFixMe) => {
    const { label, ...values } = data;
    const fieldId = data.fieldId;
    // $FlowFixMe
    this.props.handleChange(values);
    if (fieldId !== 'to' && fieldId !== 'from') {
      return;
    }
    if (this.state[`${fieldId}ValidationTimeout`]) {
      clearInterval(this.state[`${fieldId}ValidationTimeout`]);
    }
    const timeout = setTimeout(() => {
      this.validateField({ fieldId, label });
    }, 500);
    this.setState({ ...this.state, [`${fieldId}ValidationTimeout`]: timeout });
  };

  validateField = ({ fieldId, label }: { fieldId: string, label: string }) => {
    const value = this.props[fieldId];
    if (!value) {
      if (this.state.errors[fieldId] !== null) {
        this.setState({
          ...this.state,
          errors: {
            ...this.state.errors,
            [fieldId]: null,
          },
        });
      }
      return;
    }
    const isValid = value.match(/^-?\d*((?:\.|,)\d+)?$/);
    if (!isValid) {
      this.setState({
        ...this.state,
        errors: {
          ...this.state.errors,
          [fieldId]: `Il campo "${label}" deve essere un numero.`,
        },
      });
    } else {
      if (this.state.errors[fieldId] !== null) {
        this.setState({
          ...this.state,
          errors: {
            ...this.state.errors,
            [fieldId]: null,
          },
        });
      }
    }
  };

  render() {
    const { handleChange, ...props } = this.props;
    return (
      <SettingsRangeJsonField
        {...props}
        errors={this.state.errors}
        handleChange={this.handleFieldChange}
      />
    );
  }
}

export default SettingsRangeJsonFieldContainer;
// export default SortableElement(SettingsRangeJsonFieldContainer);
