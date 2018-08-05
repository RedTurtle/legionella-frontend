// @flow
import * as React from 'react';

import WSP from '../../components/WSP';
import Spinner from '../../components/Spinner';
import { graphql } from 'react-apollo';
import { connect } from 'react-redux';
import { changeMenuType } from '../../actions/menu';
import { WspListQuery } from '../../graphql/queries/wsp';

// Initialize GraphQL queries or mutations with the `gql` tag

type Props = {
  structureId: string,
  loading: boolean,
  structure: $FlowFixMe,
  changeMenuType: ({ menuType: string, entryId: string }) => void,
};

class WSPListContainer extends React.Component<Props> {
  render() {
    const { loading, structure } = this.props;
    if (loading) {
      return <Spinner />;
    }
    const wsps = structure ? structure.wspSet : null;
    if (!wsps || wsps.edges.length === 0) {
      return null;
    }
    return (
      <div className="child-wsps">
        {wsps.edges.map((wsp, id) => (
          <WSP
            wsp={wsp.node}
            key={id}
            changeMenuType={this.props.changeMenuType}
          />
        ))}
      </div>
    );
  }
}

const actionMethods = { changeMenuType };

const connectedComponent = connect(() => ({}), actionMethods)(WSPListContainer);

const wspsListElement = graphql(WspListQuery, {
  // $FlowFixMe
  options: ({ structureId }) => {
    return { fetchPolicy: 'cache-and-network', variables: { id: structureId } };
  },
  props: ({ data: { loading, structure } }) => ({
    loading,
    structure,
  }),
  // $FlowFixMe
})(connectedComponent);
// $FlowFixMe
export default wspsListElement;
