import { v4 as uuid4 } from 'uuid';

const resolvers = {
    Query: {
        getUser: async (_, { id }, contextValue) => {
            // handle create user
            return {
                id: id,
                name: "Some name",
                email: "Some email"
            }
        },
        getPost: async (_, { id }, contextValue) => {
            // handle create user
            return {
                id: id,
                name: "Some name",
                date: "Some date",
                userId: "Some id",
                text: "Some text",
                labels: [],
                likes: 0,
            }
        },
        getPosts: async (_, { userId }, contextValue) => {
            // handle create user
            return [{
                id: uuid4(),
                name: "Some name",
                date: "Some date",
                userId: userId,
                text: "Some text",
                labels: [],
                likes: 0,
            },
            {
                id: uuid4(),
                name: "Some name",
                date: "Some date",
                userId: userId,
                text: "Some text",
                labels: [],
                likes: 0,
            }]
        },
    },
};

export default resolvers;