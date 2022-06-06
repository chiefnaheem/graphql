// import {projects, clients} from '../sampleData';

//Mongoose models
import { Project } from '../models/project';
import { Client } from '../models/client';

import {
  GraphQLObjectType,
  GraphQLString,
  GraphQLList,
  GraphQLID,
  GraphQLInt,
  GraphQLSchema,
} from "graphql";

const clientType = new GraphQLObjectType({
    name: 'Client',
    fields: () => ({
        id: {type: GraphQLID},
        name: {type: GraphQLString},
        email: {type: GraphQLString},
        phone: {type: GraphQLString}
    })
});

const projectType = new GraphQLObjectType({
    name: 'Project',
    fields: () => ({
        id: {type: GraphQLID},
        clientId: {type: GraphQLID},
        name: {type: GraphQLString},
        description: {type: GraphQLString},
        status: {type: GraphQLString},
        client: {
            type: clientType,
            resolve(parent, args) {
                return Client.findById(parent.clientId);
            }

        }
    })
});

const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
        project: {
            type: projectType,
            args: {id: {type: GraphQLID}},
            resolve(parent, args) {
                return Project.findById(args.id);
            }
        },
        projects: {
            type: new GraphQLList(projectType),
            resolve(parent, args) {
                return Project.find();
            }
        },
        client: {
            type: clientType,
            args: {id: {type: GraphQLID}},
            resolve(parent, args) {
                return Client.findById(args.id);
            }
        },
        clients: {
            type: new GraphQLList(clientType),
            resolve(parent, args) {
                return Client.find();
            }
        }
    }
});


export const graphqlSchema = new GraphQLSchema({
    query: RootQuery
});