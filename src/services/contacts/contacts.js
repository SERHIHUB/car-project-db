import createHttpError from 'http-errors';
import { Contact } from '../../db/models/contact.js';

export const createContact = async ({ body, user }) => {
  const auditNumber = await Contact.findOne({ number: body.number });

  if (auditNumber) {
    throw createHttpError(409, 'This number is already listed.');
  }

  const newContact = await Contact.create({
    ...body,
    owner: user.owner,
  });

  return newContact;
};

export const editContact = async (id, payload) => {
  const contact = await Contact.findById({ _id: id });

  if (!contact) {
    throw createHttpError(404, 'Contact was not found.');
  }

  const updateContact = await Contact.findByIdAndUpdate({ _id: id }, payload, {
    new: true,
  });

  return updateContact;
};

export const getAllContacts = async (owner) => {
  const contacts = await Contact.find({ owner: owner });

  return contacts;
};

export const deleteContact = async (id) => {
  await Contact.findByIdAndDelete({ _id: id });
};
