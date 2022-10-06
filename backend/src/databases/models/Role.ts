import { DataTypes } from 'sequelize';
import sequelize from 'databases';

const Role = sequelize.define(
	'Role',
	{
		id: {
			allowNull: false,
			autoIncrement: true,
			primaryKey: true,
			type: DataTypes.INTEGER
		},
		name: {
			allowNull: false,
			unique: true,
			type: DataTypes.STRING
		}
	},
	{
		tableName: 'role',
		timestamps: false,
		underscored: true
	}
);

export default Role;
