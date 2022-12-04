import React, { useEffect, useState } from 'react'
import { Container, Dialog } from '@mui/material';
import MoviePanel from 'app/containers/MoviePanel';
import SeatSelector from 'app/containers/SeatSelector';
import BookingStepper from 'app/components/BookingStepper';
import PaymentForm from 'app/components/PaymentForm';
import useStyles from './styles';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from 'store';
import { bookTicketActions, BookingStep } from './slice';
import { notify } from 'app/components/MasterDialog';

export default function BookTicketPage() {

  const store = useSelector<RootState, RootState>(state => state)

  const dispatch = useDispatch()

  const handleReselectSeats = () => {
    dispatch(bookTicketActions.reSelectSeats())
    setTimeout(() => {
      dispatch(bookTicketActions.paymentTimeOut())
      notify({
        type: 'warning',
        content: 'Đã hủy thanh toán',
        autocloseDelay: 3000,
      })
      dispatch(bookTicketActions.paymentTimeOut())
    }, 100);
  }

  useEffect(() => {
    return () => {
      dispatch(bookTicketActions.resetSeat())
      dispatch(bookTicketActions.resetShowtime())
      dispatch(bookTicketActions.resetMovie())
      dispatch(bookTicketActions.paymentTimeOut())
      notify({
        type: 'warning',
        content: 'Đã hủy đặt vé',
        autocloseDelay: 1000,
      })
    }
  }, [])

  useEffect(() => {
    if (!store.login.isLoggedin && store.bookTicket.activeStep > BookingStep.SELECT_SHOWTIME) {
      dispatch(bookTicketActions.resetSeat())
      dispatch(bookTicketActions.resetShowtime())
      dispatch(bookTicketActions.resetMovie())
      dispatch(bookTicketActions.paymentTimeOut())
      notify({
        type: 'error',
        content: 'Lỗi đăng nhập, hãy thử lại',
        autocloseDelay: 1000,
      })
    }
  }, [store.login.isLoggedin])

  const classes = useStyles()

  return (
    <div className={classes.bookTicketPage}>
      <BookingStepper />
      {store.bookTicket.selectedShowtime == undefined ?
        < MoviePanel />
        : <React.Fragment>
          <SeatSelector />
          <Dialog open={store.bookTicket.activeStep == BookingStep.MAKE_PAYMENT}>
            <PaymentForm
              timeStartPayment={store.bookTicket.timeStartPayment}
              reselectSeats={() => handleReselectSeats()} />
          </Dialog>
        </React.Fragment>
      }
    </div >)
}
