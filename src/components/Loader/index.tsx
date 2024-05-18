import { CircularProgress, Stack, Typography } from '@mui/material';

type LoaderProps = {
  text?: string;
  color?: string;
};
const Loader = (props: LoaderProps) => {
  const { text, color } = props;

  return (
    <Stack
      direction={'row'}
      justifyContent={'center'}
      alignItems={'center'}
      spacing={2}
      sx={{
        marginTop: 4,
        marginBottom: 4,
      }}
    >
      <CircularProgress size={'24px'} />
      <Typography
        sx={{
          color: color ?? 'black',
          fontSize: '18px',
          // fontFamily: 'Inter',
          // fontWeight: '400',
        }}
      >
        {text ?? 'Loading...'}
      </Typography>
    </Stack>
  );
};

export default Loader;
