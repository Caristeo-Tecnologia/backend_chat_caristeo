import AppError from "../../errors/AppError";
import axios from 'axios';

const ListWebhooksService = async (params: any) => {
    const url = `${process.env.ASAAS_URL}/v3/webhooks`;

    const webhooks = await axios.get(url, {
      headers: {
        "Content-Type": "application/json",
        "access_token": process.env.ASAAS_TOKEN,
        "User-Agent": "Insomnia/2024.4.1"
      },
      params
    });
  
    if (webhooks.status !== 200) {
      throw new AppError("Falha ao consultar webhooks Asaas.");
    }
  
    return webhooks.data.data;
}

export default ListWebhooksService;