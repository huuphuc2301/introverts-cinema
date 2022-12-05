import { Request } from 'express';
import { Director, Nationality } from 'databases/models';
import ResponeCodes from 'utils/constants/ResponeCode';
import DirectorPayload from './DirectorPayload';
import paginate from 'utils/helpers/pagination';
import { Op } from 'sequelize';

const getDirectors = async (req: Request) => {
	try {
		const { limit, offset, order, query } = paginate(req);

		const directors = await Director.findAndCountAll({
			where: {
				fullName: {
					[Op.like]: `%${query}%`
				}
			},
			limit,
			offset,
			order: [order]
		});

		return directors;
	} catch (error) {
		throw error;
	}
};

const getDirectorById = async (req: Request) => {
	try {
		let data;
		let message: string;
		let status: number;

		const id = parseInt(req.params.id);

		if (isNaN(id)) {
			data = null;
			message = 'Invalid identifier.';
			status = ResponeCodes.BAD_REQUEST;
		} else {
			const director = await Director.findByPk(id, {
				include: Nationality
			});
			if (!director) {
				data = null;
				message = 'Not found.';
				status = ResponeCodes.NOT_FOUND;
			} else {
				data = director;
				message = 'Get successfully!';
				status = ResponeCodes.OK;
			}
		}

		return {
			data,
			message,
			status
		};
	} catch (error) {
		throw error;
	}
};

const addDirector = async (req: Request) => {
	try {
		let data;
		let message: string;
		let status: number;

		const newDirector: DirectorPayload = req.body;
		const { nationality } = newDirector;

		if (!newDirector.fullName) {
			data = null;
			message = 'Name null.';
			status = ResponeCodes.BAD_REQUEST;
		} else {
			const director = await Director.create(newDirector);
			if (nationality) await director.setNationality(nationality);

			data = director;
			message = 'Add successfully!';
			status = ResponeCodes.CREATED;
		}

		return {
			data,
			message,
			status
		};
	} catch (error) {
		throw error;
	}
};

const updateDirector = async (req: Request) => {
	try {
		let data;
		let message: string;
		let status: number;

		const id = parseInt(req.params.id);

		if (isNaN(id)) {
			data = null;
			message = 'Invalid identifier.';
			status = ResponeCodes.BAD_REQUEST;
		} else {
			const updateDirector: DirectorPayload = req.body;
			const { nationality } = updateDirector;

			const director = await Director.findByPk(id);
			data = await director.update(updateDirector);
			if (Nationality) await director.setNationality(nationality);

			message = 'Updated successfully!';
			status = ResponeCodes.OK;
		}

		return {
			data,
			message,
			status
		};
	} catch (error) {
		throw error;
	}
};

const deleteDirector = async (req: Request) => {
	try {
		let data;
		let message: string;
		let status: number;

		const id = parseInt(req.params.id);

		if (isNaN(id)) {
			data = null;
			message = 'Invalid identifier.';
			status = ResponeCodes.BAD_REQUEST;
		} else {
			data = await Director.destroy({
				where: {
					id
				}
			});
			message = 'Deleted successfully!';
			status = ResponeCodes.OK;
		}

		return {
			data,
			message,
			status
		};
	} catch (error) {
		throw error;
	}
};

export { getDirectors, getDirectorById, addDirector, updateDirector, deleteDirector };
