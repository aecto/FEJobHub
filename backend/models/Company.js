const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Company = sequelize.define('Company', {
  id: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true
  },
  company_name: {
    type: DataTypes.STRING(255),
    allowNull: false,
    unique: true
  },
  career_url: {
    type: DataTypes.STRING(500),
    allowNull: true
  }
}, {
  tableName: 'companies',
  timestamps: true,
  underscored: true
});

module.exports = Company;