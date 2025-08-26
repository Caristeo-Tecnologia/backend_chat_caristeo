"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const AppError_1 = __importDefault(require("../../errors/AppError"));
const ListAsaasPaymentsService = async (subscriptionId) => {
    const url = `${process.env.ASAAS_URL}/v3/subscriptions/${subscriptionId}/payments`;
    const payments = await axios_1.default.get(url, {
        headers: {
            "Content-Type": "application/json",
            "access_token": process.env.ASAAS_TOKEN,
            "User-Agent": "Insomnia/2024.4.1"
        }
    });
    if (payments.status !== 200) {
        throw new AppError_1.default("Falha ao consultar cobranças Asaas.");
    }
    return payments.data.data;
};
exports.default = ListAsaasPaymentsService;
