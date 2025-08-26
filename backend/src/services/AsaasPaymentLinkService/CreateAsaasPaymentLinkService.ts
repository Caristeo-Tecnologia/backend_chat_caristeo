import ShowCompanyService from "../CompanyService/ShowCompanyService";

import axios from 'axios';
import ShowPlanService from "../PlanService/ShowPlanService";

const CreateAsaasPaymentLinkService = async (companyId: number, invoiceId: number, planId?: number) => {
  const company = await ShowCompanyService(companyId);
  const plan = await ShowPlanService(planId ?? company.planId);

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
  const res = await axios.post(url, data, {
    headers
  });

  return res.data;
};

export default CreateAsaasPaymentLinkService;