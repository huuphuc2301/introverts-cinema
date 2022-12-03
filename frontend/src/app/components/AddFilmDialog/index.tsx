import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Checkbox,
  Dialog,
  Divider,
  FormControlLabel,
  Grid,
  IconButton,
  InputAdornment,
  Link as LinkMUI,
  Typography,
} from '@mui/material';
import { CustomInput } from 'app/components/CustomInput';
import useStyles from './styles';
import { useForm } from 'hooks/useForm';

export default function AddFilmDialog(props: any) {
  const classes = useStyles();


  const validate = (fieldValues = values) => {
    const tmp = { ...errors };
    if ('openingDay' in fieldValues) {
      tmp.openingDay = '';
      const today = new Date();
      if (fieldValues.openingDay > today) tmp.openingDay = 'Ngày sinh không hợp lệ'
    }
    setErrors({ ...tmp });
    if (fieldValues == values) {
      return Object.values(tmp).every((x) => x == '');
    }
  }

  
  const { values, setValues, errors, setErrors } = useForm(
    {
      title: '',
      duration: 0,
      directors: '',
      actors: '',
      openingDay: null,
      nationalityId: 0,
      trailerUrl: '',
    },
    true,
    validate
  );

  const handleCloseDialog = () => {
    props.onClose();
  };

  return (
    <Dialog open={props.open} onClose={handleCloseDialog}>
      {props.data.id ? (
        <Box className={classes.AddFilmBox}>
          <Typography
            sx={{
              textAlign: 'center',
              mb: 2,
            }}
            variant="h5"
            fontWeight="bold"
          >
            Sửa thông tin phim
          </Typography>
          <CustomInput.TextField
            label="Tên phim"
            name="title"
            value={props.data.title}
            autoFocus
            inputProps={{ maxLength: '64' }}
          />
          <CustomInput.TextField
            label="Poster"
            name="imageUrl"
            value={props.data.imageUrl}
            inputProps={{ maxLength: '64' }}
          />
          <Grid xs={12} container columnSpacing={2} sx={{alignContent:'center'}} item={true}>
            <Grid xs={5} item={true}>
              <CustomInput.TextField
                label="Thời lượng"
                name="duration"
                margin="dense"
                value={props.data.duration}
                inputProps={{ maxLength: '32' }}
              />
            </Grid>

            <Divider orientation="vertical" flexItem />
            <Grid xs={5} item={true}>
              <CustomInput.DatePicker
                label="Ngày khởi chiếu"
                name="openingDay"
                margin="dense"
                value={props.data.openingDay}
                onChange={(openingDay: any) => {
                  if (openingDay === null) return;
                  validate({ openingDay: openingDay });
                  setValues({
                    ...values,
                    openingDay: openingDay,
                  });
                }}
                inputProps={{ maxLength: '32' }}
              />
            </Grid>
          </Grid>

          <CustomInput.TextField
            label="Đạo diễn"
            name="directors"
            value={props.data.directors}
            inputProps={{ maxLength: '64' }}
          />
          <CustomInput.TextField
            label="Diễn viên"
            name="actors"
            value={props.data.actors}
            inputProps={{ maxLength: '64' }}
          />
          <CustomInput.TextField
            label="Mã quốc gia"
            name="nationalityId"
            value={props.data.nationalityId}
            inputProps={{ maxLength: '64' }}
          />
          <CustomInput.TextField
            label="Trailer"
            name="trailerUrl"
            value={props.data.trailerUrl}
            inputProps={{ maxLength: '64' }}
          />
          <Button
            fullWidth
            variant="contained"
            sx={{ mt: 2, p: 1, fontWeight: 'bold', color: 'white' }}
            disableFocusRipple
            className={classes.AddFilmButton}
          >
            Thay đổi
          </Button>
        </Box>
      ) : (
        <Box className={classes.AddFilmBox}>
          <Typography
            sx={{
              textAlign: 'center',
              mb: 2,
            }}
            variant="h5"
            fontWeight="bold"
          >
            Thêm phim mới
          </Typography>
          <CustomInput.TextField
            label="Tên phim"
            name="title"
            autoFocus
            inputProps={{ maxLength: '64' }}
          />
          <CustomInput.TextField
            label="Poster"
            name="imageUrl"
            inputProps={{ maxLength: '64' }}
          />
          <Grid xs={12} container columnSpacing={2} item={true}>
            <Grid xs={6} item={true}>
              <CustomInput.TextField
                label="Thời lượng"
                name="duration"
                margin="dense"
                inputProps={{ maxLength: '32' }}
              />
            </Grid>
            <Grid xs={6} item={true}>
              <CustomInput.DatePicker
                label="Ngày khởi chiếu"
                name="openingDay"
                margin="dense"
                inputProps={{ maxLength: '32' }}
              />
            </Grid>
          </Grid>

          <CustomInput.TextField
            label="Đạo diễn"
            name="directors"
            inputProps={{ maxLength: '64' }}
          />
          <CustomInput.TextField
            label="Diễn viên"
            name="actors"
            inputProps={{ maxLength: '64' }}
          />
          <CustomInput.TextField
            label="Mã quốc gia"
            name="nationalityId"
            inputProps={{ maxLength: '64' }}
          />
          <CustomInput.TextField
            label="Trailer"
            name="trailerUrl"
            inputProps={{ maxLength: '64' }}
          />
          <Button
            fullWidth
            variant="contained"
            sx={{ mt: 2, p: 1, fontWeight: 'bold', color: 'white' }}
            disableFocusRipple
            className={classes.AddFilmButton}
          >
            Thêm phim
          </Button>
        </Box>
      )}
    </Dialog>
  );
}
