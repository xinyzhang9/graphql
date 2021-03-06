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
  GraphQLInputObjectType,
} = require('graphql');
const PORT = process.env.PORT || 3000;
const server = express();

const { getVideoById, getVideos, createVideo } = require('./src/data');
const { globalIdField } = require('graphql-relay');
const { nodeInterface, nodeField } = require('./src/node');

const videoType = new GraphQLObjectType({
  name: 'Video',
  description: 'a video on YouTube.',
  fields: {
    id: globalIdField(),
    title: {
      type: GraphQLString,
      description: 'The title of the video.',
    },
    duration: {
      type: GraphQLInt,
      description: 'The duration of the video.',
    },
    released: {
      type: GraphQLBoolean,
      description: 'Whether the video has been released.',
    },
  },
  interfaces: [nodeInterface],
});

exports.videoType = videoType;

const videotypeInputType = new GraphQLInputObjectType({
  name: 'VideoInput',
  fields: {
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
  }
})

const queryType = new GraphQLObjectType({
  name: 'QueryType',
  description: 'The root of query type.',
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
        video: {
          type: new GraphQLNonNull(videotypeInputType),
        },
      },
      resolve: (_, args) => {
        return createVideo(args.video);
      }
    }
  }
})

const schema = new GraphQLSchema({
  query: queryType,
  mutation: mutationType,
})


server.use('/graphql',graphqlHTTP({
  schema,
  graphiql: true,

}))

server.listen(PORT, ()=>{
  console.log(`listening to http://localhost:${PORT}`);
})
