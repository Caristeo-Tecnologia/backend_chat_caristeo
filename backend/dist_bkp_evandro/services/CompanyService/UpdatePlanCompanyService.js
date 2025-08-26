"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const AppError_1 = __importDefault(require("../../errors/AppError"));
const Company_1 = __importDefault(require("../../models/Company"));
const UpdateAsaasSubscriptionService_1 = __importDefault(require("../AsaasSubscriptionService/UpdateAsaasSubscriptionService"));
const UpdatePlanCompanyService = async ({ id, planId }) => {
    const company = await Company_1.default.findByPk(id);
    if (!company) {
        throw new AppError_1.default("ERR_NO_COMPANY_FOUND", 404);
    }
    await company.update({
        planId
    });
    await (0, UpdateAsaasSubscriptionService_1.default)(+id);
    return company;
};
exports.default = UpdatePlanCompanyService;
