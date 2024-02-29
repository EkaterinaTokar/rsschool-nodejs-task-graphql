import { GraphQLObjectType, GraphQLEnumType, GraphQLFloat, GraphQLInt, GraphQLList, GraphQLNonNull, GraphQLBoolean, GraphQLString } from 'graphql';
import { PrismaClient } from '@prisma/client';
import { MemberTypeId } from '../../member-types/schemas.js';
import { UUIDType } from './uuid.js';

export type Context = {
    prisma: PrismaClient
}

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

const MemberType = new GraphQLObjectType({
  name: 'MemberType',
  fields: () => ({
    id: { type: MemberTypeIdType},
    discount:{ type: GraphQLFloat },
    postsLimitPerMonth: { type: GraphQLInt },
    
  })
})

const ProfileType = new GraphQLObjectType({
  name: 'Profile',
  fields: () => ({
    id: { type: UUIDType},
    isMale: { type: GraphQLBoolean },
    yearOfBirth: { type: GraphQLInt },
    userId: { type: UUIDType},
    memberTypeId: { type: MemberTypeIdType }
  })
})

const PostType = new GraphQLObjectType({
  name: 'Post',
  fields: () => ({
    id: { type: UUIDType},
    title: { type: GraphQLString },
    content: { type: GraphQLString },
    authorId: { type: UUIDType},
  })
})

const UserType = new GraphQLObjectType({
  name: 'User',
  fields: () => ({
    id: { type: UUIDType},
    name: { type: GraphQLString },
    balance: { type: GraphQLInt },
  })
})



export const queryType = new GraphQLObjectType({
  name: 'Query',
  fields: () => ({
    memberTypes: {
      type: new GraphQLList(MemberType),
      resolve: async (_parent, _args, { prisma }: Context) => {
        return await prisma.memberType.findMany();
      }
    },
    memberType: {
      type: MemberType,
      args: { id: { type: new GraphQLNonNull(MemberTypeIdType) } },
        resolve: async (_parent, { id }:{ id: string}, { prisma }: Context) => {
         return await prisma.memberType.findUnique({ where: { id } });
        }
      },
      profiles: {
      type: new GraphQLList(ProfileType),
      resolve: async (_parent, _args, { prisma }: Context) => {
        return await prisma.profile.findMany();
      }
    },
       profile: {
       type: ProfileType,
       args: { id: { type: new GraphQLNonNull(UUIDType) } },
       resolve: async (_parent, { id }: { id: string }, { prisma }: Context) => {
        return await prisma.profile.findUnique({ where: { id } });
     }
      },
        posts: {
      type: new GraphQLList(PostType),
      resolve: async (_parent, _args, { prisma }: Context) => {
        return await prisma.post.findMany();
      }
    },
       post: {
       type: PostType,
       args: { id: { type: new GraphQLNonNull(UUIDType) } },
       resolve: async (_parent, { id }: { id: string }, { prisma }: Context) => {
        return await prisma.post.findUnique({ where: { id } });
     }
      },
        users: {
      type: new GraphQLList(UserType),
      resolve: async (_parent, _args, { prisma }: Context) => {
        return await prisma.user.findMany();
      }
    },
       user: {
       type: UserType,
       args: { id: { type: new GraphQLNonNull(UUIDType) } },
       resolve: async (_parent, { id }: { id: string }, { prisma }: Context) => {
        return await prisma.user.findUnique({ where: { id } });
     }
    },
    }),
});