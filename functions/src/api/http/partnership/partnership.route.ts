import { FastifyInstance } from "fastify";
import { addPartnership, getPartnerships } from "../../../services/partnership";
import { $partnershipSchemaRef, partnershipSchemas } from "./partnership.schema";
import { PartnershipAddRequestBody } from "../../../models/partnership.types";

const prefix = "/partnership";

const partnershipRoutes = async (fastify: FastifyInstance) => {
    for (const schema of partnershipSchemas) {
        fastify.addSchema(schema);
      }
  
    fastify.get(
        prefix,
        {
            schema: {
                response: {
                    200: $partnershipSchemaRef("partnershipsListSchema"),
                }
            },
        },
        async (request, reply) => {
            const partnerships = await getPartnerships();
            return reply.send(partnerships);
        }
    );

    fastify.post(
        prefix,
        {
            schema: {
                body: $partnershipSchemaRef("partnershipAddBodySchema"),
                response: {
                    201: $partnershipSchemaRef("partnershipSchema"),
                }
            },
        },
        async (request, reply) => {
            const addRequest = request.body as PartnershipAddRequestBody;
            const partnerships = await addPartnership(addRequest);
            
            return reply.send(partnerships);
        }
    );
};

export default partnershipRoutes;