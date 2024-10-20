import { Request, Response } from "express";
import CreateWebhookService from "../services/AsaasWebhookService/CreateWebhookService";
import { logger } from "../utils/logger";
import CreateAsaasSubscriptionService from "../services/AsaasSubscriptionService/CreateAsaasSubscriptionService";

export const webhook = async (
  req: Request,
  res: Response
): Promise<Response> => {
  logger.info(`[webhook] ${JSON.stringify(req.body)}`);
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

export const createWebHook = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const data = await CreateWebhookService();
  return res.status(200).json(data);
};