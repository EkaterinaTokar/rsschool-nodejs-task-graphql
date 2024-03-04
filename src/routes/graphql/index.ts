import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox';
import { createGqlResponseSchema, gqlResponseSchema } from './schemas.js';
import { graphql, GraphQLSchema } from 'graphql';
import { queryType } from './types/queryType.js';
import { mutationType } from './types/mutationType.js';


const plugin: FastifyPluginAsyncTypebox = async (fastify) => {
  const { prisma } = fastify;
  fastify.route({
    url: '/',
    method: 'POST',
    schema: {
      ...createGqlResponseSchema,
      response: {
        200: gqlResponseSchema,
      },
    },
    async handler(req) {
     const query = req.body.query;
      const variables = req.body.variables;
      
     const result = await graphql({
        schema,
        source: query,
        variableValues: variables,
        contextValue: { prisma },
     });
      return result;
    },
  });
};

export const schema = new GraphQLSchema({
  query: queryType,
  mutation: mutationType,
});

export default plugin;
