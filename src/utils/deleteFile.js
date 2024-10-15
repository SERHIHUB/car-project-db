// import fs from 'node:fs/promises';
// import path from 'node:path';
// import { UPLOAD_DIR } from '../constants/index.js';

// export const deleteFile = async (oldUrl) => {
//   try {
//     const folderName = 'upload';
//     const urlIndex = oldUrl.indexOf(folderName);
//     const urlEnd = oldUrl.slice(urlIndex + folderName.length);
//     const fileUrl = path.join(UPLOAD_DIR, urlEnd);

//     await fs.unlink(fileUrl);
//   } catch (error) {
//     console.log('File was not delete becaus not found.');
//     return;
//   }
// };
