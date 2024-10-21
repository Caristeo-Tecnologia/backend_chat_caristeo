import axios from "axios";
import ShowCompanyService from "../CompanyService/ShowCompanyService";
import ListAsaasCustomerService from "./ListAsaasCustomerService";
import AppError from "../../errors/AppError";

const CreateAsaasCustomerService = async (companyId: number) => {
  const company = await ShowCompanyService(companyId);

  if (!company.cpfCnpj) {
    throw new AppError("CPF/CNPJ é obrigatório.");
  }

  const customers = await ListAsaasCustomerService({ externalReference: company.id });

  if (customers?.length) {
    return customers[0];
  }

  const url = `${process.env.ASAAS_URL}/api/v3/customers`;

  const headers = {
    "Content-Type": "application/json",
    "User-Agent": "Insomnia/2024.4.1",
    "access_token": process.env.ASAAS_TOKEN
  };

  const data = {
    name: company.name,
    email: company.email,
    phone: company.phone,
    cpfCnpj: company.cpfCnpj,
    mobilePhone: company.phone,
    externalReference: company.id,
    notificationDisabled: false
  };

  // ToDo: avaliar erros na resposta
  const res = await axios.post(url, data, {
    headers
  });

  return res.data.data;
};

export default CreateAsaasCustomerService;
