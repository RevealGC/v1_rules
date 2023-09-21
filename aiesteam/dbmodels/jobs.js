const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('jobs', {
    id: {
      type: DataTypes.DECIMAL,
      allowNull: false,
      primaryKey: true
    },
    queue: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    payload: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    attempts: {
      type: DataTypes.SMALLINT,
      allowNull: false
    },
    reserved_at: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    available_at: {
      type: DataTypes.BIGINT,
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'jobs',
    schema: process.env.SCHEMA_NAME,
    timestamps: true
  });
};
