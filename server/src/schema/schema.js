"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.graphqlSchema = void 0;
//Mongoose models
var project_1 = require("../models/project");
var client_1 = require("../models/client");
var graphql_1 = require("graphql");
var clientType = new graphql_1.GraphQLObjectType({
    name: 'Client',
    fields: function () { return ({
        id: { type: graphql_1.GraphQLID },
        name: { type: graphql_1.GraphQLString },
        email: { type: graphql_1.GraphQLString },
        phone: { type: graphql_1.GraphQLString }
    }); }
});
var projectType = new graphql_1.GraphQLObjectType({
    name: 'Project',
    fields: function () { return ({
        id: { type: graphql_1.GraphQLID },
        clientId: { type: graphql_1.GraphQLID },
        name: { type: graphql_1.GraphQLString },
        description: { type: graphql_1.GraphQLString },
        status: { type: graphql_1.GraphQLString },
        client: {
            type: clientType,
            resolve: function (parent, args) {
                return client_1.Client.findById(parent.clientId);
            }
        }
    }); }
});
var RootQuery = new graphql_1.GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
        project: {
            type: projectType,
            args: { id: { type: graphql_1.GraphQLID } },
            resolve: function (parent, args) {
                return project_1.Project.findById(args.id);
            }
        },
        projects: {
            type: new graphql_1.GraphQLList(projectType),
            resolve: function (parent, args) {
                return project_1.Project.find();
            }
        },
        client: {
            type: clientType,
            args: { id: { type: graphql_1.GraphQLID } },
            resolve: function (parent, args) {
                return client_1.Client.findById(args.id);
            }
        },
        clients: {
            type: new graphql_1.GraphQLList(clientType),
            resolve: function (parent, args) {
                return client_1.Client.find();
            }
        }
    }
});
var mutation = new graphql_1.GraphQLObjectType({
    name: "Mutation",
    fields: {
        addProject: {
            type: projectType,
            args: {
                name: { type: graphql_1.GraphQLString },
                description: { type: graphql_1.GraphQLString },
                status: {
                    type: new graphql_1.GraphQLEnumType({
                        name: 'ProjectStatus',
                        values: {
                            NotStarted: { value: 'Not started' },
                            InProgress: { value: 'In progress' },
                            Completed: { value: 'Completed' }
                        }
                    }),
                    defaultValue: 'Not started'
                },
                clientId: { type: new graphql_1.GraphQLNonNull(graphql_1.GraphQLID) },
            },
            resolve: function (parent, args) {
                var project = new project_1.Project({
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
                id: { type: new graphql_1.GraphQLNonNull(graphql_1.GraphQLID) }
            },
            resolve: function (parent, args) {
                return project_1.Project.findByIdAndRemove(args.id);
            }
        },
        //update project
        updateProject: {
            type: projectType,
            args: {
                id: { type: new graphql_1.GraphQLNonNull(graphql_1.GraphQLID) },
                name: { type: graphql_1.GraphQLString },
                description: { type: graphql_1.GraphQLString },
                status: {
                    type: new graphql_1.GraphQLEnumType({
                        name: 'ProjectStatusUpdate',
                        values: {
                            NotStarted: { value: 'Not started' },
                            InProgress: { value: 'In progress' },
                            Completed: { value: 'Completed' }
                        }
                    }),
                    defaultValue: 'Not started'
                },
                clientId: { type: new graphql_1.GraphQLNonNull(graphql_1.GraphQLID) },
            },
            resolve: function (parent, args) {
                return project_1.Project.findByIdAndUpdate(args.id, {
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
                name: { type: new graphql_1.GraphQLNonNull(graphql_1.GraphQLString) },
                email: { type: new graphql_1.GraphQLNonNull(graphql_1.GraphQLString) },
                phone: { type: new graphql_1.GraphQLNonNull(graphql_1.GraphQLString) },
            },
            resolve: function (parent, args) {
                var client = new client_1.Client({
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
                id: { type: new graphql_1.GraphQLNonNull(graphql_1.GraphQLID) },
            },
            resolve: function (parent, args) {
                return client_1.Client.findByIdAndRemove(args.id);
            }
        },
    },
});
exports.graphqlSchema = new graphql_1.GraphQLSchema({
    query: RootQuery,
    mutation: mutation
});
