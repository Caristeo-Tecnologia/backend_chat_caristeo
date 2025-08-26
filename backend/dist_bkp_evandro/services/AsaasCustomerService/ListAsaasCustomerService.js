"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const AppError_1 = __importDefault(require("../../errors/AppError"));
const ListAsaasCustomerService = async (params) => {
    const url = `${process.env.ASAAS_URL}/v3/customers`;
    const customers = await axios_1.default.get(url, {
        headers: {
            "Content-Type": "application/json",
            access_token: process.env.ASAAS_TOKEN,
            "User-Agent": "Insomnia/2024.4.1"
        },
        params
    });
    if (customers.status !== 200) {
        throw new AppError_1.default("Falha ao consultar cliente Asaas.");
    }
    return customers.data.data;
};
exports.default = ListAsaasCustomerService;
