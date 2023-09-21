const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('spad_jobs', {
    id: {
      autoIncrement: true,
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true
    },
    spad_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: 'spad',
        key: 'id'
      }
    },
    result: {
      type: DataTypes.JSONB,
      allowNull: true
    },
    valid: {
      type: DataTypes.JSONB,
      allowNull: true
    },
    invalid: {
      type: DataTypes.JSONB,
      allowNull: true
    },
    facts: {
      type: DataTypes.JSONB,
      allowNull: true
    },
    debug: {
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
    }
  }, {
    sequelize,
    tableName: 'spad_jobs',
    schema: process.env.SCHEMA_NAME,
    timestamps: false,
    indexes: [
      {
        name: "spad_jobs_pkey",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
};
