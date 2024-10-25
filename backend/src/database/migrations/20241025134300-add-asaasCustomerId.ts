import { DataTypes, QueryInterface } from "sequelize";

module.exports = {
  up: (queryInterface: QueryInterface) => {
    return Promise.all([
      queryInterface.addColumn("Companies", "asaasCustomerId", {
        type: DataTypes.STRING,
        allowNull: true
      }),
      queryInterface.addColumn("Companies", "asaasSubscriptionId", {
        type: DataTypes.STRING,
        allowNull: true
      }),
    ]);
  },

  down: (queryInterface: QueryInterface) => {
    return Promise.all([
      queryInterface.removeColumn("Companies", "asaasCustomerId"),
      queryInterface.removeColumn("Companies", "asaasSubscriptionId")
    ]);
  }
};
