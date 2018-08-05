// @flow
import type { MenuState } from './menu';
import type { SampleRangeFormState } from './sampleRangeForm';
import type { UserState } from './user';
import type { StructureState } from './structure';
import type { ErrorState } from './error';
import { combineReducers } from 'redux';
import menu from './menu';
import sampleRangeForm from './sampleRangeForm';
import structure from './structure';
import user from './user';
import error from './error';

export type ReduxState = {
  menu: MenuState,
  structure: StructureState,
  sampleRangeForm: SampleRangeFormState,
  user: UserState,
  error: ErrorState,
};

export default combineReducers({
  menu,
  structure,
  sampleRangeForm,
  user,
  error,
});
