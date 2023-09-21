const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('telescope_entries_tags', {
    entry_uuid: {
      type: DataTypes.CHAR(36),
      allowNull: false
    },
    tag: {
      type: DataTypes.STRING(255),
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'telescope_entries_tags',
    schema: process.env.SCHEMA_NAME,
    timestamps: false
  });
};
