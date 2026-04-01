/**
 * SEQUELIZE CONFIGURATION EXAMPLE
 *
 * If you want to use Sequelize ORM with your project:
 *
 * 1. Install: npm install sequelize
 * 2. Copy this to config/sequelize.ts
 * 3. Update database credentials from .env
 * 4. Initialize models in models/ directory
 */

import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

const sequelize = new Sequelize({
  dialect: 'mysql',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '3306'),
  username: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'pamphlet_db',
  logging: process.env.DB_DEBUG === 'true' ? console.log : false,
  pool: {
    max: parseInt(process.env.DB_POOL_SIZE || '10'),
    min: 0,
    acquire: parseInt(process.env.DB_CONNECTION_TIMEOUT || '10000'),
  },
  timezone: '+00:00', // UTC
});

export default sequelize;

/**
 * EXAMPLE SEQUELIZE MODELS
 *
 * Create these in models/ directory if using Sequelize
 */

/*
// models/User.ts
import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/sequelize';

class User extends Model {
  public id!: number;
  public name!: string;
  public email!: string;
  public password!: string;
  public created_at?: Date;
  public updated_at?: Date;
}

User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    updated_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    tableName: 'users',
    timestamps: false,
  }
);

export default User;
*/

/*
// models/Pamphlet.ts
import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/sequelize';
import User from './User';

class Pamphlet extends Model {
  public id!: number;
  public title!: string;
  public description!: string;
  public content?: string;
  public image_url?: string;
  public category!: string;
  public location!: string;
  public user_id!: number;
  public created_at?: Date;
  public updated_at?: Date;
}

Pamphlet.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    title: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    image_url: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },
    category: {
      type: DataTypes.STRING(50),
      allowNull: false,
      defaultValue: 'OTHER',
    },
    location: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id',
      },
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    updated_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    tableName: 'pamphlets',
    timestamps: false,
  }
);

// Define associations
Pamphlet.belongsTo(User, { foreignKey: 'user_id', as: 'author' });
User.hasMany(Pamphlet, { foreignKey: 'user_id' });

export default Pamphlet;
*/

/*
// models/index.ts
import User from './User';
import Pamphlet from './Pamphlet';
import PamphletImage from './PamphletImage';
import PamphletContact from './PamphletContact';
import PamphletLocation from './PamphletLocation';

export { User, Pamphlet, PamphletImage, PamphletContact, PamphletLocation };
*/
