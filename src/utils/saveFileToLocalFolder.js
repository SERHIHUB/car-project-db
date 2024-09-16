import fs from 'node:fs/promises';
import path from 'node:path';
import { env } from './env.js';
import { UPLOAD_DIR, ENV_VARS } from '../constants/index.js';

export const saveFileToLocalFolder = async (file) => {
  if (!file) {
    return {
      url: null,
      filePath: null,
    };
  }

  const content = await fs.readFile(file.path);
  const newPath = path.join(UPLOAD_DIR, file.filename);
  await fs.writeFile(newPath, content);
  await fs.unlink(file.path);

  return {
    url: env(ENV_VARS.BACKEND_HOST) + `/upload/${file.filename}`,
    filePath: newPath,
  };
};
