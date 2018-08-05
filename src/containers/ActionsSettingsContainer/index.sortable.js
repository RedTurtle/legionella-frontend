import './index.css';

import React, { Component } from 'react';
import { compose, graphql } from 'react-apollo';
import FaPencil from 'react-icons/lib/fa/pencil';
import { changeMenuType } from '../../actions/menu';
import { connect } from 'react-redux';
import { SettingsQuery } from '../../graphql/queries/settings';
import { UpdateSettingMutation } from '../../graphql/mutations/settings';
import Spinner from '../../components/Spinner';
import SettingsSortableContainer from '../SettingsSortableContainer';
import { arrayMove } from 'react-sortable-hoc';

type Props = {
  loading: boolean,
  settings: $FlowFixMe,
  label: string,
  location: $FlowFixMe,
  changeMenuType: $FlowFixMe,
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
      menuType: 'ActionSettings',
      formMode: 'add',
    });
  };

  onSortEnd = ({ oldIndex, newIndex }) => {
    const { settings, submit } = this.props;
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
      initialPosition: oldIndex,
    };
    submit(input).catch(error => console.trace(error));
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
          <div className="action" key={node.id}>
            <h3>
              {node.position}. {node.value}
            </h3>
            <div className="setting-buttons">
              <button
                className="edit"
                type="button"
                onClick={() => this.editSetting(node.id)}
              >
                <FaPencil />
              </button>
              <button className="delete" type="button" onClick={() => {}}>
                x
              </button>
            </div>
          </div>
        );
      });
    }
    return (
      <div className="edit-settings actions">
        <div className="settings-header">
          <h2 className="">Impostazioni - Azioni</h2>
        </div>
        <SettingsSortableContainer
          useDragHandle={true}
          onSortEnd={this.onSortEnd}
        >
          {actions}
        </SettingsSortableContainer>
        <div className="add-setting">
          Aggiungi voce:
          <button
            className="add"
            type="button"
            onClick={() => this.addSetting()}
          >
            +
          </button>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({});

const actionMethods = { changeMenuType };

export default connect(mapStateToProps, actionMethods)(
  compose(
    graphql(SettingsQuery, {
      options: () => ({
        variables: { settingType: 'noteaction' },
      }),
      props: ({ data: { loading, settings } }) => ({
        loading,
        settings,
      }),
    }),
    graphql(UpdateSettingMutation, {
      props: ({ mutate }) => ({
        submit: input => {
          return mutate({
            variables: {
              input: {
                position: input.position,
                settingId: input.settingId,
              },
            },
            optimisticResponse: {
              __typename: 'Mutation',
              updateSetting: {
                __typename: 'Setting',
                ok: true,
                input: input,
              },
            },
            update: (proxy, { data: { updateSetting } }) => {
              // Read the data from our cache for this query.
              const data = proxy.readQuery({
                query: SettingsQuery,
                variables: { settingType: 'noteaction' },
              });
              const { input } = updateSetting;
              if (input) {
                data.settings.edges = arrayMove(
                  data.settings.edges,
                  input.initialPosition,
                  input.position,
                );
                // // Add our comment from the mutation to the end.
                // data.comments.push(submitComment);
                // // Write our data back to the cache.
                proxy.writeQuery({
                  query: SettingsQuery,
                  data,
                });
              }
            },
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
  )(ActionsSettingsContainer),
);

// export default connect(mapStateToProps, actionMethods)(
//   compose(
//     graphql(SettingDetailsQuery, {
//       options: ({ entryId }) => ({
//         variables: { id: entryId },
//       }),
//       props: ({ data: { loading, setting } }) => ({
//         loading,
//         setting,
//       }),
//     }),
//     graphql(CreateSettingMutation, {
//       props: ({ mutate }) => ({
//         submit: input => {
//           return mutate({ variables: { ...input } });
//         },
//       }),
//     }),
//     graphql(UpdateSettingMutation, {
//       props: ({ mutate }) => ({
//         update: input => {
//           return mutate({ variables: { ...input } });
//         },
//       }),
//     }),
//     // graphql(DeleteSettingsMutation, {
//     //   props: ({ mutate }) => ({
//     //     deleteMutation: input => {
//     //       return mutate({ variables: { ...input } });
//     //     },
//     //   }),
//     // }),
//   )(ActionsSettingsFormContainer),
// );
