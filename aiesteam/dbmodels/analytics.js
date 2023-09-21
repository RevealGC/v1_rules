const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('analytics', {
    naics_code: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true
    },
    naics_title: {
      type: DataTypes.STRING(250),
      allowNull: false
    },
    companies: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    kaus: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    establishments: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    categories: {
      type: DataTypes.STRING(4000),
      allowNull: true
    },
    frame_rate_pct: {
      type: DataTypes.DECIMAL,
      allowNull: true
    },
    response_rate_pct: {
      type: DataTypes.DECIMAL,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'analytics',
    schema: process.env.SCHEMA_NAME,
    timestamps: false
  });
};
