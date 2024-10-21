import { Request, Response } from "express";
import CreateWebhookService from "../services/AsaasWebhookService/CreateWebhookService";
import { logger } from "../utils/logger";
import CreateAsaasSubscriptionService from "../services/AsaasSubscriptionService/CreateAsaasSubscriptionService";
import CreateAsaasPaymentLinkService from "../services/AsaasPaymentLinkService/CreateAsaasPaymentLinkService";
import Invoices from "../models/Invoices";
import { Op } from "sequelize";

export const webhook = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { event, payment } = req.body;

  if (event === "PAYMENT_CONFIRMED") {
    const invoice = await Invoices.findOne({
      where: {
        paymentUrl: {
          [Op.like]: `%${payment.paymentLink}%`
        }
      }
    });

    if (invoice) {
      await invoice.update({ status: "paid" });
    }
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
