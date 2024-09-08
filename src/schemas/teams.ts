import { z } from 'zod';

export const teamDetailSchema = z.object({
  name: z.string(),
  project: z.string(),
  track: z.string(),
  scores: z.number(),
});

export type teamDetailType = z.infer<typeof teamDetailSchema>;
