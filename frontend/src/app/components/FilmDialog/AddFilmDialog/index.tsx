import React, { useEffect, useState } from 'react';
import {
  Autocomplete,
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogContent,
  Divider,
  FormControl,
  FormControlLabel,
  Grid,
  IconButton,
  InputAdornment,
  InputLabel,
  Link as LinkMUI,
  MenuItem,
  Select,
  TextField,
  Typography,
} from '@mui/material';
import { CustomInput } from 'app/components/CustomInput';
import useStyles from './styles';
import { useForm } from 'hooks/useForm';
import {
  addMovie,
  updateMovie,
  useAddMovie,
  useGetMovieById,
} from 'queries/movies';
import { usegetActors } from 'queries/actors';
import { useGetNationalities } from 'queries/nationality';
import { useGetDirectors } from 'queries/directors';
import { useGetCategories } from 'queries/categories';
import { notify } from 'app/components/MasterDialog';
export default function FilmDialog(props: any) {
  const classes = useStyles();

  const validate = (fieldValues = values) => {
    const tmp = { ...errors };
    if ('openingDay' in fieldValues) {
      tmp.openingDay = '';
      const today = new Date();
      if (fieldValues.openingDay > today) tmp.openingDay = '';
    }
    setErrors({ ...tmp });
    if (fieldValues == values) {
      return Object.values(tmp).every(x => x == '');
    }
  };

  const { isLoading: loadingActors, data: allActors } = usegetActors();
  const { isLoading: loadingNationalities, data: allNationalities } =
    useGetNationalities();
  const { isLoading: loadingDirectors, data: allDirectors } = useGetDirectors();
  const { isLoading: loadingCategories, data: allCategories } =
    useGetCategories();

  const { values, setValues, errors, setErrors, handleInputChange } = useForm(
    {
      id: 0,
      title: '',
      imageUrl: '',
      trailerUrl: '',
      duration: 0,
      openingDay: null,
      description: '',
      rated: '',
      status: '',
      NationalityId: 0,
      Actors: [],
      Categories: [],
      Directors: [],
    },
    true,
    validate,
  );

  const addMovie = useAddMovie(
    values.title,
    values.imageUrl,
    values.trailerUrl,
    values.duration,
    values.openingDay,
    values.description,
    values.rated,
    values.status,
    values.NationalityId,
    values.Categories,
    values.Actors,
    values.Directors,
  );

  useEffect(() => {
    if (addMovie.isSuccess) {
      setTimeout(() => {
        notify({
          type: 'success',
          content: 'Th??m phim th??nh c??ng',
          autocloseDelay: 1500,
        });
      }, 100);
    }

    if (addMovie.isError) {
      setTimeout(() => {
        notify({
          type: 'error',
          content: 'Th??m phim th???t b???i',
          autocloseDelay: 1500,
        });
      }, 100);
    }
  }, [addMovie.isLoading]);
  const handleCloseDialog = () => {
    props.onClose();
  };

  const handleCancelDialog = () => {
    handleCloseDialog();
    console.log('cancel');
    setTimeout(() => {
      notify({
        type: 'warning',
        content: '???? h???y thao t??c',
        autocloseDelay: 1500,
      });
    }, 100);
  };
  const handleAddFilm = () => {
    addMovie.refetch();
    handleCloseDialog();
  };

  // console.log(values);
  return (
    <Dialog
      open={props.open}
      onClose={handleCancelDialog}
      fullWidth
      maxWidth="md"
      scroll="paper"
    >
      <Box className={classes.AddFilmBox}>
        <Typography
          sx={{
            textAlign: 'center',
            mb: 2,
          }}
          variant="h5"
          fontWeight="bold"
        >
          Th??m phim m???i
        </Typography>
        <DialogContent>
          <Grid
            xs={12}
            container
            spacing={2}
            sx={{ alignContent: 'center' }}
            item={true}
          >
            <Grid xs={8} item={true}>
              <CustomInput.TextField
                label="T??n phim"
                name="title"
                value={values.title}
                onChange={handleInputChange}
                autoFocus
                inputProps={{ maxLength: '64' }}
              />
            </Grid>
            <Grid xs={3} item={true}>
              <InputLabel>Tr???ng th??i</InputLabel>
              <Select
                value={values.status}
                autoWidth
                label="Tr???ng th??i"
                onChange={(event: any) => {
                  setValues({ ...values, status: event.target.value });
                }}
              >
                <MenuItem value={'active'} sx={{ background: 'green' }}>
                  ??ang chi???u
                </MenuItem>
                <MenuItem value={'inactive'} sx={{ background: 'red' }}>
                  Ng???ng chi???u
                </MenuItem>
              </Select>
            </Grid>
            <Grid xs={12} container spacing={5} item={true}>
              <Grid xs={3} item={true}>
                <CustomInput.TextField
                  label="Th???i l?????ng"
                  name="duration"
                  margin="dense"
                  type="number"
                  onChange={handleInputChange}
                  value={values.duration}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="start">Ph??t</InputAdornment>
                    ),
                  }}
                  inputProps={{ maxLength: '32' }}
                />
              </Grid>
              <Grid xs={3} item={true}>
                <CustomInput.DatePicker
                  label="Ng??y kh???i chi???u"
                  name="openingDay"
                  margin="dense"
                  value={values.openingDay}
                  inputProps={{ maxLength: '32' }}
                  onChange={(openingDay: any) => {
                    if (openingDay === null) return;
                    validate({ openingDay: openingDay });
                    setValues({
                      ...values,
                      openingDay: openingDay,
                    });
                  }}
                />
              </Grid>
              <Grid xs={5} item={true}>
                <FormControl fullWidth>
                  <InputLabel>Ph??n lo???i</InputLabel>
                  <Select
                    label="Ph??n lo???i"
                    value={values?.rated === null ? '' : values.rated}
                    IconComponent={() => null}
                    onChange={(event: any) => {
                      setValues({ ...values, rated: event.target.value });
                    }}
                  >
                    <MenuItem value={'P'}>
                      P - Ph?? h???p v???i m???i l???a tu???i
                    </MenuItem>
                    <MenuItem value={'C13'}>
                      C13 - C???m tr??? em d?????i 13 tu???i
                    </MenuItem>
                    <MenuItem value={'C16'}>
                      C16 - C???m tr??? em d?????i 16 tu???i
                    </MenuItem>
                    <MenuItem value={'C18'}>
                      C18 - C???m ng?????i d?????i 18 tu???i
                    </MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
            <Grid xs={12} container spacing={2} item={true}>
              <Grid xs={8} item={true}>
                <CustomInput.TextField
                  label="Poster"
                  name="imageUrl"
                  onChange={handleInputChange}
                  value={values.imageUrl}
                  inputProps={{ maxLength: '64' }}
                />
              </Grid>
              <Grid xs={4} item={true}>
                <Autocomplete
                  multiple
                  value={values.Categories}
                  options={loadingCategories ? [] : allCategories}
                  loading={loadingCategories}
                  getOptionLabel={(option: any) => option.name}
                  onChange={(event, value) =>
                    setValues({ ...values, Categories: value.map(id => id) })
                  }
                  isOptionEqualToValue={(option, value) =>
                    option.id === value.id
                  }
                  renderInput={params => (
                    <TextField
                      {...params}
                      variant="standard"
                      label="Th??? lo???i"
                      margin="normal"
                    />
                  )}
                />
              </Grid>
            </Grid>

            <Grid xs={12} container columnSpacing={2} item={true}>
              <Grid xs={8} item={true}>
                <CustomInput.TextField
                  label="Trailer"
                  name="trailerUrl"
                  onChange={handleInputChange}
                  inputProps={{ maxLength: '64' }}
                />
              </Grid>
              <Grid xs={4} item={true}>
                <Autocomplete
                  multiple
                  value={values.Directors}
                  options={loadingDirectors ? [] : allDirectors}
                  loading={loadingDirectors}
                  getOptionLabel={(option: any) => option.fullName}
                  onChange={(event, value) =>
                    setValues({ ...values, Directors: value.map(id => id) })
                  }
                  isOptionEqualToValue={(option, value) =>
                    option.id === value.id
                  }
                  renderInput={params => (
                    <TextField
                      {...params}
                      variant="standard"
                      label="?????o di???n"
                      margin="normal"
                    />
                  )}
                />
              </Grid>
            </Grid>
            <Grid xs={12} container item={true} spacing={2}>
              <Grid xs={9} item={true}>
                <Autocomplete
                  multiple
                  value={values.Actors}
                  options={loadingActors ? [] : allActors}
                  loading={loadingActors}
                  getOptionLabel={(option: any) => option.fullName}
                  onChange={(event, value) =>
                    setValues({ ...values, Actors: value.map(id => id) })
                  }
                  isOptionEqualToValue={(option, value) =>
                    option.id === value.id
                  }
                  renderInput={params => (
                    <TextField
                      {...params}
                      variant="standard"
                      label="Di???n vi??n"
                      placeholder="Th??m"
                    />
                  )}
                />
              </Grid>
              <Grid xs={3} item={true}>
                <Autocomplete
                  options={loadingNationalities ? [] : allNationalities}
                  loading={loadingNationalities}
                  getOptionLabel={(option: any) => option.name}
                  onChange={(event, value) =>
                    setValues({
                      ...values,
                      NationalityId: value.id,
                      Nationality: value,
                    })
                  }
                  isOptionEqualToValue={(option, value) =>
                    option.id === value.id
                  }
                  value={values?.Nationality}
                  renderInput={params => (
                    <TextField
                      {...params}
                      variant="standard"
                      label="Qu???c gia"
                      placeholder=""
                    />
                  )}
                />
              </Grid>
            </Grid>
            <Grid xs={12} item={true}>
              <TextField
                label="M?? t???"
                variant="standard"
                name="description"
                multiline
                onChange={handleInputChange}
                value={values?.description === null ? '' : values.description}
                fullWidth
                minRows={2}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <Grid item={true} container xs={12} spacing={2}>
          <Grid item={true} xs={6}>
            <Button
              fullWidth
              variant="contained"
              sx={{ mt: 2, p: 1, fontWeight: 'bold', color: 'white' }}
              disableFocusRipple
              className={classes.CancelButton}
              onClick={handleCancelDialog}
            >
              H???y thao t??c
            </Button>
          </Grid>
          <Grid item={true} xs={6}>
            <Button
              fullWidth
              variant="contained"
              sx={{ mt: 2, p: 1, fontWeight: 'bold', color: 'white' }}
              disableFocusRipple
              className={classes.AddFilmButton}
              onClick={handleAddFilm}
            >
              Th??m phim
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Dialog>
  );
}
