/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';

import {Provider as ReduxProvider} from 'react-redux';

import store from './redux/store';

import Router from './Router';

const App: React.FC = () => {
  return (
    <ReduxProvider store={store}>
      <Router />
    </ReduxProvider>
  );
};

export default App;
