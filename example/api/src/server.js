import { ApolloServer } from '@apollo/server';
import { startServerAndCreateLambdaHandler, handlers } from '@as-integrations/aws-lambda';
import DynamoDBModel from "./models/DynamoDBModel.js"
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { CognitoIdentityProviderClient, GetUserCommand } from "@aws-sdk/client-cognito-identity-provider";
import { GraphQLError } from 'graphql';
import ServerArgs from './serverargs.js'

const config = CONFIG
const dynamodbClient = new DynamoDBClient()
const cognitoClient = new CognitoIdentityProviderClient()
const model = new DynamoDBModel(config.dynamodb, dynamodbClient)

const server = new ApolloServer(ServerArgs);

export const graphqlHandler = startServerAndCreateLambdaHandler(server,
    handlers.createAPIGatewayProxyEventRequestHandler(),
    {
        middleware: [
            async (event) => {
                console.log(JSON.stringify(event))
            }
        ],
        context: async ({ event }) => {
            const { Authorization } = event.headers;
            if (!Authorization || !Authorization.startsWith('Bearer ')) {
                throw new GraphQLError('Authorization header not present or malformed', {
                    extensions: {
                        code: 'UNAUTHENTICATED',
                        http: { status: 401 },
                    },
                });
            }

            const token = Authorization.replace('Bearer ', '');
            const getUserCommand = new GetUserCommand({ AccessToken: token });

            let user;

            await cognitoClient.send(getUserCommand)
                .then((response) => {
                    user = {
                        userId: response.UserAttributes.sub
                    }
                })
                .catch((error) => {
                    if (error.name === "NotAuthorizedException") {
                        throw new GraphQLError('User is not authenticated', {
                            extensions: {
                                code: 'UNAUTHENTICATED',
                                http: { status: 401 },
                            },
                        });

                    } else {
                        console.error("An unexpected error occured:", error);
                        throw new GraphQLError('Error authenticating user', {
                            extensions: {
                                code: 'INTERNAL SERVER ERROR',
                                http: { status: 500 },
                            },
                        });
                    }
                });

            return {
                user,
                production: false,
                models: {
                    DynamoDB: model,
                },
                config: {
                    S3DataBucket: config.s3.data_bucket.name
                }
            };
        }
    }
);