import { z } from 'zod';

export const teamDetailSchema = z.object({
  name: z.string(),
  project: z.string(),
  track: z.string(),
  scores: z.number(),
});

export type teamDetailType = z.infer<typeof teamDetailSchema>;

export const hackathonScoreMetricSchema = z.object({
  title: z.string(),
  description: z.string(),
  type: z.string(),
  options: z.string(),
});
export const createRoundSchema = z.object({
  title: z.string(),
  // index: z.number(),
  // isIdeation: z.boolean(),
  startTime: z.string().refine(val => !isNaN(new Date(val).getTime()), {
    message: 'Invalid datetime format',
  }),
  endTime: z.string().refine(val => !isNaN(new Date(val).getTime()), {
    message: 'Invalid datetime format',
  }),
  judgingStartTime: z.string().refine(val => !isNaN(new Date(val).getTime()), {
    message: 'Invalid datetime format',
  }),
  judgingEndTime: z.string().refine(val => !isNaN(new Date(val).getTime()), {
    message: 'Invalid datetime format',
  }),
  // metrics: z.array(hackathonScoreMetricSchema),
});

export type createRoundType = z.infer<typeof createRoundSchema>;
