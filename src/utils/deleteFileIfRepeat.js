import fs from 'node:fs/promises';

export const deleteFileIfRepeat = async (files) => {
  try {
    console.log(files);
    await fs.unlink(files);
  } catch (error) {
    if (error.code === 'ENOENT') {
      console.log('File was not found.');
    }
  }
};
