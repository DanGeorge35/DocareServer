import { Sequelize, DataTypes, Model, Optional } from 'sequelize';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

const sequelize = new Sequelize(
  process.env.DB_NAME!,
  process.env.DB_USER!,
  process.env.DB_PASSWORD!,
  {
    host: process.env.DB_HOST,
    dialect: 'mysql',
    logging: false,
  }
);

class User extends Model {
  public id!: number;
  public username!: string;
  public password!: string;

  public async validPassword(password: string): Promise<boolean> {
    return bcrypt.compare(password, this.password);
  }
}

User.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    username: {
      type: new DataTypes.STRING(128),
      allowNull: false,
      unique: true,
    },
    password: {
      type: new DataTypes.STRING(128),
      allowNull: false,
    },
  },
  {
    tableName: 'users',
    sequelize,
    indexes: [{ fields: ['username'] }],
    hooks: {
      beforeCreate: async (user: User) => {
        if (user.password) {
          user.password = await bcrypt.hash(user.password, 10);
        }
      },
    },
  }
);

interface MessageAttributes {
  id?: number;
  content: string;
  fromUserId: number;
  toUserId: number;
}

interface MessageCreationAttributes extends Optional<MessageAttributes, 'id'> {}

class Message extends Model<MessageAttributes, MessageCreationAttributes> implements MessageAttributes {
  public id!: number;
  public content!: string;
  public fromUserId!: number;
  public toUserId!: number;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Message.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    content: {
      type: new DataTypes.STRING(1024),
      allowNull: false,
    },
    fromUserId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
    },
    toUserId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
    },
  },
  {
    tableName: 'messages',
    sequelize,
    indexes: [{ fields: ['fromUserId', 'toUserId', 'createdAt'] }],
  }
);

User.hasMany(Message, { foreignKey: 'fromUserId' });
User.hasMany(Message, { foreignKey: 'toUserId' });
Message.belongsTo(User, { foreignKey: 'fromUserId', as: 'fromUser' });
Message.belongsTo(User, { foreignKey: 'toUserId', as: 'toUser' });

export { sequelize, User, Message };
