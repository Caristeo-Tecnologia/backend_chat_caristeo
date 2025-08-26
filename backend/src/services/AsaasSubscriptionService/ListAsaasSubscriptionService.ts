import axios from "axios";
import AppError from "../../errors/AppError";

const ListAsaasSubscriptionService = async (params: any) => {
  const url = `${process.env.ASAAS_URL}/v3/subscriptions`;

  const subscriptions = await axios.get(url, {
    headers: {
      "Content-Type": "application/json",
      access_token: process.env.ASAAS_TOKEN,
      "User-Agent": "Insomnia/2024.4.1"
    },
    params
  });

  if (subscriptions.status !== 200) {
    throw new AppError("Falha ao consultar assinaturas Asaas.");
  }

  return subscriptions.data.data;
};

export default ListAsaasSubscriptionService;
