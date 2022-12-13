import { Height } from '@mui/icons-material';
import { makeStyles } from '@mui/styles';
import { spacing } from '@mui/system';

const useStyles = makeStyles(() => ({
filmTable: {
    height: 1100, 
    width: '95%',
    margin: 'auto'
},
collumnHeader: {
    fontWeight: 'bold',
},
addButton: {
    variant: 'outlined',
    align: 'left !important',
}
}));

export default useStyles;