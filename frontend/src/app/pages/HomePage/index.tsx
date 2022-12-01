import React, { useCallback, useEffect, useState } from 'react';
import useStyles from './styles';
import { Helmet } from 'react-helmet-async';
import { useGetMessage } from 'queries/message';
import Banner from 'app/components/Banner';
import NewMovieList from 'app/components/NewMovieList';
import UpcomingMovieList from 'app/components/UpcomingMovieList';
import MasterDialog from 'app/components/MasterDialog';
import { notify } from 'app/components/MasterDialog';
import ConfirmDialog from 'app/components/MasterDialog/ConfirmDialog';
import Footer from 'app/containers/Footer/index';
import { useDispatch } from 'react-redux';

export function HomePage() {

  const classes = useStyles();

  const [open, setOpen] = useState(false);

  const dispatch = useDispatch();

  const handleOpen = () => {
    setOpen(true);
  }

  const handleClose = () => {
    setOpen(false);   
  }

  return (
    <div className={classes.homePage} >
      <Banner />
      <NewMovieList />
      <UpcomingMovieList />
      {/*<button onClick={handleOpen}>
        Bật
      </button>
      <ConfirmDialog
        open={open}
        handleClose={handleClose}
        title="Xác nhận"
        content="Xác nhận đặt vé xem phim" />*/}
    </div>
  );
}
