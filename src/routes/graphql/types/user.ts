import { GraphQLObjectType, GraphQLFloat, GraphQLList, GraphQLString, GraphQLInputObjectType } from 'graphql';
import { ProfileType } from '../types/profile.js';
import { PostType } from '../types/post.js';
import { UUIDType } from './uuid.js';
import { Context } from './queryType.js';


export const UserType = new GraphQLObjectType({
    name: 'User',
    fields: () => ({
        id: { type: UUIDType },
        name: { type: GraphQLString },
        balance: { type: GraphQLFloat },
        profile: {
            type: ProfileType,
            resolve: async (parent: { id: string }, _args, { prisma }: Context) => {
                return await prisma.profile.findUnique({ where: { userId: parent.id } });
            },
        },
        posts: {
            type: new GraphQLList(PostType),
            resolve: async (parent: { id: string }, _args, { prisma }: Context) => {
                return await prisma.post.findMany({ where: { authorId: parent.id } });
            }
        },
        userSubscribedTo: {
            type: new GraphQLList(UserType),
            resolve: async (parent: { id: string }, _args, { prisma }: Context) => {
                return await prisma.user.findMany({
                    where: {
                        subscribedToUser: {
                            some: {
                                subscriberId: parent.id
                            }
                        }
                    }
                });
            },
        },
        subscribedToUser: {
            type: new GraphQLList(UserType),
            resolve: async (parent: { id: string }, _args, { prisma }: Context) => {
                return await prisma.user.findMany({
                    where: {
                        userSubscribedTo: {
                            some: {
                                authorId: parent.id
                            }
                        }
                    }
                });
            },
        },
    })
});

export interface CreateUserInput {
    name: string;
    balance: number;
}

export const CreateUserInputType = new GraphQLInputObjectType({
    name: 'CreateUserInput',
    fields: () => ({
        name: { type: GraphQLString },
        balance: { type: GraphQLFloat },
    })
});

export interface ChangeUserInput {
    name: string;
    balance: number;
}

export const ChangeUserInputType = new GraphQLInputObjectType({
    name: 'ChangeUserInput',
    fields: () => ({
        name: { type: GraphQLString },
        balance: { type: GraphQLFloat },
    })
});
