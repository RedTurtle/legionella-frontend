// @flow
import './index.css';

import React, { Component } from 'react';
import { graphql, compose } from 'react-apollo';
import FaPencil from 'react-icons/lib/fa/pencil';
import FaPlus from 'react-icons/lib/fa/plus';
import { changeMenuType } from '../../actions/menu';
import { connect } from 'react-redux';
import { SettingsQuery } from '../../graphql/queries/settings';
import Spinner from '../../components/Spinner';
import { DeleteSettingMutation } from '../../graphql/mutations/settings';
import SettingsDeleteButton from '../../components/SettingsDeleteButton';

type Props = {
  loading: boolean,
  settings: $FlowFixMe,
  label: string,
  location: $FlowFixMe,
  changeMenuType: $FlowFixMe,
  deleteMutation: $FlowFixMe,
};

class ActionsSettingsContainer extends Component<Props> {
  editSetting = id => {
    this.props.changeMenuType({
      menuType: 'actionsSettings',
      formMode: 'edit',
      entryId: id,
    });
  };

  addSetting = id => {
    this.props.changeMenuType({
      menuType: 'actionsSettings',
      settingType: 'noteaction',
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
    const { settings, loading } = this.props;
    if (loading) {
      return <Spinner />;
    }

    let actions = '';
    if (settings.edges.length > 0) {
      actions = settings.edges.map(({ node }, index) => {
        return (
          <div className="settings-details action" key={node.id}>
            <div className="setting-value">{node.value}</div>
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
        );
      });
    }
    return (
      <div className="edit-settings actions">
        <div className="settings-header container">
          <h1>Impostazioni - Azioni</h1>
        </div>
        <div className="settings-content container">
          {actions}
          <div className="add-setting">
            <button
              className="add"
              type="button"
              onClick={() => this.addSetting()}
            >
              <FaPlus />
              <span>Aggiungi gruppo di azioni</span>
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
    // $FlowFixMe
    options: () => ({
      variables: { settingType: 'noteaction' },
    }),
    props: ({ data: { loading, settings } }) => ({
      loading,
      settings,
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
              query: SettingsQuery,
              variables: { settingType: 'noteaction' },
            },
          ],
        });
      },
    }),
  }),
  connect(mapStateToProps, actionMethods),
)(ActionsSettingsContainer);
