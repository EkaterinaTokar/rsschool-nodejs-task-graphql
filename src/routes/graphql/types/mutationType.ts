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
        
    })
});
