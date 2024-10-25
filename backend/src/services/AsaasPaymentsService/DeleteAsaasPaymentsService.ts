import axios from 'axios';
import AppError from '../../errors/AppError';

const DeleteAsaasPaymentsService = async (id: string) => {
  const url = `${process.env.ASAAS_URL}/api/v3/payments/${id}`;

  const payments = await axios.delete(url, {
    headers: {
      "Content-Type": "application/json",
      "access_token": process.env.ASAAS_TOKEN,
      "User-Agent": "Insomnia/2024.4.1"
    }
  });

  if (payments.status !== 200) {
    throw new AppError("Falha ao excluir cobranças Asaas.");
  }

  return payments.data;
};

export default DeleteAsaasPaymentsService;
