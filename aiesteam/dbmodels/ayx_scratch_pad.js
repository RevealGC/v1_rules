const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('ayx_scratch_pad', {
    id: {
      autoIncrement: true,
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true
    },
    ayx_jobs_id: {
      type: DataTypes.BIGINT,
      allowNull: false
    },
    rvid: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    rv_value: {
      type: DataTypes.STRING(500),
      allowNull: true
    },
    rv_scratch_value: {
      type: DataTypes.STRING(500),
      allowNull: true
    },
    survey_details_id: {
      type: DataTypes.BIGINT,
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
    rvname: {
      type: DataTypes.STRING(500),
      allowNull: true
    },
    reporting_id: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    refper: {
      type: DataTypes.STRING(10),
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'ayx_scratch_pad',
    schema: process.env.SCHEMA_NAME,

    paranoid: true,
    indexes: [
      {
        name: "ayx_scractch_pad_pkey",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
};
