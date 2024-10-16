import { DataTypes } from 'sequelize'
import sequelize from '../config/db'

const Auths = sequelize.define(
  'auths',
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
    Email: {
      type: DataTypes.STRING,
      allowNull: false
    },
    Role: {
      type: DataTypes.STRING,
      allowNull: true
    },
    UserType: {
      type: DataTypes.STRING,
      allowNull: false
    },
    PasswordHash: {
      type: DataTypes.STRING,
      allowNull: false
    },
    RefreshToken: {
      type: DataTypes.STRING,
      allowNull: false
    },
    Token: {
      type: DataTypes.STRING,
      allowNull: false
    },
    Verified: {
      type: DataTypes.STRING,
      allowNull: false
    },
    Status: {
      type: DataTypes.STRING,
      allowNull: false
    }
  },
  {}
)

Auths.sync()
  .then(() => {})
  .catch((err: any) => {
    console.error('Error creating Auths table:', err)
  })

export default Auths
