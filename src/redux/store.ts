import {configureStore} from '@reduxjs/toolkit';

import antReducer from './ant/reducer';

const store = configureStore({
  reducer: {ant: antReducer},
});

export type RootState = ReturnType<typeof antReducer>;

export default store;
