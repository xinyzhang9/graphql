'use strict';

const express = require('express');
const graphqlHTTP = require('express-graphql');
const {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLID,
  GraphQLString,
  GraphQLInt,
  GraphQLBoolean
} = require('graphql');
const PORT = process.env.PORT || 3000;
const server = express();

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
    video: {
      type: videoType,
      resolve: () => new Promise((resolve) => {
        resolve({
          id: 'a',
          title: 'GraphQL',
          duration: 180,
          watched: false,
        });
      }),
    },
  },
});

const schema = new GraphQLSchema({
  query: queryType,
})

const videoA = {
  id: '1',
  title: 'videoA',
  duration: 100,
  watched: true
}

const videoB = {
  id: '2',
  title: 'videoB',
  duration: 200,
  watched: false
}

const videos = [videoA, videoB];

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
