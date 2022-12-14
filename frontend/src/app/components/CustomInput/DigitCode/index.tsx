import React, { useEffect } from 'react'
import useDigitInput from 'react-digit-input';
import Grid from '@mui/material/Unstable_Grid2';
import useStyles from './styles';
import { useDispatch } from 'react-redux';
import { registerActions } from 'app/components/LoginDialog/Register/slice';
import { forgotPasswordActions } from 'app/components/LoginDialog/ForgotPassword/slice';

interface DigitCodeProps {
  action: 'register' | 'forgot-password'
}

export default function DigitCode(props: DigitCodeProps) {
  const [value, onChange] = React.useState('');
  const digits = useDigitInput({
    acceptedCharacters: /^[0-9]$/,
    length: 6,
    value,
    onChange,
  });

  const dispatch = useDispatch()
  useEffect(() => {
    props.action == 'register' ?
      dispatch(registerActions.storeOTP(value))
      : props.action == 'forgot-password'
        ? dispatch(forgotPasswordActions.storeOTP(value))
        : null
  }, [value])

  const classes = useStyles();
  return (
    <Grid
      container
      width='5.5em'
      height='2.125.em '
      m='auto'
    >
      {[0, 1, 2, 3, 4, 5].map((index: number) => {
        return (
          <Grid xs={2} key={index}>
            <input
              placeholder='_'
              className={classes.digit}
              inputMode='decimal'
              autoFocus={index == 0 ? true : undefined}
              {...digits[index]} />
          </Grid>
        )
      })}
    </Grid>
  )
}
