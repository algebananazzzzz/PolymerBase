import { v4 as uuid4 } from 'uuid';

const resolvers = {
    Query: {
        getUser: async (_, { id }, contextValue) => {
            // handle get user
            const getParams = {
                key: {
                    id
                },
                other_params: {
                    ProjectionExpression: getProjectionExpression(info, "User")
                }
            };

            return await contextValue.models.DynamoDB.getItem("user", getParams);
        },
        getPost: async (_, { id }, contextValue) => {
            const { userId } = contextValue.user

            // handle get post
            const getParams = {
                key: {
                    id,
                    userId
                },
                other_params: {
                    ProjectionExpression: getProjectionExpression(info, "Post")
                }
            };

            return await contextValue.models.DynamoDB.getItem("post", getParams);
        },
        getPosts: async (_, { userId }, contextValue) => {
            // handle create user
            const queryParams = {
                hash_key: userId,
                other_params: {
                    ProjectionExpression: getProjectionExpression(info, "Post")
                }
            };

            const result = await contextValue.models.DynamoDB.queryItems("post", queryParams);
            return result
        },
        getPostsByDate: async (_, { date }, contextValue) => {
            // handle create user
            const queryParams = {
                index_name: 'date-id',
                hash_key: date,
                other_params: {
                    ProjectionExpression: getProjectionExpression(info, "Post")
                }
            };

            const result = await contextValue.models.DynamoDB.queryItems("post", queryParams);
            return result
        },
        getAllPosts: async (_, __, contextValue) => {
            // handle create user
            const scanParams = {
                other_params: {
                    ProjectionExpression: getProjectionExpression(info, "Post")
                }
            };

            const result = await contextValue.models.DynamoDB.scanItems("post", scanParams);
            return result
        },
    },
};

export default resolvers;