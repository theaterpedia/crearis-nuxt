import { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  overwrite: true,
  schema: [
    {
      'https://dev.dasei.eu/graphql/vsf': {
      },
    },
  ],
  config: {
    preResolveTypes: true,
    avoidOptionals: true
  },
  ignoreNoDocuments: true,
  generates: {
    './graphql/gql/': {
      documents: ['graphql/**/*.tsx'],
      preset: 'client',
      config: {
        preResolveTypes: true,
        avoidOptionals: true
      }
    },

  },
};

export default config;
