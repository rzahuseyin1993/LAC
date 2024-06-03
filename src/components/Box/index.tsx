import MuiBox from '@mui/material/Box';
import { BoxProps } from '@mui/material';

const Box = (props: BoxProps) => {
  return (
    <MuiBox {...props} component="div">
      {props.children}
    </MuiBox>
  );
};

export default Box;
