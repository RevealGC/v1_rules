const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('ayx_jobs', {
    id: {
      autoIncrement: true,
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true
    },
    process_rules_id: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    sql_clob: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    status: {
      type: DataTypes.ENUM("submitted","running","failed","success","heldup","waitingapproval","deleted"),
      allowNull: false
    },
    created_by: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    modified_by: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    deleted_by: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    modified_at: {
      type: DataTypes.DATE,
      allowNull: true
    },
    ayx_submitted_job: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    args: {
      type: DataTypes.STRING(2500),
      allowNull: true
    },
    output: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    sql_from_frontend: {
      type: DataTypes.STRING(2500),
      allowNull: true
    },
    ayx_workflow_id: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    filters: {
      type: DataTypes.STRING(2500),
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'ayx_jobs',
    schema: process.env.SCHEMA_NAME,
  
    paranoid: true,
    indexes: [
      {
        name: "ayx_jobs_pkey",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
};
