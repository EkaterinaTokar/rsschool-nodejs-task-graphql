import { GraphQLObjectType, GraphQLEnumType, GraphQLFloat, GraphQLInt, GraphQLList, GraphQLNonNull, GraphQLBoolean, GraphQLString } from 'graphql';
import { PrismaClient } from '@prisma/client/index.js';
import { MemberTypeId } from '../../member-types/schemas.js';
import { UUIDType } from './uuid.js';
import { ResolveTree, parseResolveInfo, simplifyParsedResolveInfoFragmentWithType } from 'graphql-parse-resolve-info';

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
    userId: { type: UUIDType },
    MemberTypeId: { type: GraphQLString },
    memberType: {
      type: MemberType,
      resolve: async (parent: { memberTypeId: string }, _args, { prisma }: Context) => {
        return await prisma.memberType.findUnique({ where: { id: parent.memberTypeId } });
        }
      },
  })
})

const PostType = new GraphQLObjectType({
  name: 'Post',
  fields: () => ({
    id: { type: UUIDType},
    title: { type: GraphQLString },
    content: { type: GraphQLString },
    authorId: { type: UUIDType },
  })
})

const UserType = new GraphQLObjectType({
  name: 'User',
  fields: () => ({
    id: { type: UUIDType},
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
        resolve: async (_parent , { id: MemberTypeId }:{ id: MemberTypeId }, { prisma }: Context) => {
         return await prisma.memberType.findUnique({ where: { id: MemberTypeId  } });
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
       resolve: async (_parent, { id: profileId }: { id: string }, { prisma }: Context) => {
        return await prisma.profile.findUnique({ where: { id: profileId } });
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
       resolve: async (_parent, { id: postId }: { id: string }, { prisma }: Context) => {
        return await prisma.post.findUnique({ where: { id: postId } });
     }
      },
        users: {
      type: new GraphQLList(UserType),
        resolve: async (_parent, _args, { prisma }: Context, info) => {
          const resolveTree = parseResolveInfo(info) as ResolveTree;
        const { fields } = simplifyParsedResolveInfoFragmentWithType(resolveTree, info.returnType);
        const include = {};
            
        if (fields['subscribedToUser']) {
          include['subscribedToUser'] = true;
        }
        if (fields['userSubscribedTo']) {
          include['userSubscribedTo'] = true;
        }
         return await prisma.user.findMany({
            include,
        });
      }
    },
       user: {
       type: UserType as GraphQLObjectType,
       args: { id: { type: new GraphQLNonNull(UUIDType) } },
       resolve: async (_parent, { id: userId }: { id: string }, { prisma }: Context) => {
           return await prisma.user.findUnique({
              where: { id: userId  }
          })
       }},
    }),
});