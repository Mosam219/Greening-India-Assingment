import { z } from 'zod'

import { requiredTextField } from '@/lib/validation/common'

export const createProjectFormSchema = z.object({
  name: requiredTextField('Project name', 120),
  description: z
    .string()
    .trim()
    .max(500, 'Description must be 500 characters or fewer')
    .optional(),
})

export type CreateProjectFormValues = z.infer<typeof createProjectFormSchema>
