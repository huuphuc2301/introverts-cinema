import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { sendRegisterCode } from 'queries/sendCode';
import { validateEmail } from 'queries/validateEmail';
import { register } from 'queries/register';
import { notify } from 'app/components/MasterDialog';

export interface RegisterState {
  isLoading: boolean;
  OTP: number | undefined;
  isEmailValid: boolean | 'unfilled_email' | undefined;
  isOTPSent: boolean;
  registerSuccessAccount: { email: string; password: string } | undefined;
}

const initialState: RegisterState = {
  isLoading: false,
  OTP: undefined,
  isEmailValid: undefined,
  isOTPSent: false,
  registerSuccessAccount: undefined,
};

export const registerSlice = createSlice({
  name: 'register',
  initialState: initialState,
  reducers: {
    reset: state => {
      state.isEmailValid = undefined;
      state.isOTPSent = false;
      state.OTP = undefined;
      state.registerSuccessAccount = undefined;
    },
    changeEmail: state => {
      state.isEmailValid = undefined;
    },
    storeOTP: (state, action) => {
      state.OTP = action.payload;
    },
  },

  extraReducers: builder => {
    builder.addCase(validateEmailThunk.pending, state => {
      state.isLoading = true;
      console.log('VALIDATING');
    });
    builder.addCase(validateEmailThunk.fulfilled, (state, action) => {
      state.isLoading = false;
      if (action.payload == true) {
        state.isEmailValid = true;
        console.log('VALIDATE SUCCESS');
      } else {
        if (action.payload == 'unfilled_email') {
          state.isEmailValid = action.payload;
          console.log('VALIDATE FAILED');
        } else {
          state.isEmailValid = false;
          console.log('VALIDATE FAILED');
        }
      }
    });
    builder.addCase(validateEmailThunk.rejected, state => {
      state.isLoading = false;
      console.log('VALIDATE ERROR');
    });

    builder.addCase(sendRegisterCodeThunk.pending, state => {
      state.isLoading = true;
      console.log('SENDING OTP');
    });
    builder.addCase(sendRegisterCodeThunk.fulfilled, (state, action) => {
      state.isLoading = false;
      if (action.payload == '201') {
        state.isOTPSent = true;
        console.log('SEND OTP SUCCESS');
      } else {
        if (action.payload == '200') {
          state.isOTPSent = false;
          console.log('SEND OTP FAILED');
          notify({
            type: 'error',
            content: 'G???i m?? x??c nh???n th???t b???i',
            autocloseDelay: 1250,
          });
        }
      }
    });
    builder.addCase(sendRegisterCodeThunk.rejected, state => {
      state.isLoading = false;
      state.isOTPSent = false;
      console.log('SEND OTP ERROR');
      notify({
        type: 'error',
        content: 'G???i m?? x??c nh???n g???p l???i',
        autocloseDelay: 1250,
      });
    });

    builder.addCase(registerThunk.pending, state => {
      state.isLoading = true;
      console.log('REGISTERING');
    });
    builder.addCase(registerThunk.fulfilled, (state, action) => {
      state.isLoading = false;
      if (action.payload.status == '201') {
        state.registerSuccessAccount = {
          email: action.payload.email,
          password: action.payload.password,
        };
        notify({
          type: 'success',
          content: '????ng k?? th??nh c??ng',
          autocloseDelay: 1250,
        });
        console.log('REGISTER SUCCESS');
      } else {
        if (action.payload.status == '200') {
          console.log('REGISTER FAILED - CODE EXPIRED/INCORRECT');
          notify({
            type: 'error',
            content: 'Ki???m tra l???i m?? OTP v?? th??? l???i',
          });
        } else {
          console.log('REGISTER FAILED');
          notify({
            type: 'error',
            content: '????ng k?? kh??ng th??nh c??ng',
            autocloseDelay: 1250,
          });
        }
      }
    });
    builder.addCase(registerThunk.rejected, state => {
      state.isLoading = false;
      console.log('REGISTER ERROR');
      notify({
        type: 'error',
        content: '????ng k?? g???p l???i',
        autocloseDelay: 1250,
      });
    });
  },
});

export const validateEmailThunk = createAsyncThunk(
  'register/validate-email',
  async (data: { email: string }) => {
    const receivedData = await validateEmail(data.email);
    return receivedData;
  },
);

export const sendRegisterCodeThunk = createAsyncThunk(
  'register/send-code',
  async (data: { email: string }) => {
    const receivedData = await sendRegisterCode(data.email);
    return receivedData;
  },
);

export const registerThunk = createAsyncThunk(
  'register/register',
  async (data: {
    email: string;
    password: string;
    otp: number;
    fullName: string;
    phone: string;
    birthDay: string;
  }) => {
    const receivedData = await register(
      data.email,
      data.password,
      data.otp,
      data.fullName,
      data.phone,
      data.birthDay,
    );
    return { status: receivedData, email: data.email, password: data.password };
  },
);

export const registerActions = registerSlice.actions;

export default registerSlice.reducer;
