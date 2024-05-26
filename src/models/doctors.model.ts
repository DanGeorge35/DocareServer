import { DataTypes } from 'sequelize';
import sequelize from '../config/db';
import { Certificate } from 'crypto';

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
    Address: {
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
    PracticingTenure: {
      type: DataTypes.STRING,
      allowNull: true
    },
    Ratings: {
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
    },
    Certification: {
      type: DataTypes.STRING,
      allowNull: true
    },
    KycNinName:{
        type: DataTypes.STRING,
      allowNull: true
    },
    KycNinNumber:{
        type: DataTypes.STRING,
      allowNull: true
    },
    KycNinAddress:{
            type: DataTypes.STRING,
      allowNull: true
    },
    KycDob: {
      type: DataTypes.STRING,
      allowNull: true
    },
    KycPostalCode:{
      type: DataTypes.STRING,
      allowNull: true
    },
    KycNicFront: {
      type: DataTypes.STRING,
      allowNull: true
    },
    KycNicBack: {
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
