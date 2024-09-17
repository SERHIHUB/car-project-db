import fs from 'node:fs/promises';
import path from 'node:path';
import { env } from './env.js';
import { UPLOAD_DIR, ENV_VARS, TEMP_UPLOAD_DIR } from '../constants/index.js';

import imagemin from 'imagemin';
import imageminMozjpeg from 'imagemin-mozjpeg';

export const saveFileToLocalFolder = async (file) => {
  const dirFiles = await fs.readdir(
    TEMP_UPLOAD_DIR,
    { recursive: true },
    (err) => {
      console.error(err);
    },
  );

  for (const dirFile of dirFiles) {
    path.join(TEMP_UPLOAD_DIR, dirFile) !== file.path &&
      (await fs.unlink(path.join(TEMP_UPLOAD_DIR, dirFile)));
  }

  if (!file) {
    return {
      url: null,
      filePath: null,
    };
  }

  const content = await fs.readFile(file.path);
  const newPath = path.join(UPLOAD_DIR, file.filename);

  // Стиснення зображення .jpg
  if (file.path.endsWith('.jpg')) {
    (async () => {
      const files = await imagemin([`${TEMP_UPLOAD_DIR}/*.{jpg,png}`], {
        destination: UPLOAD_DIR,
        plugins: [
          imageminMozjpeg({
            quality: [10],
          }),
        ],
      });

      await fs.unlink(file.path);
    })();
  } else {
    await fs.writeFile(newPath, content);
    await fs.unlink(file.path);
  }

  return {
    url: env(ENV_VARS.BACKEND_HOST) + `/upload/${file.filename}`,
    filePath: newPath,
  };
};
