import {
  createContact,
  deleteContact,
  editContact,
  getAllContacts,
} from '../../services/contacts/contacts.js';

export const createContactController = async (req, res) => {
  const body = req.body;
  const user = req.user;
  const contact = await createContact({ body: body, user: user });

  res.status(201).json({
    status: 201,
    message: 'Successfully created contact.',
    data: contact,
  });
};

export const editContactController = async (req, res) => {
  const id = req.params.contactId;
  const body = req.body;

  const updateContact = await editContact(id, body);

  res.status(200).json({
    status: 200,
    message: 'Successfully updated contact.',
    data: updateContact,
  });
};

export const getContactsController = async (req, res) => {
  const owner = req.user.owner;
  const allContacts = await getAllContacts(owner);

  res.status(200).json({
    status: 200,
    message: 'Successfully get all contacts.',
    data: allContacts,
  });
};

export const deleteContactController = async (req, res) => {
  const id = req.params.contactId;

  const contactDelete = await deleteContact(id);

  // await deleteContact(id);

  // res.status(204).send();

  res.status(200).json({
    status: 200,
    message: 'Successfully delete contact.',
    data: contactDelete,
  });
};
