import axios from 'axios';
import AppError from '../../errors/AppError';

const ListAsaasPaymentsService = async (subscriptionId: string) => {
  const url = `${process.env.ASAAS_URL}/v3/subscriptions/${subscriptionId}/payments`;

  const payments = await axios.get(url, {
    headers: {
      "Content-Type": "application/json",
      "access_token": process.env.ASAAS_TOKEN,
      "User-Agent": "Insomnia/2024.4.1"
    }
  });

  if (payments.status !== 200) {
    throw new AppError("Falha ao consultar cobranças Asaas.");
  }

  return payments.data.data;
};

export default ListAsaasPaymentsService;
