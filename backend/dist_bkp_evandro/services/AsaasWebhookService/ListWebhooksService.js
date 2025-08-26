"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const AppError_1 = __importDefault(require("../../errors/AppError"));
const axios_1 = __importDefault(require("axios"));
const ListWebhooksService = async (params) => {
    const url = `${process.env.ASAAS_URL}/v3/webhooks`;
    const webhooks = await axios_1.default.get(url, {
        headers: {
            "Content-Type": "application/json",
            "access_token": process.env.ASAAS_TOKEN,
            "User-Agent": "Insomnia/2024.4.1"
        },
        params
    });
    if (webhooks.status !== 200) {
        throw new AppError_1.default("Falha ao consultar webhooks Asaas.");
    }
    return webhooks.data.data;
};
exports.default = ListWebhooksService;
