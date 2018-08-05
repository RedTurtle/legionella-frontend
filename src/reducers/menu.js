// @flow
import * as types from '../constants/ActionTypes';

export type MenuState = {
  open: boolean,
  menuType: ?string,
  settingType: ?string,
  formMode: ?string,
  entryId: ?string,
  sampleRangeId: ?string,
};

export type MenuAction = {
  type: string,
  data: $FlowFixMe,
};

const initialStateFactory = (): MenuState => ({
  open: false,
  menuType: null,
  entryId: null,
  sampleRangeId: null,
  settingType: null,
  formMode: null,
});

const initialState = initialStateFactory();

const menu = (
  state: MenuState = initialState,
  action: MenuAction,
): MenuState => {
  switch (action.type) {
    case types.OPEN_CLOSE_MENU:
      // return { ...state, open: !state.open };
      return Object.assign({}, state, { open: !state.open });
    case types.SET_MENU_TYPE:
      return Object.assign(
        {},
        state,
        { open: !state.open, entryId: null, sampleRangeId: null }, //reset ids. If we are in edit mode, they will be set in the next row
        action.data,
      );
    // return { ...state, open: !state.open, menuType: action.data.menuType };
    default:
      return state;
  }
};

export default menu;
