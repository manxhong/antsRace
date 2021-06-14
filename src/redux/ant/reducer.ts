import actions from './actions';
import {createReducer} from '@reduxjs/toolkit';
import {AntStateType} from './types';
import _ from 'lodash';

const initialState: AntStateType = {
  ants: [],
  startCalculation: false,
};

const reducer = createReducer(initialState, {
  [actions.setAntsInfo.type]: (state, action) => {
    return {...state, ants: action.payload};
  },
  [actions.updateAntInfo.type]: (state, action) => {
    const {index, ant} = action.payload || {};
    const prevAnt = state.ants?.[index] || {};
    const cloneAnt = _.cloneDeep(prevAnt);
    _.mergeWith(cloneAnt, ant);
    return {
      ...state,
      ants: [
        ...state.ants.slice(0, index),
        cloneAnt,
        ...state.ants.slice(index + 1),
      ],
    };
  },
  [actions.startCalculation.type]: (state, action) => {
    return {...state, startCalculation: action.payload};
  },
});

export default reducer;
