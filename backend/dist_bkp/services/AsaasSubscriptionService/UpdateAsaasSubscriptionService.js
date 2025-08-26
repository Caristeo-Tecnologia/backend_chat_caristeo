"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const CreateAsaasCustomerService_1 = __importDefault(require("../AsaasCustomerService/CreateAsaasCustomerService"));
const axios_1 = __importDefault(require("axios"));
const ShowCompanyService_1 = __importDefault(require("../CompanyService/ShowCompanyService"));
const ShowPlanService_1 = __importDefault(require("../PlanService/ShowPlanService"));
const ListAsaasSubscriptionService_1 = __importDefault(require("./ListAsaasSubscriptionService"));
const AppError_1 = __importDefault(require("../../errors/AppError"));
const Invoices_1 = __importDefault(require("../../models/Invoices"));
const sequelize_1 = require("sequelize");
const DeleteAsaasPaymentsService_1 = __importDefault(require("../AsaasPaymentsService/DeleteAsaasPaymentsService"));
const UpdateAsaasSubscriptionService = async (companyId, creditCard) => {
    const company = await (0, ShowCompanyService_1.default)(companyId);
    if (!company.planId) {
        throw new AppError_1.default("Nenhum plano selecionado");
    }
    const plan = await (0, ShowPlanService_1.default)(company.planId);
    if (plan.value === 0 || !plan.value) {
        throw new AppError_1.default("Plano sem valor configurado");
    }
    const customer = await (0, CreateAsaasCustomerService_1.default)(companyId);
    const subscription = await (0, ListAsaasSubscriptionService_1.default)({
        customer: customer.id
    });
    const headers = {
        "Content-Type": "application/json",
        "User-Agent": "Insomnia/2024.4.1",
        access_token: process.env.ASAAS_TOKEN
    };
    const body = {
        customer: customer.id,
        billingType: creditCard ? "CREDIT_CARD" : "UNDEFINED",
        nextDueDate: company.dueDate,
        value: plan.value,
        cycle: "MONTHLY",
        description: plan.name,
        ...creditCard
    };
    const invoices = await Invoices_1.default.findAll({
        where: {
            companyId: company.id,
            status: "open",
            asaasPaymentId: { [sequelize_1.Op.ne]: null }
        }
    });
    if (subscription?.length) {
        // ToDo: tratar resposta
        const res = await axios_1.default.put(`${process.env.ASAAS_URL}/api/v3/subscriptions/${subscription[0].id}`, body, {
            headers
        });
        invoices.forEach(async (invoice) => {
            await (0, DeleteAsaasPaymentsService_1.default)(invoice.asaasPaymentId);
        });
        return res.data;
    }
    // ToDo: tratar resposta
    const res = await axios_1.default.post(`${process.env.ASAAS_URL}/api/v3/subscriptions`, body, {
        headers
    });
    invoices.forEach(async (invoice) => {
        await (0, DeleteAsaasPaymentsService_1.default)(invoice.asaasPaymentId);
    });
    const data = res.data;
    await company.update({ asaasSubscriptionId: data.id });
    return data;
};
exports.default = UpdateAsaasSubscriptionService;
