import { GraphQLObjectType, GraphQLList, GraphQLNonNull } from 'graphql';
import { PrismaClient } from '@prisma/client/index.js';
import { MemberType, MemberTypeIdType } from '../types/member.js';
import { ProfileType } from '../types/profile.js';
import { PostType } from '../types/post.js';
import { UserType } from '../types/user.js';
import { UUIDType } from './uuid.js';
import { ResolveTree, parseResolveInfo, simplifyParsedResolveInfoFragmentWithType } from 'graphql-parse-resolve-info';

export type Context = {
    prisma: PrismaClient
}

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
        resolve: async (_parent , { id }: { id: string }, { prisma }: Context) => {
         return await prisma.memberType.findUnique({ where: { id  } });
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
