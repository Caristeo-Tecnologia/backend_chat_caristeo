import axios from "axios";
import ShowCompanyService from "../CompanyService/ShowCompanyService";
import ListAsaasCustomerService from "./ListAsaasCustomerService";
import AppError from "../../errors/AppError";
import { logger } from "../../utils/logger";
import ShowAsaasCustomerService from "./ShowAsaasCustomerService";

const CreateAsaasCustomerService = async (companyId: number) => {
  const company = await ShowCompanyService(companyId);

  if (!company.cpfCnpj) {
    throw new AppError("CPF/CNPJ é obrigatório.");
  }

  let customer;

  if (company.asaasCustomerId) {
    customer = await ShowAsaasCustomerService(company.asaasCustomerId);
  } else {
    const customers = await ListAsaasCustomerService({
      externalReference: company.id
    });
    customer = customers[0];
  }

  if (customer) {
    company.update({ asaasCustomerId: customer.id });
    return customer;
  }

  const url = `${process.env.ASAAS_URL}/api/v3/customers`;

  const headers = {
    "Content-Type": "application/json",
    "User-Agent": "Insomnia/2024.4.1",
    access_token: process.env.ASAAS_TOKEN
  };

  const body = {
    name: company.name,
    email: company.email,
    phone: company.phone,
    cpfCnpj: company.cpfCnpj,
    mobilePhone: company.phone,
    externalReference: company.id,
    notificationDisabled: false
  };

  // ToDo: avaliar erros na resposta
  const res = await axios.post(url, body, {
    headers
  });

  const data = res.data;

  logger.info(`[CreateAsaasCustomerService] ${JSON.stringify(res.data)}`);

  company.update({ asaasCustomerId: data.id });

  return data;
};

export default CreateAsaasCustomerService;
