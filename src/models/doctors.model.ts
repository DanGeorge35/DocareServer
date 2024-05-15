import { DataTypes } from 'sequelize';
import sequelize from '../config/db';

const Doctors = sequelize.define(
  'doctors',
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
    },
    Specialization: {
      type: DataTypes.STRING,
      allowNull: true
    },
    Experience: {
      type: DataTypes.STRING,
      allowNull: true
    },
    ProfilePicture: {
      type: DataTypes.STRING,
      allowNull: true
    },
    CV: {
      type: DataTypes.STRING,
      allowNull: true
    },
    NicFront: {
      type: DataTypes.STRING,
      allowNull: true
    },
    NicBack: {
      type: DataTypes.STRING,
      allowNull: true
    },
    Status: {
      type: DataTypes.STRING,
      allowNull: true
    },
    PracticingTenure: {
      type: DataTypes.STRING,
      allowNull: true
    },
    ratings: {
      type: DataTypes.STRING,
      allowNull: true
    },
    BankName: {
      type: DataTypes.STRING,
      allowNull: true
    },
    AccountNumber: {
      type: DataTypes.STRING,
      allowNull: true
    },
    AccountName: {
      type: DataTypes.STRING,
      allowNull: true
    }
  },
  {}
);

Doctors.sync({ alter: true })
  .then(() => {})
  .catch((err: any) => {
    console.error('Error creating Doctors table:', err);
  });

export default Doctors;
