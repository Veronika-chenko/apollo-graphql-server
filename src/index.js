const { ApolloServer, PubSub  } = require('apollo-server');
const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');
const Query = require('./resolvers/Query');
const Mutation = require('./resolvers/Mutation');
const User = require('./resolvers/User');
const Link = require('./resolvers/Link');
const Subscription = require('./resolvers/Subscription')
const { getUserId } = require('./utils');

const prisma = new PrismaClient();
const pubsub = new PubSub();

// 2
const resolvers = {
    Query,
    Mutation,
    Subscription,
    User,
    Link
}

const typeDefs = fs.readFileSync(
    path.join(__dirname, 'schema.graphql'),
    'utf8'
);

// 3
const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({req}) => ({
        ...req,
        prisma,
        pubsub,
        userId:
        req && req.headers.authorization 
            ? getUserId(req) 
            : null
    })
})

server
  .listen()
  .then(({ url }) =>
    console.log(`Server is running on ${url}`)
  );