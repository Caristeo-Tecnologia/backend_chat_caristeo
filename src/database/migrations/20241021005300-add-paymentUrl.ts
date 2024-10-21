import { DataTypes, QueryInterface } from "sequelize";

module.exports = {
  up: (queryInterface: QueryInterface) => {
    return Promise.all([

      queryInterface.addColumn("Invoices", "paymentUrl", {
        type: DataTypes.STRING,
        allowNull: true
      })
    ]);
  },

  down: (queryInterface: QueryInterface) => {
    return Promise.all([
      queryInterface.removeColumn("Invoices", "paymentUrl")
    ]);
  }
};
