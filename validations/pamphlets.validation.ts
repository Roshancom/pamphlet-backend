import z from 'zod';

export const pamphletSchema = z.object({
  title: z.string().nonempty('Title is required'),
  short_description: z
    .string()
    .min(5, 'Short description is required')
    .optional(),
  category: z.string().nonempty('Category is required'),
  location: z.string().nonempty('Location is required'),
  thumbnail_image: z.string().optional(),
  url_key: z.string().nonempty('URL Key is required'),
});
