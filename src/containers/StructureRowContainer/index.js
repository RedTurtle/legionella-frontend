// @flow
import React, { Component } from 'react';
import { closeStructure, openStructure } from '../../actions/structure';

import BlankCell from '../../components/BlankCell';
import Structure from '../../components/Structure';
import StructureDetailsButton from '../../components/StructureDetailsButton';
import { connect } from 'react-redux';

type Props = {
  openStructures: Array<$FlowFixMe>,
  structureData: $FlowFixMe,
  openStructure: $FlowFixMe,
  closeStructure: $FlowFixMe,
};

class StructureRowContainer extends Component<Props> {
  toggleOpenStructures = structureId => {
    const { openStructures, openStructure, closeStructure } = this.props;
    openStructures.indexOf(structureId) === -1
      ? openStructure(structureId)
      : closeStructure(structureId);
  };

  render() {
    const { structureData, openStructures } = this.props;
    const wsps = structureData ? structureData.aggregatedWsps : 0;
    const isOpen =
      structureData && openStructures.indexOf(structureData.id) !== -1;
    return (
      <div className="structure-row">
        <StructureDetailsButton
          wsps={structureData.wspSet}
          structureId={structureData.id}
          isOpen={isOpen}
          onHandleClick={this.toggleOpenStructures}
        />
        <Structure structure={structureData} isOpen={isOpen} />
        <BlankCell childrenNum={isOpen ? wsps : 0} />
      </div>
    );
  }
}

const mapStateToProps = state => ({
  openStructures: state.structure.openStructures,
});

const actionMethods = { openStructure, closeStructure };

export default connect(mapStateToProps, actionMethods)(StructureRowContainer);
