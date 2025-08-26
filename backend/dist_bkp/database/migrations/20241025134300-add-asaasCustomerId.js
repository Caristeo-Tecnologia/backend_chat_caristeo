"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
module.exports = {
    up: (queryInterface) => {
        return Promise.all([
            queryInterface.addColumn("Companies", "asaasCustomerId", {
                type: sequelize_1.DataTypes.STRING,
                allowNull: true
            }),
            queryInterface.addColumn("Companies", "asaasSubscriptionId", {
                type: sequelize_1.DataTypes.STRING,
                allowNull: true
            }),
        ]);
    },
    down: (queryInterface) => {
        return Promise.all([
            queryInterface.removeColumn("Companies", "asaasCustomerId"),
            queryInterface.removeColumn("Companies", "asaasSubscriptionId")
        ]);
    }
};
