import CreateAsaasCustomerService from "../AsaasCustomerService/CreateAsaasCustomerService";
import axios from "axios";
import ShowCompanyService from "../CompanyService/ShowCompanyService";
import ShowPlanService from "../PlanService/ShowPlanService";
import ListAsaasSubscriptionService from "./ListAsaasSubscriptionService";
import AppError from "../../errors/AppError";
import Invoices from "../../models/Invoices";
import { Op } from "sequelize";
import DeleteAsaasPaymentsService from "../AsaasPaymentsService/DeleteAsaasPaymentsService";

type CreditCard = {
  creditCard: {
    holderName: string;
    number: string;
    expiryMonth: string;
    expiryYear: string;
    ccv: string;
  },
  creditCardHolderInfo: {
    name: string;
    email: string;
    cpfCnpj: string;
    postalCode: string;
    addressNumber: string;
    addressComplement: string;
    phone: string;
    mobilePhone: string;
  }
}

const UpdateAsaasSubscriptionService = async (companyId: number, creditCard?: CreditCard) => {
  const company = await ShowCompanyService(companyId);

  if (!company.planId) {
    throw new AppError("Nenhum plano selecionado");
  }

  const plan = await ShowPlanService(company.planId);

  if (plan.value === 0 || !plan.value) {
    throw new AppError("Plano sem valor configurado");
  }

  const customer = await CreateAsaasCustomerService(companyId);

  const subscription = await ListAsaasSubscriptionService({
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

  const invoices = await Invoices.findAll({
    where: {
      companyId: company.id,
      status: "open",
      asaasPaymentId: { [Op.ne]: null }
    }
  });

  if (subscription?.length) {
    // ToDo: tratar resposta
    const res = await axios.put(
      `${process.env.ASAAS_URL}/api/v3/subscriptions/${subscription[0].id}`,
      body,
      {
        headers
      }
    );

    invoices.forEach(async invoice => {
      await DeleteAsaasPaymentsService(invoice.asaasPaymentId);
    });

    return res.data;
  }

  // ToDo: tratar resposta
  const res = await axios.post(
    `${process.env.ASAAS_URL}/api/v3/subscriptions`,
    body,
    {
      headers
    }
  );

  invoices.forEach(async invoice => {
    await DeleteAsaasPaymentsService(invoice.asaasPaymentId);
  });

  const data = res.data;

  await company.update({ asaasSubscriptionId: data.id });

  return data;
};

export default UpdateAsaasSubscriptionService;
