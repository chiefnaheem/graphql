
//Mongoose models
import { Project } from '../models/project';
import { Client } from '../models/client';

import {
  GraphQLObjectType,
  GraphQLString,
  GraphQLList,
  GraphQLID,
  GraphQLEnumType,
  GraphQLSchema,
  GraphQLNonNull
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


const mutation = new GraphQLObjectType({
  name: "Mutation",
  fields: {
    addProject: {
      type: projectType,
      args: {
        name: { type: GraphQLString },
        description: { type: GraphQLString },
        status: {
            type: new GraphQLEnumType({
                name: 'ProjectStatus',
                values: {
                    NotStarted: { value: 'Not started' },
                    InProgress: { value: 'In progress' },
                    Completed: { value: 'Completed' }
                }
            }),
            defaultValue: 'Not started'
        },
        clientId: { type: new GraphQLNonNull(GraphQLID)},
      },
      resolve(parent, args) {
        let project = new Project({
          name: args.name,
          description: args.description,
          status: args.status,
          clientId: args.clientId,
        });
        return project.save();
      },
    },
    //delete project
    deleteProject: {
        type: projectType,
        args: {
            id: { type: new GraphQLNonNull(GraphQLID) }
        },
        resolve(parent, args) {
            return Project.findByIdAndRemove(args.id);
        }
    },
    //update project
    updateProject: {
        type: projectType,
        args: {
            id: { type: new GraphQLNonNull(GraphQLID) },
            name: { type: GraphQLString },
            description: { type: GraphQLString },
            status: {
                type: new GraphQLEnumType({
                    name: 'ProjectStatusUpdate',
                    values: {
                        NotStarted: { value: 'Not started' },
                        InProgress: { value: 'In progress' },
                        Completed: { value: 'Completed' }
                    }
                }),
                defaultValue: 'Not started'
            },
            clientId: { type: new GraphQLNonNull(GraphQLID)},
        },
        resolve(parent, args) {
            return Project.findByIdAndUpdate(args.id, {
                $set: {
                    name: args.name,
                    description: args.description,
                    status: args.status,
                    clientId: args.clientId,
                }
            }, { new: true });
        }
    },

    //add client
    addClient: {
      type: clientType,
      args: {
        name: { type: new GraphQLNonNull(GraphQLString) },
        email: { type: new GraphQLNonNull(GraphQLString) },
        phone: { type: new GraphQLNonNull(GraphQLString) },
      },
      resolve(parent, args) {
        let client = new Client({
          name: args.name,
          email: args.email,
          phone: args.phone,
        });
        return client.save();
      },
    },
    //delete client
    deleteClient: {
        type: clientType,
        args: {
            id: { type: new GraphQLNonNull(GraphQLID) },
        },
        resolve(parent, args) {
            return Client.findByIdAndRemove(args.id);
        }
    },
  },
});


export const graphqlSchema = new GraphQLSchema({
    query: RootQuery,
    mutation: mutation
});