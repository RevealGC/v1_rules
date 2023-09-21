const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('flagging_source_flags', {
    id: {
      autoIncrement: true,
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true
    },
    code: {
      type: DataTypes.STRING(10),
      allowNull: false
    },
    description: {
      type: DataTypes.STRING(255),
      allowNull: true
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
    tableName: 'flagging_source_flags',
    schema: process.env.SCHEMA_NAME,
    timestamps: true,
    paranoid: true,
    indexes: [
      {
        name: "flagging_source_flags_pkey",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
};
