import { Request } from 'express';
import { Bill, Film, Room, Seat, Ticket } from 'databases/models';
import { SeatModel } from 'databases/models/Seat';
import BillPayload from './BillPayload';
import sequelize from 'databases';
import User, { UserModel } from 'databases/models/User';
import Showtime, { ShowtimeModel } from 'databases/models/Showtime';
import SeatStatus from 'utils/constants/SeatStatus';
import Price, { PriceModel } from 'databases/models/Price';
import { timeDiffToMinute } from 'utils/helpers/timeService';
import ResponeCodes from 'utils/constants/ResponeCode';
import { getPrice } from 'api/price/service';
import PaymentStatus from 'utils/constants/PaymentStatus';
import { BillModel } from 'databases/models/Bill';
import config from 'config';
import { DESCRIPTION_PREFIX, getAllTransactionThisWeek, verifyBillTransaction } from 'api/transaction/service';
import { Transaction } from 'sequelize';
import { userInfo } from 'os';

const MAX_SEAT = 10;
const MAX_PAY_TIME = 15; //minutes

const createBill = async (req: Request) => {
	const payload: BillPayload = req.body;
	const t = await sequelize.transaction();
	const user: UserModel = req.user;
	try {
		const showtime: ShowtimeModel = await Showtime.findByPk(payload.showtimeId, {
			include: {
				model: Room
			}
		});

		if (!showtime) {
			return {
				message: 'Showtime invalid',
				status: ResponeCodes.BAD_REQUEST
			};
		}
		var totalPrice = 0;
		if (payload.seats.length > MAX_SEAT) {
			return {
				message: 'Number of seats invalid',
				status: ResponeCodes.BAD_REQUEST
			};
		}

		let seatList = [];
		for (let pos of payload.seats) {
			let seat = await Seat.findOne({
				where: {
					code: pos.code
				},
				include: [
					{
						model: Showtime,
						attributes: [],
						where: {
							id: showtime.id
						}
					}
				]
			});

			if (!seat) {
				seat = await Seat.create({
					row: pos.row,
					column: pos.column,
					code: pos.code,
					owner: user.email,
					status: SeatStatus.BOOKING
				});

				await seat.setShowtime(showtime);
			} else {
				if (verifySeat(seat, user)) {
					await seat.update({
						owner: user.email,
						status: SeatStatus.BOOKING
					});
				} else {
					t.rollback();
					return {
						message: 'Seats invalid!',
						status: ResponeCodes.BAD_REQUEST
					};
				}
			}

			seatList.push(seat);
			const price = await getPrice(showtime);
			totalPrice += price;
		}

		const bill = await Bill.create({
			totalPrice,
			paymentStatus: PaymentStatus.UNPAID
		});
		await bill.setShowtime(showtime);

		await bill.setUser(user);
		for (let seat of seatList) {
			await bill.addSeat(seat);
		}
		await t.commit();

		return {
			data: {
				bill,
				qrCode: createQrCode(bill)
			},
			message: 'Succesfully',
			status: ResponeCodes.OK
		};
	} catch (error) {
		t.rollback();
		throw error;
	}
};

const cancelBill = async (req: Request) => {
	const t = await sequelize.transaction();
	try {
		const billId: number = req.body.bill;
		const bill: BillModel = await Bill.findByPk(billId, {
			include: [
				{
					model: Seat
				},
				{
					model: User
				}
			]
		});

		if (!bill) {
			return {
				message: 'Bill invalid',
				status: ResponeCodes.BAD_REQUEST
			};
		}
		if (bill.User.id !== req.user.id) {
			return {
				message: 'Error Authorization',
				status: ResponeCodes.BAD_REQUEST
			};
		}

		for (let seat of bill.Seats) {
			await seat.update(
				{
					status: SeatStatus.UN_BOOKED
				},
				{ transaction: t }
			);
		}

		t.commit();
		return {
			data: 0,
			message: 'Succesfully',
			status: ResponeCodes.OK
		};
	} catch (error) {
		t.rollback();
		throw error;
	}
};

const verifyBillPayment = async (req: Request) => {
	const t = await sequelize.transaction();
	try {
		const billId: number = req.body.bill;
		const user: UserModel = req.user;
		const bill: BillModel = await Bill.findByPk(billId, {
			include: [
				{
					model: Seat
				},
				{
					model: User
				},
				{
					model: Showtime,
					include: [
						{
							model: Room
						}
					]
				}
			]
		});
		if (!bill) {
			return {
				message: 'Bill invalid!',
				status: ResponeCodes.BAD_REQUEST
			};
		}

		if (bill.User.id !== req.user.id) {
			return {
				message: 'Error Authorization',
				status: ResponeCodes.BAD_REQUEST
			};
		}

		if (bill.paymentStatus === PaymentStatus.PAID) {
			return {
				message: 'Payment had been paid',
				status: ResponeCodes.BAD_REQUEST
			};
		}

		const startTime = new Date(Date.now());
		let isPaid = false;
		while (timeDiffToMinute(new Date(Date.now()), startTime) <= 0.5) {
			isPaid = await verifyBillTransaction(bill);
			if (isPaid) {
				console.log(isPaid);

				await bill.update({
					paymentStatus: PaymentStatus.PAID
				});

				await createTicketForBill(bill, t);
				break;
			}
		}
		t.commit();
		if (isPaid) {
			return {
				data: 0,
				message: 'Successfully',
				status: ResponeCodes.OK
			};
		} else {
			return {
				message: `Not found payment`,
				status: ResponeCodes.BAD_REQUEST
			};
		}
	} catch (error) {
		t.rollback();
		throw error;
	}
};

const verifySeat = (seat: SeatModel, user: UserModel) => {
	if (!seat) return false;
	if (seat.status === SeatStatus.BOOKED) return false;
	if (
		seat.status === SeatStatus.BOOKING &&
		seat.owner != null &&
		seat.owner != user.email &&
		timeDiffToMinute(new Date(Date.now()), seat.updatedAt) < MAX_PAY_TIME
	)
		return false;
	return true;
};

const createQrCode = (bill: BillModel) => {
	return `${config.qr_code_base_url}?amount=${bill.totalPrice}&addInfo=${DESCRIPTION_PREFIX.replace(/ /g, '%20')}${
		bill.id
	}`;
};

const createTicketForBill = async (bill: BillModel, t: Transaction) => {
	for (let seat of bill.Seats) {
		if (!verifySeat(seat, bill.User)) throw new Error('Payment Bill invalid!');
		await seat.update(
			{
				status: SeatStatus.BOOKED
			},
			{ transaction: t }
		);

		const price = await getPrice(bill.Showtime);
		const ticket = await Ticket.create(
			{
				seatRow: seat.row,
				seatColumn: seat.column,
				seatCode: seat.code,
				time: bill.Showtime.startTime,
				price,
				room: bill.Showtime.Room.name
			},
			{ transaction: t }
		);
		await ticket.setUser(bill.User, { transaction: t });
	}
};

export { createBill, cancelBill, verifyBillPayment };
