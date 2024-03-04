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
            resolve: async (parent, { dto }: { dto: CreatePostInput }, { prisma }: Context) => {
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
            resolve: async (parent, { dto }: { dto: CreateUserInput }, { prisma }: Context) => {
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
            resolve: async (parent, { dto }: { dto: CreateProfileInput }, { prisma }: Context) => {
                console.log("createProfile", dto);
                return await prisma.profile.create({
                    data: { ...dto }
                });
            }
        },
    })
});
