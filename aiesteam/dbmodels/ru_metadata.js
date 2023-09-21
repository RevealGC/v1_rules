const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('ru_metadata', {
    id: {
      autoIncrement: true,
      autoIncrementIdentity: true,
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true
    },
    ent_id: {
      type: DataTypes.BIGINT,
      allowNull: false
    },
    login_id: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    company_id: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    name1: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    name2: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    mail_street: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    mail_city: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    mail_state: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    mail_zip: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    created_by: {
      type: DataTypes.STRING(20),
      allowNull: true,
      defaultValue: "DATALOAD"
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
    tableName: 'ru_metadata',
    schema: process.env.SCHEMA_NAME,
    timestamps: false,
    indexes: [
      {
        name: "ru_metadata_idx",
        fields: [
          { name: "ent_id" },
          { name: "login_id" },
          { name: "company_id" },
        ]
      },
      {
        name: "ru_metadata_pk",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
};
