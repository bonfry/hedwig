import { z } from "zod";
import { buildJsonSchemas } from "fastify-zod";


const partnerSchema = z.object({
    id: z.string(),
    name: z.string(),
    logo: z.string(),
    position: z.number(),
    link: z.string(),
})

const partnershipSchema = z.object({
    id: z.string(),
    name: z.string(),
    position: z.number(),
    partners: z.array(partnerSchema),
})

const partnershipsListSchema = z.array(partnershipSchema);

const partnershipAddBodySchema = z.object({
    name: z.string(),
    position: z.number().optional(),
})

export const { schemas: partnershipSchemas, $ref: $partnershipSchemaRef } = buildJsonSchemas(
    {
        partnershipsListSchema,
        partnershipSchema,
        partnershipAddBodySchema,
    },
    {
        $id: "PartnershipSchema"
    },
);
