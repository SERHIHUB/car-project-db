import { v2 as cloudinary } from 'cloudinary';

export const deleteCloudinaryFile = async (fileUrl) => {
  const lastSlashIndex = fileUrl.lastIndexOf('/');
  const lastPointIndex = fileUrl.lastIndexOf('.');
  const publicId = fileUrl.slice(lastSlashIndex + 1, lastPointIndex);

  await cloudinary.uploader.destroy(publicId);
};
