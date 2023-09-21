const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('data_versions', {
    id: {
      autoIncrement: true,
      type: DataTypes.BIGINT,
      allowNull: false,
       primaryKey: true,
     
    },
    code: {
      type: DataTypes.CHAR(2),
      allowNull: true
    },
    // Modified description which maps to the title field
    description: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    created_by: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: Sequelize.Sequelize.literal('CURRENT_TIMESTAMP')
    },
    updated_by: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: Sequelize.Sequelize.literal('CURRENT_TIMESTAMP')
    },
  deleted_by: 
  {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  deleted_at: {
    type: DataTypes.DATE,
    allowNull: true,
    defaultValue: Sequelize.Sequelize.literal('CURRENT_TIMESTAMP')
  }
}, {
    sequelize,
    tableName: 'flagging_data_versions',
    schema: process.env.SCHEMA_NAME,
    timestamps: false,
    indexes: [
      {
        name: "data_versions_pk",
        unique: true,
        fields: [
          { name: "version_id" },
        ]
      },
    ]
  });
};
