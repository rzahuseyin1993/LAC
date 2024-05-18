import { Backdrop, CircularProgress } from '@mui/material';

const GlobalLoader = () => {
  return (
    <Backdrop sx={{ color: '#fff', zIndex: 999999 }} open={true}>
      <CircularProgress color="inherit" />
    </Backdrop>
  );
};

export default GlobalLoader;
