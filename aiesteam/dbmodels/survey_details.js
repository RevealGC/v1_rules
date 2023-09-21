const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('survey_details', {
    id: {
      autoIncrement: true,
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true
    },
    reporting_id: {
      type: DataTypes.BIGINT,
      allowNull: true,
      unique: "survey_details_unique"
    },
    refper: {
      type: DataTypes.STRING(10),
      allowNull: true,
      unique: "survey_details_unique"
    },
    rvid: {
      type: DataTypes.BIGINT,
      allowNull: true,
      references: {
        model: 'response_variables',
        key: 'rvid'
      },
      unique: "survey_details_unique"
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
    }
  }, {
    sequelize,
    tableName: 'survey_details',
    schema: process.env.SCHEMA_NAME,
    timestamps: false
  });
};
