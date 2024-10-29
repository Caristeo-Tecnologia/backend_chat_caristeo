import CreateAsaasCustomerService from "../AsaasCustomerService/CreateAsaasCustomerService";
import axios from "axios";
import ShowCompanyService from "../CompanyService/ShowCompanyService";
import ShowPlanService from "../PlanService/ShowPlanService";
import ListAsaasSubscriptionService from "./ListAsaasSubscriptionService";
import AppError from "../../errors/AppError";

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

const CreateAsaasSubscriptionService = async (companyId: number, creditCard?: CreditCard) => {
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

  if (subscription?.length) {
    await company.update({ asaasSubscriptionId: subscription[0].id });
    return subscription[0];
  }

  const url = `${process.env.ASAAS_URL}/api/v3/subscriptions`;

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

  // ToDo: tratar resposta
  const res = await axios.post(url, body, {
    headers
  });

  const data = res.data;

  await company.update({ asaasSubscriptionId: data.id });

  return data;
};

export default CreateAsaasSubscriptionService;
