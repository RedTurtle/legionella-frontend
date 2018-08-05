// @flow
import * as types from '../constants/ActionTypes';

export type StructureState = {
  openStructures: Array<string>,
  toggleOpenedStructures: boolean,
};

const initialStateFactory = (): StructureState => ({
  openStructures: [],
  toggleOpenedStructures: false,
});

const initialState = initialStateFactory();

const structure = (
  state: StructureState = initialState,
  action: $FlowFixMe,
) => {
  switch (action.type) {
    case types.OPEN_STRUCTURE:
      return {
        ...state,
        openStructures: [...state.openStructures, action.structureId],
      };
    case types.CLOSE_STRUCTURE:
      return {
        ...state,
        openStructures: state.openStructures.filter(
          id => id !== action.structureId,
        ),
      };
    case types.REOPEN_STRUCTURES:
      return {
        ...state,
        toggleOpenedStructures: !state.toggleOpenedStructures,
      };
    default:
      return state;
  }
};

export default structure;
