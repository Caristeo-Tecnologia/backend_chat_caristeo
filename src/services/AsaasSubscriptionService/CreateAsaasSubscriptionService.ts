import CreateAsaasCustomerService from "../AsaasCustomerService/CreateAsaasCustomerService";
import axios from 'axios';
import ShowCompanyService from "../CompanyService/ShowCompanyService";
import ShowPlanService from "../PlanService/ShowPlanService";
import ListAsaasSubscriptionService from "./ListAsaasSubscriptionService";
import AppError from "../../errors/AppError";

const CreateAsaasSubscriptionService = async (companyId: number) => {
  const company = await ShowCompanyService(companyId);

  if (!company.planId) {
    throw new AppError('Nenhum plano selecionado');
  }

  const plan = await ShowPlanService(company.planId);

  if (plan.value === 0 || !plan.value) {
    throw new AppError('Plano sem valor configurado');
  }

  const customer = await CreateAsaasCustomerService(companyId);

  const subscription = await ListAsaasSubscriptionService({ customer: customer.id });

  if (subscription?.length) {
    return subscription[0];
  }

  const url = `${process.env.ASAAS_URL}/api/v3/subscriptions`;

  const headers = {
    "Content-Type": "application/json",
    "User-Agent": "Insomnia/2024.4.1",
    "access_token": process.env.ASAAS_TOKEN
  };

  const data = {
    "customer": customer.id,
    "billingType": "UNDEFINED",
    "nextDueDate": `${new Date().getFullYear()}-${new Date().getMonth() + 1}-${new Date().getDate()}`,
    "value": plan.value,
    "cycle": "MONTHLY",
    "description": plan.name,
  };

  // ToDo: tratar resposta
  const res = await axios.post(url, data, {
    headers
  });

  return res.data;
};

export default CreateAsaasSubscriptionService;
