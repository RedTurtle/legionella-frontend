// @flow
import './index.css';
import * as React from 'react';

type Props = {
  required: boolean,
  resetState?: boolean,
  render: ({
    value: any,
    handleValidation: () => void,
    required: boolean,
    error: React.Node,
  }) => any,
  value: any,
};

type State = { error: string | null };

class FieldWithValidation extends React.Component<Props, State> {
  state = { error: null };

  componentWillReceiveProps(newProps: Props) {
    if (this.props.resetState) {
      this.setState({ error: null });
      return;
    }
    if (this.props.value !== newProps.value) {
      this.checkRequiredConstraint({ ...newProps });
    }
  }

  checkRequiredConstraint = ({
    required,
    value,
  }: {
    required: boolean,
    value: any,
  }) => {
    const { error } = this.state;
    if (!required) {
      return;
    }
    if (!value || value.length === 0) {
      if (!error) {
        this.setState({ error: 'Campo obbligatorio.' });
      }
    } else {
      if (error && error.length) {
        this.setState({ error: null });
      }
    }
  };

  onBlur = () => {
    this.checkRequiredConstraint({ ...this.props });
  };

  render() {
    const { required = false, render, value } = this.props;
    const { error } = this.state;
    return render({ value, handleValidation: this.onBlur, required, error });
  }
}

export default FieldWithValidation;
