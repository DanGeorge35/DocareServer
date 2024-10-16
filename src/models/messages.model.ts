import sequelize from '../config/db';

import {  DataTypes, Model, Optional } from 'sequelize';


interface MessageAttributes {
  id?: number;
  content: string;
  fromUserID: number;
  toUserID: number;
}

interface MessageCreationAttributes extends Optional<MessageAttributes, 'id'> {}

class Message extends Model<MessageAttributes, MessageCreationAttributes> implements MessageAttributes {
  public id!: number;
  public content!: string;
  public fromUserID!: number;
  public toUserID!: number;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Message.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    content: {
      type: new DataTypes.STRING,
      allowNull: false,
    },
    fromUserID: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    toUserID: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    tableName: 'messages',
    sequelize,
  }
);


Message.sync({alter:true})
	.then(() => {})
	.catch((err: Error) => {
		console.error("Error creating Event table:", err)
	})


export { Message, MessageCreationAttributes, MessageAttributes }
