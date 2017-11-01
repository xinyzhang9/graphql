'use strict';

const express = require('express');
const graphqlHTTP = require('express-graphql');
const {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLID,
  GraphQLString,
  GraphQLInt,
  GraphQLBoolean,
  GraphQLNonNull,
  GraphQLList,
} = require('graphql');
const PORT = process.env.PORT || 3000;
const server = express();

const { getVideoById, getVideos, createVideo } = require('./src/data');
const videoType = new GraphQLObjectType({
  name: 'Video',
  description: 'a video on YouTube.',
  fields: {
    id: {
      type: GraphQLID,
      description: 'The id of the video.',
    },
    title: {
      type: GraphQLString,
      description: 'The title of the video.',
    },
    duration: {
      type: GraphQLInt,
      description: 'The duration of the video.',
    },
    watched: {
      type: GraphQLBoolean,
      description: 'Whether the viewer has watched the video.',
    },
  },
});

const queryType = new GraphQLObjectType({
  name: 'QueryType',
  description: 'The root of query type.',
  fields: {
    videos: {
      type: new GraphQLList(videoType),
      resolve: getVideos,
    },
    video: {
      type: videoType,
      args: {
        id: {
          type: new GraphQLNonNull(GraphQLID),
          description: 'The id of the video.'
        },
      },
      resolve: (_, args) => {
        return getVideoById(args.id);
      },
    },
  },
});

const mutationType = new GraphQLObjectType({
  name: 'Mutation',
  description: 'The root mutation type.',
  fields: {
    createVideo: {
      type: videoType,
      args: {
        title: {
          type: new GraphQLNonNull(GraphQLString),
          description: 'The title of the video.',
        },
        duration: {
          type: new GraphQLNonNull(GraphQLInt),
          description: 'The duration of the video.',
        },
        released: {
          type: new GraphQLNonNull(GraphQLBoolean),
          description: 'Whether or not the video is released',
        },
      },
      resolve: (_, args) => {
        return createVideo(args);
      }
    }
  }
})

const schema = new GraphQLSchema({
  query: queryType,
  mutation: mutationType,
})

const resolvers = {
  video: () => ({
    id: '1',
    title: 'bar',
    duration: 180,
    watched: true,
  }),
  videos: () => videos,
};

server.use('/graphql',graphqlHTTP({
  schema,
  graphiql: true,
  rootValue: resolvers,

}))

server.listen(PORT, ()=>{
  console.log(`listening to http://localhost:${PORT}`);
})
