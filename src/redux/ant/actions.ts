import {createAction} from '@reduxjs/toolkit';

import {AntsProps} from '../../types';

type updateAntStatusPayload = {
  index: number;
  ant: Partial<AntsProps>;
};

export default {
  setAntsInfo: createAction<AntsProps[]>('SET_ANTS_INFO'),
  updateAntInfo: createAction<updateAntStatusPayload>('ANT_UPDATE_INFO'),
  startCalculation: createAction<boolean>('ANT_START_CALCULATION'),
};
