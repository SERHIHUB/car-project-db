import { Router } from 'express';
import {
  createContactController,
  deleteContactController,
  editContactController,
  getContactsController,
} from '../controllers/contacts/contactsControllers.js';
import { auditAccessContact } from '../middlewares/auditAccessContact.js';
import { auditTokenMiddleware } from '../middlewares/auditTokenMiddleware.js';
import { validateBody } from '../middlewares/validateBody.js';
import { validateMongoId } from '../middlewares/validateMongoId.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { createContactSchema } from '../validation/contacts/createContactSchema.js';
import { updateContactSchema } from '../validation/contacts/updateContactSchema.js';

const contactRouter = Router();

contactRouter.post(
  '/',
  auditTokenMiddleware,
  validateBody(createContactSchema),
  ctrlWrapper(createContactController),
);

contactRouter.patch(
  '/:contactId',
  auditTokenMiddleware,
  ctrlWrapper(auditAccessContact),
  validateMongoId('contactId'),
  validateBody(updateContactSchema),
  ctrlWrapper(editContactController),
);

contactRouter.get(
  '/',
  auditTokenMiddleware,
  ctrlWrapper(getContactsController),
);

contactRouter.delete(
  '/:contactId',
  auditTokenMiddleware,
  ctrlWrapper(auditAccessContact),
  validateMongoId('contactId'),
  ctrlWrapper(deleteContactController),
);

export default contactRouter;
