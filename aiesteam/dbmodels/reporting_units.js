
var config = require('../config')
const Sequelize = require('sequelize');

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('reporting_units', {
    id: {
      autoIncrement: true,
      autoIncrementIdentity: true,
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true
    },
    ru_metadata_id: {
      type: DataTypes.BIGINT,
      allowNull: true,
      references: {
        model: 'ru_metadata',
        key: 'id'
      }
    },
    navDataLink: {
      type: DataTypes.VIRTUAL,

    get() {
      return { ent_id: this.ent_id,
        naics: this.naics, 
        levelType: this.level_type,
        url:config.hostUrl+'companies?name=&multi=true&entId='+this.ent_id+'&levelType='+this.level_type+'&naics='+this.naics
      }}},
    refper: {
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
      allowNull: false
    },
    kau_id: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    alpha: {
      type: DataTypes.STRING(6),
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
    unit_type: {
      type: DataTypes.STRING(6),
      allowNull: true
    },
    level_type: {
      type: DataTypes.STRING(4),
      allowNull: true
    },
    estab_type: {
      type: DataTypes.STRING(3),
      allowNull: true
    },
    item_level: {
      type: DataTypes.STRING(20),
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
    category: {
      type: DataTypes.STRING(10),
      allowNull: true
    },
    naics_csv: {
      type: DataTypes.STRING(4000),
      allowNull: true
    },
    parent_id: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    parent_type: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    parent_name1: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    created_by: {
      type: DataTypes.STRING(20),
      allowNull: true,
      defaultValue: "DATALOAD"
    },
    created_date: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: Sequelize.Sequelize.literal('CURRENT_TIMESTAMP')
    },
    last_modified_by: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    last_modified_date: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: Sequelize.Sequelize.literal('CURRENT_TIMESTAMP')
    }
  }, {
    sequelize,
    tableName: 'reporting_units',
    schema: process.env.SCHEMA_NAME,
    timestamps: false,
    indexes: [
      {
        name: "reporting_units_ent_id",
        fields: [
          { name: "ent_id" },
        ]
      },
      {
        name: "reporting_units_ent_idx",
        fields: [
          { name: "ent_id" },
          { name: "level_type" },
        ]
      },
      {
        name: "reporting_units_idx",
        fields: [
          { name: "reporting_id" },
          { name: "alpha" },
          { name: "naics" },
        ]
      },
      {
        name: "reporting_units_idx1",
        fields: [
          { name: "level_type" },
        ]
      },
      {
        name: "reporting_units_pk",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
      {
        name: "reporting_units_reportidx",
        fields: [
          { name: "reporting_id" },
        ]
      },
      {
        name: "ru_category_idx1",
        fields: [
          { name: "category" },
        ]
      },
    ]
  });
};
