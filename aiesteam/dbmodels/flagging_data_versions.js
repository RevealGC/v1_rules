const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('flagging_data_versions', {
    id: {
      autoIncrement: true,
      type: DataTypes.BIGINT,
      allowNull: false,
    
    },
    code: {
      type: DataTypes.STRING(10),
      allowNull: false,
      primaryKey: true
    },
    description: {
      type: DataTypes.STRING(255),
      allowNull: true,
      field: 'description'

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
    tableName: 'flagging_data_versions',
    schema: process.env.SCHEMA_NAME,
    timestamps: true,
    paranoid: true,
    indexes: [
      {
        name: "flagging_data_versions_pkey",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
};
