import AppError from "../../errors/AppError";
import Company from "../../models/Company";
import Setting from "../../models/Setting";
import { logger } from "../../utils/logger";
import UpdateAsaasSubscriptionService from "../AsaasSubscriptionService/UpdateAsaasSubscriptionService";

interface CompanyData {
  name: string;
  id?: number | string;
  phone?: string;
  email?: string;
  status?: boolean;
  planId?: number;
  campaignsEnabled?: boolean;
  dueDate?: string;
  recurrence?: string;
  cpfCnpj?: string;
  postalCode?: string;
  creditCard?: {
    name: string;
    cardNumber: string;
    expiryDate: string;
    cvv: string;
  };
}

const UpdateCompanyService = async (
  companyData: CompanyData
): Promise<Company> => {
  const company = await Company.findByPk(companyData.id);
  const {
    name,
    phone,
    email,
    status,
    planId,
    campaignsEnabled,
    dueDate,
    recurrence,
    cpfCnpj,
    postalCode,
    creditCard
  } = companyData;

  if (!company) {
    throw new AppError("ERR_NO_COMPANY_FOUND", 404);
  }

  await company.update({
    name,
    phone,
    email,
    //status,
    planId,
    //dueDate,
    //recurrence,
    cpfCnpj,
    postalCode
  });

  await company.reload();

  if (companyData.campaignsEnabled !== undefined) {
    const [setting, created] = await Setting.findOrCreate({
      where: {
        companyId: company.id,
        key: "campaignsEnabled"
      },
      defaults: {
        companyId: company.id,
        key: "campaignsEnabled",
        value: `${campaignsEnabled}`
      }
    });
    if (!created) {
      await setting.update({ value: `${campaignsEnabled}` });
    }
  }

  if (creditCard.cardNumber && creditCard.cvv && creditCard.expiryDate && creditCard.name) {
    const _creditCard = {
      creditCard: {
        holderName: creditCard.name,
        number: creditCard.cardNumber,
        expiryMonth: creditCard.expiryDate.split(" / ")[0],
        expiryYear: creditCard.expiryDate.split(" / ")[1],
        ccv: creditCard.cvv
      },
      creditCardHolderInfo: {
        name: creditCard.name,
        email: company.email,
        cpfCnpj: company.cpfCnpj?.replace(/\D/g, ""),
        postalCode: company.postalCode?.replace(/\D/g, ""),
        addressNumber: "0",
        addressComplement: null,
        phone: company.phone?.replace(/\D/g, ""),
        mobilePhone: company.phone?.replace(/\D/g, "")
      }
    };

    await UpdateAsaasSubscriptionService(company.id, _creditCard);
  }

  return company;
};

export default UpdateCompanyService;
