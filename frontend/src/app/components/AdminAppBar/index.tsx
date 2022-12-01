import { makeStyles } from '@mui/styles';
import { Button, AppBar as MuiAppBar, Hidden, Theme } from '@mui/material';
import useStyles from './styles';
import { Link } from 'react-router-dom';

export default function AdminAppBar() {
    const classes = useStyles();
    return (
        <MuiAppBar
            className={classes.appBar}
            color='primary'
            position='sticky'
            sx={{
                fontSize: { xs: '10px !important', sm: '1em !important' }
            }}
        >
            <Link to='/' style={{ zIndex: 'inherit' }}>
                <Button disableRipple
                    className={classes.logoButton}
                    sx={{
                        position: 'absolute'
                    }}
                    color='secondary'
                >
                    <img className={classes.logo} src={require('app/assets/images/logo.webp')} />
                </Button>
            </Link>
        </MuiAppBar>);
}