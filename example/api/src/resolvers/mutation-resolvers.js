import { GraphQLError } from 'graphql';
import { v4 as uuid4 } from 'uuid';

const resolvers = {
    Mutation: {
        createUser: async (_, { name, email }, contextValue) => {
            // handle create user
            const userObject = {
                id: uuid4(),
                name: name,
                email: email
            }

            await contextValue.models.DynamoDB.createItem("user", userObject)

            return userObject
        },
        updateUser: async (_, { id, ...updates }, contextValue) => {
            // handle update user
            if (!updates) {
                throw new GraphQLError(`Missing update parameters: must include a field to update`, {
                    extensions: {
                        code: 'BAD REQUEST',
                        http: { status: 400 },
                    },
                });
            }

            const updateParams = {
                key: { id },
                updates: updates,
                other_params: {
                    ProjectionExpression: getProjectionExpression(info, "User"),
                    ReturnValues: 'ALL_NEW'
                }
            }

            return await contextValue.models.DynamoDB.updateItem("user", updateParams);
        },
        deleteUser: async (_, { id }, contextValue) => {
            // handle delete user
            await contextValue.models.DynamoDB.deleteItem("user", { key: { id } })
            return id
        },
        createPost: async (_, { userId, date, name, text, labels }, contextValue) => {
            // handle create post
            postObject = {
                id: uuid4(),
                name: name,
                date: date,
                userId: userId,
                text: text,
                labels: [],
                likes: 0,
            }

            await contextValue.models.DynamoDB.createItem("post", postObject)

            return postItem
        },
        updatePost: async (_, { id, ...updates }, contextValue) => {
            const { userId } = contextValue.user

            // handle update post
            if (!updates) {
                throw new GraphQLError(`Missing update parameters: must include a field to update`, {
                    extensions: {
                        code: 'BAD REQUEST',
                        http: { status: 400 },
                    },
                });
            }

            const updateParams = {
                key: { id, userId },
                updates: updates,
                other_params: {
                    ProjectionExpression: getProjectionExpression(info, "Post"),
                    ReturnidValues: 'ALL_NEW'
                }
            }

            return await contextValue.models.DynamoDB.updateItem("post", updateParams);

        },
        deletePost: async (_, { id }, contextValue) => {
            const { userId } = contextValue.user

            // handle delete post
            await contextValue.models.DynamoDB.deleteItem("user", { key: { id, userId } })
            return id
        },
    }
}

export default resolvers;