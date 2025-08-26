"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const ShowCompanyService_1 = __importDefault(require("../CompanyService/ShowCompanyService"));
const ListAsaasCustomerService_1 = __importDefault(require("./ListAsaasCustomerService"));
const AppError_1 = __importDefault(require("../../errors/AppError"));
const ShowAsaasCustomerService_1 = __importDefault(require("./ShowAsaasCustomerService"));
const CreateAsaasCustomerService = async (companyId) => {
    const company = await (0, ShowCompanyService_1.default)(companyId);
    if (!company.cpfCnpj) {
        throw new AppError_1.default("CPF/CNPJ é obrigatório.");
    }
    let customer;
    if (company.asaasCustomerId) {
        customer = await (0, ShowAsaasCustomerService_1.default)(company.asaasCustomerId);
    }
    else {
        const customers = await (0, ListAsaasCustomerService_1.default)({
            externalReference: company.id
        });
        customer = customers[0];
    }
    if (customer) {
        company.update({ asaasCustomerId: customer.id });
        return customer;
    }
    const url = `${process.env.ASAAS_URL}/v3/customers`;
    const headers = {
        "Content-Type": "application/json",
        "User-Agent": "Insomnia/2024.4.1",
        access_token: process.env.ASAAS_TOKEN
    };
    const body = {
        name: company.name,
        email: company.email,
        phone: company.phone,
        cpfCnpj: company.cpfCnpj,
        mobilePhone: company.phone,
        externalReference: company.id,
        notificationDisabled: true
    };
    // ToDo: avaliar erros na resposta
    const res = await axios_1.default.post(url, body, {
        headers
    });
    const data = res.data;
    company.update({ asaasCustomerId: data.id });
    return data;
};
exports.default = CreateAsaasCustomerService;
