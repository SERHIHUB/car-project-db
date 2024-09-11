import createHttpError from 'http-errors';
import { Contact } from '../db/models/contact.js';

export const auditAccessContact = async (req, res, next) => {
  const id = req.params.contactId;
  const { owner, role } = req.user;

  if (role === 'observer') {
    throw createHttpError(403, 'No access, role is not correct.');
  }

  const contact = await Contact.findOne({ _id: id });

  if (contact === null) {
    throw createHttpError(404, 'Contact was not found.');
  }

  if (contact.owner !== owner) {
    throw createHttpError(403, 'No access, owner is not correct.');
  }
};
