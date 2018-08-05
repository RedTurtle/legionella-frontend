// @flow
import * as types from '../constants/ActionTypes';

export const openStructure = (structureId: string) => {
  return {
    type: types.OPEN_STRUCTURE,
    structureId,
  };
};

export const closeStructure = (structureId: string) => {
  return {
    type: types.CLOSE_STRUCTURE,
    structureId,
  };
};

export const reOpenStructures = () => {
  return {
    type: types.REOPEN_STRUCTURES,
  };
};
