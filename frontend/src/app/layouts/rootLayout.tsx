import React, { useEffect } from 'react';
import { BrowserRouter, Route, Switch, Redirect, Router } from 'react-router-dom';
import FilmManagementPage from 'app/pages/FilmManagementPage';
import AdminPage from 'app/pages/AdminPage';
import LoadingLayer from 'app/components/LoadingLayer';
import HomeLayout from './homeLayout';
import AdminLayout from './adminLayout';

const RootLayout = () => {

  useEffect(() => {
    document.body.style.margin = '0';
    document.body.style.color = '#1D1C1A';
  }, [])

  return (
    <BrowserRouter>
      <Switch>
        <Redirect from='/admin' exact to='admin/customers' />
        <Route path="/" exact component={HomeLayout} />
        <Route path="/admin" component={AdminLayout}>
        </Route>
      </Switch>
      <LoadingLayer />
    </BrowserRouter>
  );
};

export default RootLayout;
