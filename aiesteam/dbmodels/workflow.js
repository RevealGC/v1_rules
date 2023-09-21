const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('workflow', {
    id: {
      autoIncrement: true,
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true
    },
    sent_from: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    sent_to: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    data: {
      type: DataTypes.JSONB,
      allowNull: false
    },
    parent_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      defaultValue: 0
    },
    message: {
      type: DataTypes.STRING(2500),
      allowNull: true
    },  created_at: {
        type: DataTypes.DATE,
        allowNull: true
      },
      updated_at: {
        type: DataTypes.DATE,
        allowNull: true
      },
    
  }, {
    sequelize,
    tableName: 'workflow',
    schema: process.env.SCHEMA_NAME,
    timestamps: true,
    // indexes: [
    //   {
    //     name: "workflow_pkey",
    //     unique: true,
    //     fields: [
    //       { name: "id" },
    //     ]
    //   },
    // ]
  });
};
