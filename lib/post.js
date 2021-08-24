'use strict';

require('pg').defaults.ssl = true;
const Sequelize = require('sequelize');
const dialectOptions = {
  ssl: {
    require: true,
    rejectUnauthorized: false
  }
};

const sequelize = process.env.DATABASE_URL ? //三項演算子で環境を分ける
// 本番環境
new Sequelize(
  process.env.DATABASE_URL,
  {
    logging: false,
    dialectOptions
  }
)
:
// 開発環境
new Sequelize(
  'postgres://postgres:postgres@localhost/secret_board_2021',
  {
    logging: false
  }
);

const Post = sequelize.define(
  'Post',
  {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    content: {
      type: Sequelize.TEXT
    },
    postedBy: {
      type: Sequelize.STRING
    },
    trackingCookie: {
      type: Sequelize.STRING
    }
  },
  {
    freezeTableName: true,
    timestamps: true
  }
);

Post.sync();
module.exports = Post;
