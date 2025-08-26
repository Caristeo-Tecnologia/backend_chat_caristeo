"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ShowCompanyService_1 = __importDefault(require("../CompanyService/ShowCompanyService"));
const axios_1 = __importDefault(require("axios"));
const ShowPlanService_1 = __importDefault(require("../PlanService/ShowPlanService"));
const CreateAsaasPaymentLinkService = async (companyId, invoiceId, planId) => {
    const company = await (0, ShowCompanyService_1.default)(companyId);
    const plan = await (0, ShowPlanService_1.default)(planId ?? company.planId);
    const url = `${process.env.ASAAS_URL}/v3/paymentLinks`;
    const headers = {
        "Content-Type": "application/json",
        "User-Agent": "Insomnia/2024.4.1",
        "access_token": process.env.ASAAS_TOKEN
    };
    const data = {
        "name": `#Fatura: ${invoiceId} - ${plan.name}`,
        "description": `#Fatura: ${invoiceId} - ${plan.name}`,
        "value": plan.value,
        "billingType": "UNDEFINED",
        "chargeType": "DETACHED",
        "dueDateLimitDays": 20
    };
    // ToDo: avaliar erros na resposta
    const res = await axios_1.default.post(url, data, {
        headers
    });
    return res.data;
};
exports.default = CreateAsaasPaymentLinkService;
