import { ApolloServer } from '@apollo/server';
import { startServerAndCreateNextHandler } from '@as-integrations/next';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { ApolloServerPluginLandingPageGraphQLPlayground } from '@apollo/server-plugin-landing-page-graphql-playground';
import db from '@/lib/firestoreAdmin';
import { Timestamp } from 'firebase-admin/firestore';
import { getUserId } from '@/backsrc/utils';
import * as Query from '@/resolvers/Query';
import * as Mutation from '@/resolvers/Mutation';
//import * as Subscription from '@/resolvers/Subscription';
import * as User from '@/resolvers/User';
import * as Link from '@/resolvers/Link';
import * as Vote from '@/resolvers/Vote';
import fs from 'fs';
import path from 'path';
import type { NextApiRequest, NextApiResponse } from 'next';


const resolvers = {
  Query,
  Mutation,
  //Subscription,
  User,
  Link,
  Vote,
}

const schema = makeExecutableSchema({ 
  typeDefs: fs.readFileSync(
    path.join(process.cwd(), 'backsrc', 'schema.graphql'),
    'utf8'
  ),
  resolvers
});

const server = new ApolloServer({
  schema,
  plugins: [ApolloServerPluginLandingPageGraphQLPlayground()]
})

export default startServerAndCreateNextHandler(server, {
  // @ts-ignore
  context: ( req: NextApiRequest, res: NextApiResponse ) => {
    return {
      req,
      db,
      Timestamp,
      //pubsub,
      userId: 
        req && req.headers.authorization
          ? getUserId(req)
          : null
    };
  },
});

