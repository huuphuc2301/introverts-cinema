import { makeStyles } from '@mui/styles';
import { Theme } from '@mui/material';

const useStyles = makeStyles((theme: Theme) => ({
  container: {
    fontSize: '1.75em',
    position: 'relative',
    [theme.breakpoints.down('md')]: {
      fontSize: '1em !important',
    },
    boxShadow: 'none !important',
    '& img': {
      transition: '0.5s',
      overflow: 'hidden',
    },
    '&:hover': {
      '& img': {
        backgroundColor: '#1D1C1A',
        opacity: '0.9',
        filter: 'brightness(20%)',
      },
    },
  },

  information: {
    padding: '0.75em !important',
    fontSize: '0.625em',
    top: '0rem',
    position: 'absolute',
    color: '#FFFFFF',
  },

  actions: {
    fontSize: '0.75em !important',
    minWidth: '100%',
    maxWidth: '100%',
    left: '50%',
    transform: 'translate(-50%)',
    bottom: 2,
    position: 'absolute',
    display: 'flex',
    justifyContent: 'space-around',
    filter: 'brightness(100%) !important',
  },

  button: {
    fontSize: '0.75em !important',
    width: 'max-content',
    minWidth: '0 !important',
    margin: '0 !important',
    color: '#FFFFFF' + '!important',
  },
}));

export default useStyles;
