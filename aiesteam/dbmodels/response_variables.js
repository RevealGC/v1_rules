const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('response_variables', {
    rvid: {
      autoIncrement: true,
      autoIncrementIdentity: true,
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true
    },
    rvname: {
      type: DataTypes.STRING(255),
      allowNull: true,
      unique: "rvname_uk"
    },
    mu_flag: {
      type: DataTypes.STRING(5),
      allowNull: true
    },
    kau_flag: {
      type: DataTypes.STRING(5),
      allowNull: true
    },
    estab_flag: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    rv_description: {
      type: DataTypes.STRING(2000),
      allowNull: true
    },
    qdm_flag: {
      type: DataTypes.CHAR(3),
      allowNull: true
    },
    data_type: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    visible: {
      type: DataTypes.CHAR(1),
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
    },
    variable_type_id: {
      type: DataTypes.BIGINT,
      allowNull: true,
      references: {
        model: 'variable_types',
        key: 'id'
      }
    },
    control_group_id: {
      type: DataTypes.BIGINT,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'response_variables',
    schema: process.env.SCHEMA_NAME,
    timestamps: false,
    indexes: [
      {
        name: "response_variables_idx2",
        fields: [
          { name: "visible" },
        ]
      },
      {
        name: "rvid_pk",
        unique: true,
        fields: [
          { name: "rvid" },
        ]
      },
      {
        name: "rvname_uk",
        unique: true,
        fields: [
          { name: "rvname" },
        ]
      },
    ]
  });
};
