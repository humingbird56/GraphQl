const express = require('express');
const graphqlHTTP = require('express-graphql');
const {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLString,
  GraphQLID,
  GraphQLInt,
  GraphQLBoolean
} = require('graphql');
const { getVideoById } = require('./src/data')

const PORT = process.env.Port || 3000;
const server = express();

const videoType = new GraphQLObjectType({
  name: 'Video',
  description: 'A video in egghead',
  fields: {
    id: {
      type: GraphQLID,
      description: 'The id of the video'
    },
    title: {
      type: GraphQLString,
      description: 'The title of the video'
    },
    duration: {
      type: GraphQLInt,
      description: 'The duration of the video'
    },
    watched: {
      type: GraphQLBoolean,
      description: 'Wheter or not the viewer has watched the video'
    }
  }
})
const queryType = new GraphQLObjectType({
  name: 'QueryType',
  description: 'The Root query type',
  fields: {
    video: {
      type: videoType,
      args: {
        id: {
          type: GraphQLID,
          description: 'The id of the video'
        }
      },
      resolve: (_, args) => {
        return getVideoById(args.id);
      }
    }
  }
})
const schema = new GraphQLSchema({
  query: queryType,
})

  server.use('/graphql', graphqlHTTP({
    schema,
    graphiql: true,
  }))

  server.listen(PORT, () => {
    console.log(`Listening on http://localhost:${PORT}`)
  })