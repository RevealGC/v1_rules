const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('survey_details_flags_archive', {
    id: {
      autoIncrement: true,
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true
    },
    reporting_id: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    refper: {
      type: DataTypes.STRING(10),
      allowNull: true
    },
    rvid: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    data_version: {
      type: DataTypes.STRING(5),
      allowNull: true
    },
    data_version_value: {
      type: DataTypes.STRING(500),
      allowNull: true
    },
    data_flag: {
      type: DataTypes.CHAR(1),
      allowNull: true
    },
    source_flag: {
      type: DataTypes.CHAR(1),
      allowNull: true
    },
    created_by: {
      type: DataTypes.STRING(30),
      allowNull: true
    },
    created_date: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: Sequelize.Sequelize.literal('CURRENT_TIMESTAMP')
    },
    last_modified_by: {
      type: DataTypes.STRING(30),
      allowNull: true,
      defaultValue: "NULL"
    },
    last_modified_date: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: Sequelize.Sequelize.literal('CURRENT_TIMESTAMP')
    },
    note: {
      type: DataTypes.STRING(4000),
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'survey_details_flags_archive',
    schema: process.env.SCHEMA_NAME,
    timestamps: false
  });
};
