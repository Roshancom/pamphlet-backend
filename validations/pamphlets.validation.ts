import z from 'zod';

const locationSchema = z
  .union([
    z.string().trim().min(1, 'Location is required'),
    z.object({
      city: z.string().trim().min(1, 'Location city is required'),
      latitude: z.coerce
        .number({ message: 'Location latitude must be a number' })
        .optional(),
      longitude: z.coerce
        .number({ message: 'Location longitude must be a number' })
        .optional(),
    }),
  ])
  .transform((value) =>
    typeof value === 'string' ? value : JSON.stringify(value),
  );

export const pamphletSchema = z.object({
  title: z.string().nonempty('Title is required'),
  short_description: z.string().optional(),
  category: z.string().nonempty('Category is required'),
  location: locationSchema,
  thumbnail_image: z.string().optional(),
  url_key: z.string().nonempty('URL Key is required'),
});
