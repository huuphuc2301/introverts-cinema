import { Height } from '@mui/icons-material';
import { makeStyles } from '@mui/styles';
import { spacing } from '@mui/system';
import { Theme } from '@mui/material';

const useStyles = makeStyles((theme: Theme) => ({
  customerTable: {
    height: 1100,
    width: 'calc(100% - 360px)',
    marginLeft: '330px',
    marginTop: '20px',
  },

  searchInput: {
    color: 'inherit',
    '& .MuiInputBase-input': {
      width: '50%',
      [theme.breakpoints.up('md')]: {
        width: '20ch',
      },
    },
  },

  searchWrapper: {
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
}));

export default useStyles;
