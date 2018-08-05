// @flow
import './index.css';

import React, { Component } from 'react';
import { compose, graphql } from 'react-apollo';
import FaPencil from 'react-icons/lib/fa/pencil';
import { SettingsQuery } from '../../graphql/queries/settings';
import { DeleteSettingMutation } from '../../graphql/mutations/settings';
import FaPlus from 'react-icons/lib/fa/plus';
import { changeMenuType } from '../../actions/menu';
import { connect } from 'react-redux';
import Spinner from '../../components/Spinner';
import SettingsDeleteButton from '../../components/SettingsDeleteButton';

type Props = {
  loading: boolean,
  settings: $FlowFixMe,
  label: string,
  settingType: string,
  changeMenuType: $FlowFixMe,
  deleteMutation: $FlowFixMe,
};

class StandardSettingsContainer extends Component<Props> {
  editSetting = id => {
    const { settingType } = this.props;
    this.props.changeMenuType({
      menuType: 'standardSettings',
      formMode: 'edit',
      entryId: id,
      settingType,
    });
  };

  addSetting = id => {
    const { settingType } = this.props;
    this.props.changeMenuType({
      menuType: 'standardSettings',
      formMode: 'add',
      settingType,
    });
  };

  deleteSetting = id => {
    const { deleteMutation, settingType } = this.props;
    deleteMutation({
      input: { settingId: id },
      settingType,
    }).catch(error => console.trace(error));
  };

  render() {
    const { settings, loading, label } = this.props;
    if (loading) {
      return <Spinner />;
    }
    let settingsItems = '';
    if (settings && settings.edges.length > 0) {
      settingsItems = settings.edges.map(({ node }) => (
        <div className="settings-details" key={node.id}>
          <div className="setting-value">{node.value}</div>
          <div className="setting-description">{node.description}</div>
          <div className="setting-buttons">
            <button
              className="edit"
              type="button"
              onClick={() => this.editSetting(node.id)}
            >
              <FaPencil />
              <span>Modifica</span>
            </button>
            <SettingsDeleteButton
              confirmAction={() => this.deleteSetting(node.id)}
              settingLabel={node.value}
              settingId={node.id}
            />
          </div>
        </div>
      ));
    }
    return (
      <div className="edit-settings">
        <div className="settings-header container">
          <h1>Impostazioni - {label}</h1>
        </div>
        <div className="settings-content container">
          {settingsItems}
          <div className="add-setting">
            <button className="add" type="button" onClick={this.addSetting}>
              <FaPlus />
              <span>Aggiungi voce</span>
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
  graphql(SettingsQuery, {
    options: ({ settingType }) => ({
      variables: { settingType },
    }),
    props: ({ data: { loading, settings } }) => ({
      loading,
      settings,
    }),
  }),
  // $FlowFixMe
  graphql(DeleteSettingMutation, {
    props: ({ mutate }) => ({
      deleteMutation: ({ input, settingType }) => {
        return mutate({
          variables: { input },
          // $FlowFixMe
          refetchQueries: [
            {
              query: SettingsQuery,
              variables: { settingType },
            },
          ],
        });
      },
    }),
  }),
  connect(mapStateToProps, actionMethods),
)(StandardSettingsContainer);
