// @flow
import React, { Component } from 'react';
import { compose, graphql } from 'react-apollo';
import FaPencil from 'react-icons/lib/fa/pencil';
import { SettingsQuery } from '../../graphql/queries/settings';
import {
  DeleteSettingMutation,
  UpdateSettingMutation,
} from '../../graphql/mutations/settings';
import FaPlus from 'react-icons/lib/fa/plus';
import { changeMenuType } from '../../actions/menu';
import { connect } from 'react-redux';
import Spinner from '../../components/Spinner';
import SettingsDeleteButton from '../../components/SettingsDeleteButton';
import SettingsSortableContainer from '../SettingsSortableContainer';

type Props = {
  loading: boolean,
  settings: $FlowFixMe,
  label: string,
  changeMenuType: $FlowFixMe,
  deleteMutation: $FlowFixMe,
  updateMutation: $FlowFixMe,
};

const settingType = 'risk_level';

class LivelliRischioSettingsContainer extends Component<Props> {
  editSetting = id => {
    this.props.changeMenuType({
      menuType: 'livelliRischio',
      formMode: 'edit',
      entryId: id,
      settingType,
    });
  };

  addSetting = id => {
    this.props.changeMenuType({
      menuType: 'livelliRischio',
      formMode: 'add',
      settingType,
    });
  };

  deleteSetting = id => {
    const { deleteMutation } = this.props;
    deleteMutation({
      input: { settingId: id },
      settingType,
    }).catch(error => console.trace(error));
  };

  onSortEnd = ({ oldIndex, newIndex }) => {
    const { settings, updateMutation } = this.props;
    const matchSetting = settings.edges.filter(
      ({ node }, index) => index === oldIndex,
    );
    const setting = matchSetting.length === 1 ? matchSetting[0] : null;
    if (!setting) {
      return;
    }
    const input = {
      settingId: setting.node.id,
      position: newIndex,
    };
    updateMutation(input).catch(error => console.trace(error));
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
          <div
            className="setting-description"
            style={{
              backgroundColor: node.description,
              height: '25px',
              width: '80px',
              margin: '15px 0',
            }}
          />
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
      <div className="edit-settings risk-level-settings">
        <div className="settings-header container">
          <h1>Impostazioni - {label}</h1>
        </div>
        <div className="settings-content container">
          <SettingsSortableContainer
            useDragHandle={true}
            onSortEnd={this.onSortEnd}
            lockAxis="y"
            lockToContainerEdges
          >
            {settingsItems}
          </SettingsSortableContainer>
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
      variables: { settingType, orderBy: 'position' },
    }),
    props: ({ data: { loading, settings } }) => ({
      loading,
      settings,
    }),
  }),
  // $FlowFixMe
  graphql(UpdateSettingMutation, {
    props: ({ mutate }) => ({
      updateMutation: input => {
        return mutate({
          variables: { input }, // $FlowFixMe
          refetchQueries: [
            {
              query: SettingsQuery,
              variables: { settingType, orderBy: 'position' },
            },
          ],
        });
      },
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
              variables: { settingType, orderBy: 'position' },
            },
          ],
        });
      },
    }),
  }),
  connect(mapStateToProps, actionMethods),
)(LivelliRischioSettingsContainer);
