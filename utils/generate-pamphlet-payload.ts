import { Request } from 'express';

export const generatePamphletPayload = (req: Request) => {
  return {
    ...req.body,
    thumbnail_image: req.file
      ? `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`
      : req.body.thumbnail_image,
  };
};
