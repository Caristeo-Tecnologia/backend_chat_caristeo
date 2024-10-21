import axios from 'axios';
import ListWebhooksService from './ListWebhooksService';
import { logger } from '../../utils/logger';

const CreateWebhookService = async () => {
  const webhooks = await ListWebhooksService({ name: 'payments' });

  if (webhooks?.length) {
    return webhooks[0];
  }

  const url = `${process.env.ASAAS_URL}/api/v3/webhooks`;

  const headers = {
    "Content-Type": "application/json",
    "User-Agent": "Insomnia/2024.4.1",
    "access_token": process.env.ASAAS_TOKEN
  };

  const data = {
    "name": "payments",
    "url": process.env.ASAAS_WEBHOOK_URL,
    "email": process.env.ASAAS_WEBHOOK_EMAIL,
    "enabled": true,
    "interrupted": false,
    "apiVersion": 3,
    "sendType": "SEQUENTIALLY",
    "events": [
      "PAYMENT_RECEIVED",
      "PAYMENT_CONFIRMED",
      "PAYMENT_CREATED",
      "PAYMENT_DELETED",
      "PAYMENT_UPDATED",
    ]
  };

  // ToDo: tratar resposta
  const res = await axios.post(url, data, {
    headers
  });

  return res.data;

};

export default CreateWebhookService;
