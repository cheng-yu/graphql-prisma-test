const { ApolloServer } = require('apollo-server');
const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();
let links = [{
    id: 'link-0',
    url: 'www.howtographql.com',
    description: 'Fullstack tutorial for GraphQL'
}]


const resolvers = {
    Query: {
        info: () => `This is the API`,
        feed: async (parent, args, context) => {
            return context.prisma.link.findMany()
        }
    },
    Mutation: {
        post: async (parent, args, context) => {
            const newLink = context.prisma.link.create({
                data: {
                    url: args.url,
                    description: args.description
                }
            })

            return newLink;
        }
    }
}

const server = new ApolloServer({
    typeDefs: fs.readFileSync(
        path.join(__dirname, 'schema.graphql'),
        'utf8'
    ),
    resolvers,
    context: {
        prisma
    }
})

server
    .listen()
    .then(({ url }) => {
        console.log(`Server is running on ${url}`)
    })