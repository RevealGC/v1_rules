const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('ayx_job_mapper', {
    id: {
      autoIncrement: true,
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true
    },
    workflow_id: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    appliance_job_id: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    alteryx_generated_job_id: {
        type: DataTypes.STRING(50),
        allowNull: false
    },
    created_by: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    created_at: {
        type: DataTypes.DATE,
        allowNull: true
    },
    updated_by: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: true
    },
    merged_by: {
        type: DataTypes.STRING(100),
        allowNull: true
    },
    merged_at: {
        type: DataTypes.DATE,
        allowNull: true
    },
  }, {
    sequelize,
    tableName: 'ayx_job_mapper',
    schema: process.env.SCHEMA_NAME,
  });
};
