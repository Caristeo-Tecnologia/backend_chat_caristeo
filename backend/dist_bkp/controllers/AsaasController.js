"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createWebHook = exports.createPaymentLInk = exports.subscriptions = exports.webhook = void 0;
const CreateWebhookService_1 = __importDefault(require("../services/AsaasWebhookService/CreateWebhookService"));
const logger_1 = require("../utils/logger");
const CreateAsaasSubscriptionService_1 = __importDefault(require("../services/AsaasSubscriptionService/CreateAsaasSubscriptionService"));
const CreateAsaasPaymentLinkService_1 = __importDefault(require("../services/AsaasPaymentLinkService/CreateAsaasPaymentLinkService"));
const Invoices_1 = __importDefault(require("../models/Invoices"));
const Company_1 = __importDefault(require("../models/Company"));
const ShowPlanService_1 = __importDefault(require("../services/PlanService/ShowPlanService"));
const webhook = async (req, res) => {
    const { event, payment } = req.body;
    if (event === "PAYMENT_CREATED") {
        logger_1.logger.info(`[webhook:PAYMENT_CREATED] ${JSON.stringify(req.body)}`);
        if (!payment.subscription) {
            logger_1.logger.info(`[webhook] assinatura não identificada ${JSON.stringify(req.body)}`);
            return res.status(200).json({});
            ;
        }
        const company = await Company_1.default.findOne({ where: { asaasCustomerId: payment.customer } });
        if (!company) {
            logger_1.logger.info(`[webhook] compania não identificada para o id fornecido ${JSON.stringify(req.body)}`);
            return res.status(200).json({});
        }
        const plan = await (0, ShowPlanService_1.default)(company.planId);
        logger_1.logger.info(`[webhook] Invoice criada ${JSON.stringify(req.body)}`);
        await Invoices_1.default.create({
            detail: plan.name,
            status: 'open',
            value: plan.value,
            updatedA: new Date(),
            createdAt: new Date(),
            dueDate: payment.dueDate,
            companyId: company.id,
            paymentUrl: payment.invoiceUrl,
            asaasPaymentId: payment.id
        });
    }
    if (event === "PAYMENT_DELETED") {
        logger_1.logger.info(`[webhook:PAYMENT_DELETED] ${JSON.stringify(req.body)}`);
        const invoice = await Invoices_1.default.findOne({
            where: {
                asaasPaymentId: payment.id
            }
        });
        if (invoice) {
            await invoice.update({ status: "deleted" });
        }
    }
    if (event === "PAYMENT_CONFIRMED") {
        logger_1.logger.info(`[webhook:PAYMENT_CONFIRMED] ${JSON.stringify(req.body)}`);
        const invoice = await Invoices_1.default.findOne({
            where: {
                asaasPaymentId: payment.id
            }
        });
        if (invoice) {
            await invoice.update({ status: "paid" });
        }
        const expiresAt = new Date(payment.dueDate);
        expiresAt.setDate(expiresAt.getDate() + 30);
        const date = expiresAt.toISOString().split("T")[0];
        const company = await Company_1.default.findOne({ where: { asaasCustomerId: payment.customer } });
        await company.update({ dueDate: date });
    }
    return res.status(200).json({});
};
exports.webhook = webhook;
const subscriptions = async (req, res) => {
    const { companyId } = req.user;
    const data = await (0, CreateAsaasSubscriptionService_1.default)(companyId);
    return res.status(200).json(data);
};
exports.subscriptions = subscriptions;
const createPaymentLInk = async (req, res) => {
    const { companyId } = req.user;
    let { invoiceId, plan } = req.body;
    if (plan) {
        plan = JSON.parse(plan);
    }
    const paymentLink = await (0, CreateAsaasPaymentLinkService_1.default)(companyId, invoiceId, plan.planId);
    const invoice = await Invoices_1.default.findByPk(invoiceId);
    await invoice.update({ paymentUrl: paymentLink.url });
    return res.status(200).json(paymentLink);
};
exports.createPaymentLInk = createPaymentLInk;
const createWebHook = async (req, res) => {
    const data = await (0, CreateWebhookService_1.default)();
    return res.status(200).json(data);
};
exports.createWebHook = createWebHook;
