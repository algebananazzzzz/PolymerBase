import { ApolloServer } from '@apollo/server';
import { generateTypeDefsAndResolvers, generateServerArgsFile } from './generator.js';
import { startStandaloneServer } from '@apollo/server/standalone';

const serverArgs = await generateTypeDefsAndResolvers(['./src/schema', './src/resolvers'])

console.log(serverArgs.typeDefs.definitions)
async function startApolloServer() {
  const server = new ApolloServer(serverArgs);
  const { url } = await startStandaloneServer(server);
  console.log(`
        🚀  Server is running!
        📭  Query at ${url}
      `);
}

startApolloServer();