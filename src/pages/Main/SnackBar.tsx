import { useContext } from 'react';
import { Snackbar, Alert, SnackbarCloseReason } from '@mui/material';
import { MainContext } from './Main';

const SnackBar = () => {
  const { modalView, notification, setNotification } = useContext(MainContext);

  return (
    <Snackbar
      open={modalView ? true : false}
      autoHideDuration={6000}
      // @ts-ignore
      onClose={(
        //@ts-ignore
        event: SyntheticEvent<any, Event>,
        reason: SnackbarCloseReason,
      ) => {
        if (reason === 'clickaway') {
          return;
        }
        setNotification(undefined);
      }}
    >
      <Alert
        severity={notification?.type}
        variant="filled"
        sx={{ width: '100%' }}
      >
        {notification?.message}
      </Alert>
    </Snackbar>
  );
};

export default SnackBar;
