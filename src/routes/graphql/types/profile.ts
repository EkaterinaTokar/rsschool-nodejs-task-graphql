import { GraphQLObjectType, GraphQLInt, GraphQLBoolean, GraphQLString, GraphQLInputObjectType } from 'graphql'; 
import { UUIDType } from './uuid.js';
import { MemberType, MemberTypeIdType } from '../types/member.js';
import { Context } from './queryType.js';

export const ProfileType = new GraphQLObjectType({
    name: 'Profile',
    fields: () => ({
        id: { type: UUIDType },
        isMale: { type: GraphQLBoolean },
        yearOfBirth: { type: GraphQLInt },
        userId: { type: UUIDType },
        MemberTypeId: { type: GraphQLString },
        memberType: {
            type: MemberType,
            resolve: async (parent: { memberTypeId: string }, _args, { prisma }: Context) => {
                return await prisma.memberType.findUnique({ where: { id: parent.memberTypeId } });
            }
        },
    })
});

export interface CreateProfileInput {
    isMale: boolean;
    yearOfBirth: number;
    memberTypeId: string;
    userId: string;
}


export const CreateProfileInputType = new GraphQLInputObjectType({
    name: 'CreateProfileInput',
    fields: () => ({
        isMale: { type: GraphQLBoolean },
        yearOfBirth: { type: GraphQLInt },
        memberTypeId: { type: MemberTypeIdType },
        userId: { type: UUIDType }
    })
});

export interface ChangeProfileInput {
    isMale: boolean;
    yearOfBirth: number;
    memberTypeId: string;
}

export const ChangeProfileInputType = new GraphQLInputObjectType({
    name: 'ChangeProfileInput',
    fields: () => ({
        isMale: { type: GraphQLBoolean },
        yearOfBirth: { type: GraphQLInt },
        memberTypeId: { type: MemberTypeIdType }
    })
});
