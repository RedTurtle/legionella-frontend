// @flow
import * as React from 'react';
import SelectWspFieldContainer from '../SelectWspFieldContainer';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { fieldWithPermissions } from '../../hocs/fields';

type Props = {
  restrictedFields: $FlowFixMe,
  visibleFields: $FlowFixMe,
  isFieldEditable: $FlowFixMe,
  wsps: Array<any>,
  onChange: $FlowFixMe,
  onBlur: () => void,
  value: string,
  disabled: boolean,
  required: boolean,
  error: React.Node,
};

class SelectWspContainer extends React.Component<Props> {
  render() {
    const { disabled, required, error } = this.props;
    const isEditable = this.props.isFieldEditable('wsp') && !disabled;
    return (
      <div className="Field">
        <h3 className="FieldName">
          WSP{required && (
            <span title="Campo obbligatorio" className="required-label" />
          )}
        </h3>
        {isEditable ? (
          <span className="FieldDescription">
            Codice WSP - Puoi cercare per codice, descrizione o settore
          </span>
        ) : (
          ''
        )}
        {error ? <div className="error-message">{error}</div> : null}
        <SelectWspFieldContainer {...this.props} isEditable={isEditable} />
      </div>
    );
  }
}

const mapStateToProps = state => ({
  restrictedFields: state.sampleRangeForm.restrictedFields,
  visibleFields: state.sampleRangeForm.visibleFields,
});

const actionMethods = {};

export default compose(
  connect(mapStateToProps, actionMethods),
  fieldWithPermissions,
)(SelectWspContainer);
