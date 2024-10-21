import ListAsaasSubscriptionPaymentsService from "./ListAsaasPaymentsService";

const CreateAsaasSubscriptionPaymentsService = async (
  subscriptionId: string
) => {
  const payments = await ListAsaasSubscriptionPaymentsService(subscriptionId);

  

};

export default CreateAsaasSubscriptionPaymentsService;
