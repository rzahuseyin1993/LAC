import { createContext, useState } from 'react';

import MapViewer from './MapViewer';
import ModalView from './ModalView';
import SnackBar from './SnackBar';

export type MainContextPros = {
  globalLoading: boolean;
  setGlobalLoading: (newValue: boolean) => void;
  modalView: string | undefined;
  setModalView: (newValue: string | undefined) => void;
  notification: { type: 'success' | 'error'; message: string } | undefined;
  setNotification: (
    newValue: { type: 'success' | 'error'; message: string } | undefined,
  ) => void;
};

export const MainContext = createContext({} as MainContextPros);

const Main = () => {
  const [globalLoading, setGlobalLoading] = useState<boolean>(false);
  const [modalView, setModalView] = useState<string | undefined>(undefined);
  const [notification, setNotification] = useState<
    { type: 'success' | 'error'; message: string } | undefined
  >(undefined);

  return (
    <MainContext.Provider
      value={{
        globalLoading,
        setGlobalLoading,
        modalView,
        setModalView,
        notification,
        setNotification,
      }}
    >
      <MapViewer />
      {modalView && <ModalView />}
      {notification && <SnackBar />}
    </MainContext.Provider>
  );
};

export default Main;
