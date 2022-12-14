import { makeStyles } from '@mui/styles';

const useStyles = makeStyles(() => ({
  seat: {
    fontSize: 'inherit',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: '1em',
  },

  vacant: {
    color: '#ABABAB',
    transition: '0.2s !important',
    '&:hover': {
      color: '#696969',
    },
  },

  selected: {
    color: '#07BC0C',
    transition: '0.2s !important',
    '&:hover': {
      color: '#2E7D32',
    },
  },

  booked: {
    color: '#E74C3C',
  },

  booking: {
    color: '#F1C40F',
    transition: '0.1s !important',
    '&:hover': {
      color: '#cfa80e',
    },
  },
}));

export default useStyles;
