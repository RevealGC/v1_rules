const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('item_flags', {
    item_flag_id: {
      // autoIncrement: true,
      type: DataTypes.BIGINT,
      allowNull: false
    },
    item_flag: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    item_flag_code: {
      type: DataTypes.STRING(10),
      allowNull: true
    },
    created_by: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    created_date: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: Sequelize.Sequelize.literal('CURRENT_TIMESTAMP')
    },
    last_modified_by: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    last_modified_date: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: Sequelize.Sequelize.literal('CURRENT_TIMESTAMP')
    }
  }, {
    sequelize,
    tableName: 'item_flags',
    schema: process.env.SCHEMA_NAME,
    timestamps: false
  });
};
