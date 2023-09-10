import { ApolloServer } from '@apollo/server';
import DynamoDBModel from "./models/DynamoDBModel.js"
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { CognitoIdentityProviderClient, GetUserCommand } from "@aws-sdk/client-cognito-identity-provider";
import { generateTypeDefsAndResolvers } from './generator.js';
import { startStandaloneServer } from '@apollo/server/standalone';
import { GraphQLError } from 'graphql';
import { readFileSync } from 'fs'

const config = JSON.parse(readFileSync("./src/app_config.json"))
const dynamodbClient = new DynamoDBClient()
const cognitoClient = new CognitoIdentityProviderClient()
const model = new DynamoDBModel(config.dynamodb, dynamodbClient)

const serverArgs = await generateTypeDefsAndResolvers(['./src/schema', './src/resolvers'])

async function startApolloServer() {
    const server = new ApolloServer(serverArgs);
    const { url } = await startStandaloneServer(server, {
        context: async ({ req }) => {
            if (req.body.operationName !== 'IntrospectionQuery') {
                const token = req.headers.Authorization.replace('Bearer ', '') || '';
                const getUserCommand = new GetUserCommand({
                    AccessToken: token,
                });
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
            };
        },
    });
    console.log(`
        🚀  Server is running!
        📭  Query at ${url}
      `);
}

startApolloServer();