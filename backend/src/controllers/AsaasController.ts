import { Request, Response } from "express";
import CreateWebhookService from "../services/AsaasWebhookService/CreateWebhookService";
import { logger } from "../utils/logger";
import CreateAsaasSubscriptionService from "../services/AsaasSubscriptionService/CreateAsaasSubscriptionService";
import CreateAsaasPaymentLinkService from "../services/AsaasPaymentLinkService/CreateAsaasPaymentLinkService";
import Invoices from "../models/Invoices";
import Company from "../models/Company";
import ShowPlanService from "../services/PlanService/ShowPlanService";

export const webhook = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { event, payment } = req.body;

  if (event === "PAYMENT_CREATED") {
    logger.info(`[webhook:PAYMENT_CREATED] ${JSON.stringify(req.body)}`);

    if (!payment.subscription) {
      logger.info(`[webhook] assinatura não identificada ${JSON.stringify(req.body)}`);
      return res.status(200).json({});;
    }

    const company = await Company.findOne({where: { asaasCustomerId: payment.customer }});

    if (!company) {
      logger.info(`[webhook] compania não identificada para o id fornecido ${JSON.stringify(req.body)}`);
      return res.status(200).json({});
    }

    const plan = await ShowPlanService(company.planId);

    logger.info(`[webhook] Invoice criada ${JSON.stringify(req.body)}`);

    await Invoices.create({
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
    logger.info(`[webhook:PAYMENT_DELETED] ${JSON.stringify(req.body)}`);

    const invoice = await Invoices.findOne({
      where: {
        asaasPaymentId: payment.id
      }
    });

    if (invoice) {
      await invoice.update({ status: "deleted" });
    }
  }

  if (event === "PAYMENT_CONFIRMED") {
    logger.info(`[webhook:PAYMENT_CONFIRMED] ${JSON.stringify(req.body)}`);

    const invoice = await Invoices.findOne({
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

    const company = await Company.findOne({where: { asaasCustomerId: payment.customer }});

    await company.update({ dueDate: date });
  }

  return res.status(200).json({});
};

export const subscriptions = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { companyId } = req.user;
  const data = await CreateAsaasSubscriptionService(companyId);

  return res.status(200).json(data);
};

export const createPaymentLInk = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { companyId } = req.user;
  let { invoiceId, plan } = req.body;

  if (plan) {
    plan = JSON.parse(plan);
  }

  const paymentLink = await CreateAsaasPaymentLinkService(
    companyId,
    invoiceId,
    plan.planId
  );
  const invoice = await Invoices.findByPk(invoiceId);
  await invoice.update({ paymentUrl: paymentLink.url });

  return res.status(200).json(paymentLink);
};

export const createWebHook = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const data = await CreateWebhookService();
  return res.status(200).json(data);
};
