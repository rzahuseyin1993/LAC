import { styled } from '@mui/material/styles';
import { TextValidator as OriginTextValidator } from 'react-material-ui-form-validator';

export const TextValidator = styled(OriginTextValidator)({
  width: '100%',
  marginTop: '16px',
  '& .MuiOutlinedInput-input': {
    padding: '10px 14px',
  },
  '& .MuiInputLabel-root': {
    top: '-8px',
  },
});
