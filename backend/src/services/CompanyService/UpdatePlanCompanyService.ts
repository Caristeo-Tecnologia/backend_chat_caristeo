import AppError from "../../errors/AppError";
import Company from "../../models/Company";
import UpdateAsaasSubscriptionService from "../AsaasSubscriptionService/UpdateAsaasSubscriptionService";

type ScheduleData = {
  id: number | string;
  planId: number;
};

const UpdatePlanCompanyService = async ({
  id,
  planId
}: ScheduleData): Promise<Company> => {
  const company = await Company.findByPk(id);

  if (!company) {
    throw new AppError("ERR_NO_COMPANY_FOUND", 404);
  }

  await company.update({
    planId
  });

  await UpdateAsaasSubscriptionService(+id);

  return company;
};

export default UpdatePlanCompanyService;
