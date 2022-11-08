import React from 'react'
import {
	Box,
	Button,
	Checkbox,
	Dialog,
	FormControlLabel,
	Grid,
	IconButton,
	InputAdornment,
	Link as LinkMUI,
	Typography
} from '@mui/material';
import {
	Lock,
	Person,
	Visibility,
	VisibilityOff
} from '@mui/icons-material';
import { CustomInput } from '../CustomInput';
import useStyles from './styles';
import { useForm } from 'hooks/useForm';


export default function LoginDialog() {

	const validate = (fieldValues = values) => {
		const tmp = { ...errors };

		if ("username" in fieldValues) {
			tmp.username = fieldValues.username.length > 0 ? "" : "Vui lòng điền tài khoản của bạn";
		}

		if ("password" in fieldValues) {
			tmp.password = fieldValues.password.length > 0 ? "" : "Vui lòng điền mật khẩu của bạn";
		}

		setErrors({ ...tmp });
		if (fieldValues == values) {
			return Object.values(tmp).every((x) => x == "");
		}
	};

	const { values, errors, setErrors, handleInputChange, resetForm } =
		useForm(
			{
				username: "",
				password: "",
			},
			true,
			validate
		);

	const [showPassword, setShowPassword] = React.useState<boolean>(false);
	const [showError, setShowError] = React.useState<boolean>(false);

	const handleClickShowPassword = () => {
		setShowPassword(!showPassword);
	};

	const classes = useStyles();

	return (
		<Dialog open={false}>
			<Box
				className={classes.loginBox}
				component="form"
				onKeyDown={(event: React.KeyboardEvent) => {
					if (event.code === "Enter") {
						//handleClickSubmit();
					}
				}}
			>
				<Typography
					sx={{
						textAlign: "center",
						mb: 2,
					}}
					variant="h5"
					fontWeight={900}
				>
					Chào mừng đến Introvert Cinema
				</Typography>
				<div>
					<CustomInput.TextField
						required
						label="Tài khoản"
						name="username"
						//value={values.username}
						//error={errors.username}
						//onChange={handleInputChange}
						autoFocus
						autoComplete="username"
						inputProps={{ maxLength: "64" }}
						InputProps={{
							startAdornment: (
								<InputAdornment position="start"><Person /></InputAdornment>
							),
						}}
					/>
				</div>
				<div>
					<CustomInput.TextField
						required
						type={showPassword ? "text" : "password"}
						label="Mật khẩu"
						name="password"
						//value={values.password}
						//error={errors.password}
						//onChange={handleInputChange}
						inputProps={{ maxLength: "64" }}
						InputProps={{
							startAdornment: (
								<InputAdornment position="start"><Lock /></InputAdornment>
							),
							endAdornment: (
								<InputAdornment position="end">
									<IconButton
										aria-label="toggle password visibility"
										onClick={handleClickShowPassword}
									>
										{showPassword ? <Visibility /> : <VisibilityOff />}
									</IconButton>
								</InputAdornment>
							),
						}}
					/>
				</div>
				<Grid container>
					<Grid item xs>
						<FormControlLabel
							control={<Checkbox />}
							label="Duy trì đăng nhập"
						/>
					</Grid>
					<Grid item marginY="auto">
						<LinkMUI variant="body1">Quên mật khẩu ?</LinkMUI>
					</Grid>
				</Grid>
				<Button
					fullWidth
					variant="contained"
					sx={{ my: 1, p: 1, fontWeight: "bold" }}
					className={classes.button}
				//onClick={handleClickSubmit}
				>Đăng nhập</Button>
				<Typography
					sx={{
						textAlign: "center",
					}}
					variant="body1"
				>
					Bạn chưa có tài khoản ?
				</Typography>
				<Button
					fullWidth
					variant="outlined"
					sx={{ my: 1, fontWeight: "bold", borderWidth: "2px" }}
					className={classes.button}
				//component={Link} to="/registration"
				>
					Tạo tài khoản mới
				</Button>
			</Box>
		</Dialog>
	)
}
