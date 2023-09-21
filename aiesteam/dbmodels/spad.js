const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('spad', {
    id: {
      autoIncrement: true,
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true
    },
    status: {
      type: DataTypes.STRING(10),
      allowNull: false,
      defaultValue: "init"
    },
    request: {
      type: DataTypes.JSONB,
      allowNull: false
    },
    merge_status: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    result: {
      type: DataTypes.JSONB,
      allowNull: true
    },
    aggregate: {
      type: DataTypes.JSONB,
      allowNull: true
    },   
    facts: {
      type: DataTypes.JSONB,
      allowNull: true
    },
    created_by: {
      type: DataTypes.STRING(30),
      allowNull: true
    },
    last_modified_by: {
      type: DataTypes.STRING(30),
      allowNull: true
    },
    created_date: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: Sequelize.Sequelize.literal('CURRENT_TIMESTAMP')
    },
    last_modified_date: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: Sequelize.Sequelize.literal('CURRENT_TIMESTAMP')
    },
    reporting_id: {
      type: DataTypes.BIGINT,
      allowNull: true,
      defaultValue: 0
    },
    elapsed_time: {
      type: DataTypes.BIGINT,
      allowNull: true,
      defaultValue: 0
    },
    error_message: {
      type: DataTypes.STRING(500),
      allowNull: true
    },
    parent_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      defaultValue: 0,
      references: {
        model: 'spad',
        key: 'id'
      }
    }
  }, {
    sequelize,
    tableName: 'spad',
    schema: process.env.SCHEMA_NAME,
    timestamps: false,
    indexes: [
      {
        name: "spad_pkey",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
};
