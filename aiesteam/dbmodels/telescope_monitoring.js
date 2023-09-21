const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('telescope_monitoring', {
    tag: {
      type: DataTypes.STRING(255),
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'telescope_monitoring',
    schema: process.env.SCHEMA_NAME,
    timestamps: false
  });
};
