const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('flagging_mappings', {
    id: {
      autoIncrement: true,
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true
    },
    flagging_data_version_id: {
      type: DataTypes.DECIMAL,
      allowNull: false
    },
    flagging_data_flag_id: {
      type: DataTypes.DECIMAL,
      allowNull: false
    },
    flagging_source_flag_id: {
      type: DataTypes.DECIMAL,
      allowNull: false
    },
    created_by: {
      type: DataTypes.STRING(10),
      allowNull: true
    },
    updated_by: {
      type: DataTypes.STRING(10),
      allowNull: true
    },
    deleted_by: {
      type: DataTypes.STRING(10),
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'flagging_mappings',
    schema: process.env.SCHEMA_NAME,
    timestamps: true,
    paranoid: true,
    indexes: [
      {
        name: "flagging_mappings_pkey",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
};
