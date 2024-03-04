import { GraphQLObjectType, GraphQLEnumType, GraphQLFloat, GraphQLInt } from 'graphql';
import { MemberTypeId } from '../../member-types/schemas.js';

export const MemberTypeIdType = new GraphQLEnumType({
    name: 'MemberTypeId',
    values: {
        [MemberTypeId.BASIC]: {
            value: MemberTypeId.BASIC,
        },
        [MemberTypeId.BUSINESS]: {
            value: MemberTypeId.BUSINESS,
        },
    },
});

export const MemberType = new GraphQLObjectType({
    name: 'MemberType',
    fields: () => ({
        id: { type: MemberTypeIdType },
        discount: { type: GraphQLFloat },
        postsLimitPerMonth: { type: GraphQLInt },
    })
});