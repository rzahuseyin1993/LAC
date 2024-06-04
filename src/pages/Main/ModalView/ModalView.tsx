import { useContext, useEffect, useState } from 'react';
import { Dialog } from '@mui/material';

import { MainContext } from '../Main';
import CreateAsset from './CreateAsset';

const ModalView = () => {
  const { modalView, setModalView } = useContext(MainContext);
  const [open, setOpen] = useState<boolean>(false);

  const handleClose = () => {
    setModalView(undefined);
  };

  useEffect(() => {
    setOpen(modalView ? true : false);
  }, [modalView]);

  return (
    <Dialog open={open} onClose={handleClose} sx={{ width: '100%' }}>
      {modalView === 'createAsset' && <CreateAsset />}
    </Dialog>
  );
};

export default ModalView;
