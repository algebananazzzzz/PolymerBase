import { GraphQLError } from 'graphql';
import { v4 as uuid4 } from 'uuid';

const resolvers = {
    Mutation: {
        createUser: async (_, { name, email }, contextValue) => {
            // handle create user
            return {
                id: uuid4(),
                name: name,
                email: email
            }
        },
        updateUser: async (_, { id, name, email }, contextValue) => {
            // handle update user
            if (!name && !email) {
                throw new GraphQLError(`Missing update parameters: must include either name or email to update`, {
                    extensions: {
                        code: 'BAD REQUEST',
                        http: { status: 400 },
                    },
                });
            }

            return {
                id: id,
                name: name ? name : "some name",
                email: email ? email : "some email"
            }
        },
        deleteUser: async (_, { id }, contextValue) => {
            // handle delete user
            return id
        },
        createPost: async (_, { userId, date, name, text, labels }, contextValue) => {
            // handle create post
            return {
                id: uuid4(),
                name: name,
                date: date,
                userId: userId,
                text: text,
                labels: labels,
                likes: 0,
            }
        },
        updatePost: async (_, { id, name, text, labels, likes }, contextValue) => {
            // handle update post
            if (!name && !text && !labels && !likes) {
                throw new GraphQLError(`Missing update parameters: must include a field to update`, {
                    extensions: {
                        code: 'BAD REQUEST',
                        http: { status: 400 },
                    },
                });
            }

            return {
                id: id,
                name: name ? name : "some name",
                date: "some date",
                userId: "Some userid",
                text: text ? text : "some text",
                labels: labels ? labels : [],
                likes: likes ? likes : 0
            }
        },
        deletePost: async (_, { id }, contextValue) => {
            // handle delete post
            return id
        },
    }
}

export default resolvers;