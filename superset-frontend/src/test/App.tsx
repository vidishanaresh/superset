import React from 'react';
import { hot } from 'react-hot-loader/root';
// import ToastPresenter from '../messageToasts/containers/ToastPresenter';
import setupApp from '../setup/setupApp';
import setupPlugins from '../setup/setupPlugins';
import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit';

// import '../../stylesheets/reactable-pagination.less';

setupApp();
setupPlugins();

import './App.css';

import Form, { formSlice } from './Form';
import Folder, { folderSlice } from './Folders';
import ModalConfirm, { modalConfirmSlice } from './Modals';
import { AnyAction } from 'redux';

declare global {

  type Reducer<T> = (state: T, action?: AnyAction) => T;

  interface Item {
    label: string,
    type: string,
    childIds: number[],
    selected?: boolean,
  }

  interface ModalConfirm {
    open: boolean,
    title: string,
    description: string,
    callback: Reducer<State>,
  }

  interface State {
    props: {
      selectedId: number,
    },
    items: {
      [id: number]: Item,
    },
    modalConfirm: ModalConfirm,
  }

}

const initialState: State = {
  props: {
    selectedId: 0,
  },
  items: {
    0: {
      label: 'root',
      type: 'folder',
      childIds: [1, 2],
    },
    1: {
      label: 'folder1',
      type: 'folder',
      childIds: [],
    },
    2: {
      label: 'folder2',
      type: 'folder',
      childIds: [3],
    },
    3: {
      label: 'folder4',
      type: 'folder',
      childIds: [],
    },
  },
  modalConfirm: {
    open: false,
    title: '',
    description: '',
    callback: (state) => state,
  }
};

function composeReducers<T>(initState: T, ...reducers: Reducer<T>[]) {
  return (state: T, action: AnyAction) => {
    return reducers.reduce((acc: T, reducer: Reducer<T>) => {
      return reducer(acc, action);
    }, state ?? initState);
  }
}

const reducer = composeReducers<{}>(
  initialState,
  formSlice.reducer,
  folderSlice.reducer,
  modalConfirmSlice.reducer,
);

export const store = configureStore({
  reducer,
  middleware: getDefaultMiddleware({
    serializableCheck: false,
  }),
});

function App() {
  return (
    <>
      <Form />
      <Folder key={0} id={0} />
      <ModalConfirm />
    </>
  );
}

export default hot(App);
