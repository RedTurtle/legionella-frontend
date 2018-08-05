// @flow
import './index.css';

import React, { Component } from 'react';
import { graphql, compose } from 'react-apollo';
import FaPencil from 'react-icons/lib/fa/pencil';
import {
  AllRangesQuery,
  // AllInactiveRangesQuery,
} from '../../graphql/queries/ranges';
import FaPlus from 'react-icons/lib/fa/plus';
import { changeMenuType } from '../../actions/menu';
import { connect } from 'react-redux';
import Spinner from '../../components/Spinner';
import { DeleteSettingMutation } from '../../graphql/mutations/settings';
// import SettingsDeleteButton from '../../components/SettingsDeleteButton';

type Props = {
  loading: boolean,
  allRanges: $FlowFixMe,
  label: string,
  location: $FlowFixMe,
  changeMenuType: $FlowFixMe,
  deleteMutation: $FlowFixMe,
};

class RangeLegionellaSettingsContainer extends Component<Props> {
  editSetting = id => {
    this.props.changeMenuType({
      menuType: 'rangeLegionellaSettings',
      formMode: 'edit',
      entryId: id,
    });
  };

  addSetting = () => {
    this.props.changeMenuType({
      menuType: 'rangeLegionellaSettings',
      formMode: 'add',
    });
  };

  deleteSetting = id => {
    const { deleteMutation } = this.props;
    deleteMutation({
      input: { settingId: id },
    }).catch(error => console.trace(error));
  };

  render() {
    const { allRanges, loading } = this.props;
    if (loading) {
      return <Spinner />;
    }
    let settingsItems = '';
    if (allRanges && allRanges.edges.length > 0) {
      settingsItems = allRanges.edges.map(({ node }) => {
        return (
          <div className="settings-details range-legionella" key={node.id}>
            <div className="setting-value">
              Range per: {node.rangeType.description}
            </div>
            <div className="setting-buttons">
              <button
                className="edit"
                type="button"
                onClick={() => this.editSetting(node.id)}
              >
                <FaPencil />
                <span>Modifica</span>
              </button>
              {/* <SettingsDeleteButton
                confirmAction={this.deleteSetting(node.id)}
                settingLabel={node.value}
                settingId={node.id}
              /> */}
            </div>
          </div>
        );
      });
    }
    return (
      <div className="edit-settings">
        <div className="settings-header container">
          <h1 className="">Impostazioni - Range</h1>
        </div>
        <div className="settings-content container">
          {settingsItems}
          <div className="add-setting">
            <button className="add" type="button" onClick={this.addSetting}>
              <FaPlus />
              <span>Aggiungi nuovo range</span>
            </button>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({});

const actionMethods = { changeMenuType };

// $FlowFixMe
export default compose(
  // $FlowFixMe
  graphql(AllRangesQuery, {
    props: ({ data: { loading, allRanges } }) => ({
      loading,
      allRanges,
    }),
    // $FlowFixMe
  }),
  // $FlowFixMe
  graphql(DeleteSettingMutation, {
    props: ({ mutate }) => ({
      deleteMutation: ({ input }) => {
        return mutate({
          variables: { input },
          refetchQueries: [
            {
              query: AllRangesQuery,
            },
          ],
        });
      },
    }),
  }),
  connect(mapStateToProps, actionMethods),
)(RangeLegionellaSettingsContainer);
