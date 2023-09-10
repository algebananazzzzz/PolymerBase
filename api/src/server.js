import { ApolloServer } from '@apollo/server';
import { startServerAndCreateLambdaHandler, handlers } from '@as-integrations/aws-lambda';
import ServerArgs from './serverargs.js'


const server = new ApolloServer(ServerArgs);

export const graphqlHandler = startServerAndCreateLambdaHandler(server,
    handlers.createAPIGatewayProxyEventRequestHandler(),
    {
        middleware: [
            async (event) => {
                console.log(JSON.stringify(event))
            }
        ],
    }
);