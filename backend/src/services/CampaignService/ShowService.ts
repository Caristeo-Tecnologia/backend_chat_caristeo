import Campaign from "../../models/Campaign";
import AppError from "../../errors/AppError";
import CampaignShipping from "../../models/CampaignShipping";
import ContactList from "../../models/ContactList";
import ContactListItem from "../../models/ContactListItem";
import Whatsapp from "../../models/Whatsapp";
import { IncludeOptions } from "sequelize";

const ShowService = async (id: string | number, withContacts = false): Promise<Campaign> => {
  const includeContactList = withContacts ? [
    {
      model: ContactListItem,
      attributes: ["id", "name", "number", "email", "isWhatsappValid"]
    }
  ] : [];

  const include: IncludeOptions[] = [
    { model: CampaignShipping },
    { model: Whatsapp, attributes: ["id", "name"] },
    {
      model: ContactList,
      include: includeContactList
    }
  ]

  const record = await Campaign.findByPk(id, {
    include
  });

  if (!record) {
    throw new AppError("ERR_NO_TICKETNOTE_FOUND", 404);
  }

  return record;
};

export default ShowService;
