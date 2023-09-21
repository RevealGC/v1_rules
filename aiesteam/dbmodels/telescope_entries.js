const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('telescope_entries', {
    sequence: {
      type: DataTypes.BIGINT,
      allowNull: false
    },
    uuid: {
      type: DataTypes.CHAR(36),
      allowNull: false
    },
    batch_id: {
      type: DataTypes.CHAR(36),
      allowNull: false
    },
    family_hash: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    should_display_on_index: {
      type: DataTypes.CHAR(1),
      allowNull: false,
      defaultValue: "1"
    },
    type: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'telescope_entries',
    schema: process.env.SCHEMA_NAME,
    timestamps: true
  });
};
