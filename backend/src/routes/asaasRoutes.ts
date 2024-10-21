import express from "express";
import isAuth from "../middleware/isAuth";
import isSuper from "../middleware/isSuper";

import * as AsaasController from "../controllers/AsaasController";

const routes = express.Router();

routes.post("/asaas/webhook", AsaasController.webhook);
routes.post("/asaas/create-webhook", isAuth, AsaasController.createWebHook);
routes.post("/asaas/subscriptions", isAuth, AsaasController.subscriptions);
routes.post("/asaas/payment-link", isAuth, AsaasController.createPaymentLInk);

export default routes;
