import axios from "axios";
import AppError from "../../errors/AppError";

const ListAsaasCustomerService = async (params: any) => {
  const url = `${process.env.ASAAS_URL}/v3/customers`;

  const customers = await axios.get(url, {
    headers: {
      "Content-Type": "application/json",
      access_token: process.env.ASAAS_TOKEN,
      "User-Agent": "Insomnia/2024.4.1"
    },
    params
  });

  if (customers.status !== 200) {
    throw new AppError("Falha ao consultar cliente Asaas.");
  }

  return customers.data.data;
};

export default ListAsaasCustomerService;
