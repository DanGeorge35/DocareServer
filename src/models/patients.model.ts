import { DataTypes } from 'sequelize';
import sequelize from '../config/db';

const Patients = sequelize.define(
  'Patients',
  {
    id: {
      primaryKey: true,
      autoIncrement: true,
      type: DataTypes.INTEGER
    },
    UserID: {
      type: DataTypes.STRING,
      allowNull: false
    },
    FirstName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    LastName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    Phone: {
      type: DataTypes.STRING,
      allowNull: true
    },
    Email: {
      type: DataTypes.STRING,
      allowNull: false
    },
    Gender: {
      type: DataTypes.STRING,
      allowNull: true
    },
    Nationality: {
      type: DataTypes.STRING,
      allowNull: true
    },
    State: {
      type: DataTypes.STRING,
      allowNull: true
    },
    City: {
      type: DataTypes.STRING,
      allowNull: true
    },
    Coordinate: {
      type: DataTypes.STRING,
      allowNull: true
    }
  },
  {}
);

Patients.sync({ alter: true })
  .then(() => {})
  .catch((err: any) => {
    console.error('Error creating Patients table:', err);
  });

export default Patients;
