
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('rv', {
    RVID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
      field: 'RVID'
    },

    RVNAME:{
    type: DataTypes.STRING,
          allowNull: false,
          field: 'RVNAME'
    },
MU_FLAG: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: 'MU_FLAG'
    },
KAU_FLAG: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: 'KAU_FLAG'
    },

 ESTAB_FLAG: {
      type: DataTypes.TEXT,
      allowNull: true,
      field:'ESTAB_FLAG'
    },
    RV_DESCRIPTION: {
      type: DataTypes.TEXT,
      allowNull: true,
      field:'RV_DESCRIPTION'
    },
    RV_VERSION: {
      type: DataTypes.TEXT,
      allowNull: true,
      field:'RV_VERSION'
    },
    QDM_FLAG: {
      type: DataTypes.TEXT,
      allowNull: true,
      field:'QDM_FLAG'
    },
    ORDER_SEQUENCE: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: 'ORDER_SEQUENCE'
    },
    VISIBLE: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: 'VISIBLE'
    },

    CREATED_BY: {
          type: DataTypes.STRING,
          allowNull: true,
          field: 'CREATED_BY'
        },

    LAST_MODIFIED_BY: {
          type: DataTypes.STRING,
          allowNull: true,
          field: 'LAST_MODIFIED_BY'
        },

    CREATED_DATE: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: '0000-00-00 00:00:00',
      field: 'CREATED_DATE'
    },
    LAST_MODIFED_DATE: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: '0000-00-00 00:00:00',
      field: 'LAST_MODIFIED_DATE'
    }

  }, {
    tableName: 'response_variables'
  
  });
};


