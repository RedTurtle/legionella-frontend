// @flow
import * as types from '../constants/ActionTypes';

export const openCloseMenu = (): types.Action => ({
  type: types.OPEN_CLOSE_MENU,
});

export const changeMenuType = (data: {
  menuType: string,
  sampleRangeId?: string,
  entryId?: string,
  formMode: string,
}): types.Action => ({
  type: types.SET_MENU_TYPE,
  data,
});
