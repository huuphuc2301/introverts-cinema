import React from 'react';
import {
	Button,
	Dialog as MuiDialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	Divider,
	Typography
} from '@mui/material';
import useStyles from './styles';

interface ConfirmDialogProps {
	open: boolean
	handleClose?: (event: React.MouseEvent) => void
	handleConfirm?: (event: React.MouseEvent) => void
	handleCancel?: (event: React.MouseEvent) => void
	title: string
	content: string
}

export default function ConfirmDialog(props: ConfirmDialogProps) {

	const classes = useStyles();
	return (
		<MuiDialog
			open={props.open} onClose={props.handleClose}
			classes={{ paper: classes.dialog }} >
			<DialogTitle className={classes.title}>
				<Typography fontSize={20} fontWeight={900} margin='auto'>
					{props.title}
				</Typography>
			</DialogTitle>
			<Divider variant='middle' />
			<DialogContent className={classes.content} >
				<Typography variant='body1'>
					{props.content}
				</Typography>
			</DialogContent>
			<DialogActions>
				<Button
					disableFocusRipple
					className={classes.action}
					onClick={props.handleConfirm}>
					Xác nhận
				</Button>
				<Button
					disableFocusRipple
					className={classes.button}
					onClick={props.handleCancel}>
					Hủy
				</Button>
			</DialogActions>
		</MuiDialog >
	);

}