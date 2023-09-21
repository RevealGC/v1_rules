const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('ayx_staging', {
    alpha: {
      type: DataTypes.STRING(10),
      allowNull: true
    },
    ent_id: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    login_id: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    reporting_id: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    refper: {
      type: DataTypes.STRING(10),
      allowNull: true
    },
    sector: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    naics: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    type_o_tax: {
      type: DataTypes.STRING(10),
      allowNull: true
    },
    item: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    eddata: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    dataflag: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    eflg2: {
      type: DataTypes.STRING(10),
      allowNull: true
    },
    level_type: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    level1: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    empunit_typ: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    name1: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    name2: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    street: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    city: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    state: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    zip: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    storenum: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    naics_title: {
      type: DataTypes.STRING(100),
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'ayx_staging',
    schema: process.env.SCHEMA_NAME,
    timestamps: false
  });
};
