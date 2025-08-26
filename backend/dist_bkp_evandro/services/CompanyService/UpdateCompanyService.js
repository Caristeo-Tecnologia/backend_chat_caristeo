"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const AppError_1 = __importDefault(require("../../errors/AppError"));
const Company_1 = __importDefault(require("../../models/Company"));
const Setting_1 = __importDefault(require("../../models/Setting"));
const UpdateAsaasSubscriptionService_1 = __importDefault(require("../AsaasSubscriptionService/UpdateAsaasSubscriptionService"));
const UpdateCompanyService = async (companyData) => {
    const company = await Company_1.default.findByPk(companyData.id);
    const { name, phone, email, status, planId, campaignsEnabled, dueDate, recurrence, cpfCnpj, postalCode, creditCard } = companyData;
    if (!company) {
        throw new AppError_1.default("ERR_NO_COMPANY_FOUND", 404);
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
        const [setting, created] = await Setting_1.default.findOrCreate({
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
        await (0, UpdateAsaasSubscriptionService_1.default)(company.id, _creditCard);
    }
    return company;
};
exports.default = UpdateCompanyService;
