import axios from "axios";
import AppError from "../../errors/AppError";

const ShowAsaasCustomerService = async (id: string) => {
  const url = `${process.env.ASAAS_URL}/api/v3/customers/${id}`;

  const customers = await axios.get(url, {
    headers: {
      "Content-Type": "application/json",
      access_token: process.env.ASAAS_TOKEN,
      "User-Agent": "Insomnia/2024.4.1"
    }
  });

  if (customers.status !== 200) {
    throw new AppError("Falha ao consultar cliente Asaas.");
  }

  return customers.data;
};

export default ShowAsaasCustomerService;
