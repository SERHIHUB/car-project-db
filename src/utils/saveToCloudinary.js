import { v2 as cloudinary } from 'cloudinary';
import fs from 'node:fs/promises';
import path from 'node:path';
import { env } from './env.js';
import { ENV_VARS, TEMP_UPLOAD_DIR, UPLOAD_DIR } from '../constants/index.js';

// import imagemin from 'imagemin';
// import imageminMozjpeg from 'imagemin-mozjpeg';

cloudinary.config({
  cloud_name: env(ENV_VARS.CLOUDINARY_NAME),
  api_key: env(ENV_VARS.CLOUDINARY_API_KEY),
  api_secret: env(ENV_VARS.CLOUDINARY_API_SECRET),
});

export const saveToCloudinary = async (file) => {
  if (!file) {
    return { url: null };
  }
  // ----------------------------
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

  const res = await cloudinary.uploader.upload(file.path, {
    transformation: {
      width: 480,
      // height: 380,
    },
  });

  await fs.unlink(file.path);

  return { url: res.secure_url };
};
