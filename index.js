const express = require('express');
const graphqlHTTP = require('express-graphql');
const {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLList,
  GraphQLInputObjectType,
  GraphQLNonNull, //give error for non null
  GraphQLString,
  GraphQLID,
  GraphQLInt,
  GraphQLBoolean
} = require('graphql');
const { getVideoById, getVideos, createVideo} = require('./src/data')
const { globalIdField } = require('graphql-relay');
const { nodeInterface, nodeField } = require('./src/node')

const PORT = process.env.Port || 3000;
const server = express();

const videoType = new GraphQLObjectType({
  name: 'Video',
  description: 'A video in egghead',
  fields: {
    id: globalIdField(),
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
    node: nodeField,
    videos: {
      type: new GraphQLList(videoType),
      resolve: getVideos,
    },
    video: {
      type: videoType,
      args: {
        id: {
          type: new GraphQLNonNull(GraphQLID),
          description: 'The id of the video'
        }
      },
      resolve: (_, args) => {
        return getVideoById(args.id);
      }
    }
  }
})

const videoInputType = new GraphQLInputObjectType({
  name: 'VideoInput',
  fields: {
    title: {
      type: new GraphQLNonNull(GraphQLString),
      description: 'The title of the video'
    },
    duration: {
      type: new GraphQLNonNull(GraphQLInt),
      description: 'The duration of the video'
    },
    released: {
      type: new GraphQLNonNull(GraphQLBoolean),
      description: 'Wheter or not the video is released'
    }
  },
  interfaces: [nodeInterface],
})

exports.videoType = videoType;

const mutationType = new GraphQLObjectType({
  name: 'Mutation',
  description: 'The root Mutation type',
  fields: {
    createVideo: {
      type: videoType,
      args: {
        video: {
          type: new GraphQLNonNull(videoInputType)
        }
      },
      resolve: (_, args) => {
        return createVideo(args.video);
      }
    }
  }
})

const schema = new GraphQLSchema({
  query: queryType,
  mutation: mutationType
})

  server.use('/graphql', graphqlHTTP({
    schema,
    graphiql: true,
  }))

  server.listen(PORT, () => {
    console.log(`Listening on http://localhost:${PORT}`)
  })