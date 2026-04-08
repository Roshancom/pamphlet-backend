import { NextFunction, Request, Response } from 'express';
import multer, { MulterError } from 'multer';
import { BadRequestException } from '../types/errors.js';

const storage = multer.diskStorage({
  destination: 'uploads/',
  filename: (_req, file, cb) => {
    const safeOriginalName = file.originalname.replace(/[^a-zA-Z0-9._-]/g, '_');
    cb(null, `${Date.now()}-${safeOriginalName}`);
  },
});

const imageFileFilter: multer.Options['fileFilter'] = (_req, file, cb) => {
  if (!file.mimetype.startsWith('image/')) {
    cb(
      new BadRequestException('Only image files are allowed for field "image"'),
    );
    return;
  }

  cb(null, true);
};

export const upload = multer({
  storage,
  fileFilter: imageFileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024,
    files: 1,
  },
});

const stripScriptTags = (value: string): string => {
  return value
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .trim();
};

const parseJsonIfNeeded = (value: unknown, fieldName: string): unknown => {
  if (typeof value !== 'string') {
    return value;
  }

  const trimmed = value.trim();
  if (!trimmed) {
    return trimmed;
  }

  const looksLikeJson =
    (trimmed.startsWith('{') && trimmed.endsWith('}')) ||
    (trimmed.startsWith('[') && trimmed.endsWith(']'));

  if (!looksLikeJson) {
    return stripScriptTags(trimmed);
  }

  try {
    return JSON.parse(trimmed);
  } catch {
    throw new BadRequestException(
      `Invalid JSON format in field "${fieldName}"`,
    );
  }
};

export const normalizePamphletMultipartBody = (
  req: Request,
  _res: Response,
  next: NextFunction,
) => {
  try {
    const body = req.body as Record<string, unknown>;

    body.title =
      typeof body.title === 'string' ? stripScriptTags(body.title) : body.title;
    body.short_description =
      typeof body.short_description === 'string'
        ? stripScriptTags(body.short_description)
        : body.short_description;
    body.category =
      typeof body.category === 'string'
        ? stripScriptTags(body.category)
        : body.category;
    body.url_key =
      typeof body.url_key === 'string'
        ? stripScriptTags(body.url_key)
        : body.url_key;

    body.location = parseJsonIfNeeded(body.location, 'location');

    if (
      body.location &&
      typeof body.location === 'object' &&
      !Array.isArray(body.location)
    ) {
      const location = body.location as Record<string, unknown>;

      if (typeof location.address === 'string') {
        location.address = stripScriptTags(location.address);
      }

      if (
        typeof location.latitude === 'string' &&
        location.latitude.trim() !== ''
      ) {
        location.latitude = Number(location.latitude);
      }

      if (
        typeof location.longitude === 'string' &&
        location.longitude.trim() !== ''
      ) {
        location.longitude = Number(location.longitude);
      }
    }

    next();
  } catch (error) {
    next(error);
  }
};

export const handleUploadErrors = (
  err: Error,
  _req: Request,
  _res: Response,
  next: NextFunction,
) => {
  if (err instanceof MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      next(new BadRequestException('Image file size must not exceed 5MB'));
      return;
    }

    next(new BadRequestException(err.message));
    return;
  }

  next(err);
};
