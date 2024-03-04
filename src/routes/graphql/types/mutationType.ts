import { GraphQLObjectType, GraphQLNonNull, GraphQLBoolean } from 'graphql';
import { PrismaClient } from '@prisma/client/index.js';
import { UUIDType } from './uuid.js';
import { ProfileType, CreateProfileInputType, ChangeProfileInputType, CreateProfileInput, ChangeProfileInput} from '../types/profile.js';
import { PostType, CreatePostInputType, ChangePostInputType, CreatePostInput, ChangePostInput } from '../types/post.js';
import { UserType, CreateUserInputType, ChangeUserInputType, CreateUserInput, ChangeUserInput } from '../types/user.js';

export type Context = {
    prisma: PrismaClient
}


export const mutationType = new GraphQLObjectType({
    name: 'Mutation',
    fields: () => ({
        createPost: {
            type: PostType,
            args: {
                dto: { type: new GraphQLNonNull(CreatePostInputType) }
            },
            resolve: async (_parent, { dto }: { dto: CreatePostInput }, { prisma }: Context) => {
                return await prisma.post.create({
                    data: dto
                });
            }
        },
        createUser: {
            type: UserType as GraphQLObjectType,
            args: {
                dto: { type: new GraphQLNonNull(CreateUserInputType) }
            },
            resolve: async (_parent, { dto }: { dto: CreateUserInput }, { prisma }: Context) => {
                return prisma.user.create({
                    data: dto
                });
            }
        },
        createProfile: {
            type: ProfileType,
            args: {
                dto: { type: new GraphQLNonNull(CreateProfileInputType) }
            },
            resolve: async (_parent, { dto }: { dto: CreateProfileInput }, { prisma }: Context) => {
                return await prisma.profile.create({
                    data: dto 
                });
            }
        },
        changePost: {
            type: PostType,
            args: {
                id: { type: new GraphQLNonNull(UUIDType) },
                dto: { type: new GraphQLNonNull(ChangePostInputType) }
            },
            resolve: async (_parent, { id, dto }: { id: string, dto: ChangePostInput }, { prisma }: Context) => {
                return await prisma.post.update({
                    where: { id },
                    data: dto
                });
            }
        },
        changeUser: {
            type: UserType as GraphQLObjectType,
            args: {
                id: { type: new GraphQLNonNull(UUIDType) },
                dto: { type: new GraphQLNonNull(ChangeUserInputType) }
            },
            resolve: async (_parent, { id, dto }: { id: string, dto: ChangeUserInput }, { prisma }: Context) => {
                return await prisma.user.update({
                    where: { id },
                    data: dto
                });
            }
        },
        changeProfile: {
            type: ProfileType,
            args: {
                id: { type: new GraphQLNonNull(UUIDType) },
                dto: { type: new GraphQLNonNull(ChangeProfileInputType) }
            },
            resolve: async (_parent, { id, dto }: { id: string, dto: ChangeProfileInput }, { prisma }: Context) => {
                return await prisma.profile.update({
                    where: { id },
                    data: dto
                });
            }
        },
        deletePost: {
            type: GraphQLBoolean,
            args: {
                id: { type: new GraphQLNonNull(UUIDType) }
            },
            resolve: async (_parent, { id: postId }: { id: string }, { prisma }: Context) => {
                try {
                    await prisma.post.delete({
                        where: { id: postId }
                    });
                    return true;
                } catch (error) {
                    return false;
                }
            }
        },
        deleteUser: {
            type: GraphQLBoolean,
            args: {
                id: { type: new GraphQLNonNull(UUIDType) }
            },
            resolve: async (_parent, { id: userId }: { id: string }, { prisma }: Context) => {
                try {
                    await prisma.user.delete({
                        where: { id: userId }
                    });
                    return true;
                } catch (error) {
                    return false;
                }
            }
        },
        deleteProfile: {
            type: GraphQLBoolean,
            args: {
                id: { type: new GraphQLNonNull(UUIDType) }
            },
            resolve: async (_parent, { id: profileId }: { id: string }, { prisma }: Context) => {
                try {
                    await prisma.profile.delete({
                        where: { id: profileId }
                    });
                    return true;
                } catch (error) {
                    return false;
                }
            }
        },
        subscribeTo: {
            type: new GraphQLNonNull(UserType),
            args: {
                userId: { type: new GraphQLNonNull(UUIDType) },
                authorId: { type: new GraphQLNonNull(UUIDType) },
            },
            resolve: async (
                _parent,
                { userId, authorId }: { userId: string; authorId: string },
                context: Context,
            ) => {
                await context.prisma.subscribersOnAuthors.create({
                    data: {
                        subscriberId: userId,
                        authorId: authorId,
                    },
                });

                return context.prisma.user.findUnique({ where: { id: userId } });
            },
        },
        unsubscribeFrom: {
            type: GraphQLBoolean,
            args: {
                userId: { type: new GraphQLNonNull(UUIDType) },
                authorId: { type: new GraphQLNonNull(UUIDType) },
            },
            resolve: async (
                _source,
                { userId, authorId }: { userId: string; authorId: string },
                context: Context,
            ) => {
                await context.prisma.subscribersOnAuthors.delete({
                    where: {
                        subscriberId_authorId: {
                            subscriberId: userId,
                            authorId: authorId,
                        },
                    },
                });
                return true;
            },
        }
    })
});
