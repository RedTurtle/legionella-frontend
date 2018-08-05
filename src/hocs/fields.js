// @flow
import * as React from 'react';
import { Component } from 'react';

type Props = { restrictedFields: Array<string>, visibleFields: Array<string> };

export function fieldWithPermissions(WrappedComponent: any, fieldsInfos: any) {
  return class extends Component<Props> {
    constructor(props: any) {
      super(props);
      this.isFieldEditable = this.isFieldEditable.bind(this);
    }

    isFieldEditable = (fieldId: string) => {
      const { restrictedFields, visibleFields } = this.props;
      if (!restrictedFields.includes(fieldId)) {
        // it's a free field
        return true;
      }
      return visibleFields.includes(fieldId);
    };

    render() {
      return (
        <WrappedComponent
          {...this.props}
          isFieldEditable={this.isFieldEditable}
        />
      );
    }
  };
}
