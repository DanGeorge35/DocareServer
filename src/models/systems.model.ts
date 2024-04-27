import { DataTypes } from 'sequelize'
import sequelize from '../config/db'

const Systems = sequelize.define(
  'systems',
  {
    id: {
      primaryKey: true,
      autoIncrement: true,
      type: DataTypes.INTEGER
    },
    data: {
      type: DataTypes.STRING,
      allowNull: false
    },
    type: {
      type: DataTypes.STRING,
      allowNull: true
    }
  },
  {

  }
)

Systems.sync().then(() => {}).catch((err: any) => {
  console.error('Error creating Systems table:', err)
})

export default Systems
