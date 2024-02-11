var graphql = require('graphql');
var axios = require('axios');
var GraphQLObjectType = graphql.GraphQLObjectType, GraphQLString = graphql.GraphQLString, GraphQLInt = graphql.GraphQLInt, GraphQLSchema = graphql.GraphQLSchema, GraphQLNonNull = graphql.GraphQLNonNull, GraphQLList = graphql.GraphQLList;
var users = [
    { id: '23', firstName: 'Bill', age: 20 },
    { id: '47', firstName: 'Samantha', age: 21 },
];
var CompanyType = new GraphQLObjectType({
    name: "Company",
    fields: function () { return ({
        id: { type: GraphQLString },
        name: { type: GraphQLString },
        description: { type: GraphQLString },
        users: {
            type: new GraphQLList(UserType),
            resolve: function (parentValue, args) {
                return axios.get("http://localhost:3000/companies/".concat(parentValue.id, "/users")).then(function (res) { return res.data; });
            }
        }
    }); }
});
var UserType = new GraphQLObjectType({
    name: 'User',
    fields: function () { return ({
        id: { type: GraphQLString },
        firstName: { type: GraphQLString },
        age: { type: GraphQLInt },
        company: {
            type: CompanyType,
            resolve: function (parentValue) {
                return axios.get("http://localhost:3000/companies/".concat(parentValue.companyId)).then(function (response) { return response.data; });
            }
        }
    }); }
});
var RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
        user: {
            type: UserType,
            args: { id: { type: GraphQLString } },
            resolve: function (parentValue, args) {
                return axios.get("http://localhost:3000/users/".concat(args.id)).then(function (response) { return response.data; });
            }
        },
        company: {
            type: CompanyType,
            args: { id: { type: GraphQLString } },
            resolve: function (parentValue, args) {
                return axios.get("http://localhost:3000/companies/".concat(args.id)).then(function (response) { return response.data; });
            }
        }
    }
});
var mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: {
        addUser: {
            type: UserType,
            args: {
                firstName: { type: new GraphQLNonNull(GraphQLString) },
                age: { type: new GraphQLNonNull(GraphQLInt) },
                companyId: { type: GraphQLString },
            },
            resolve: function (parentValue, _a) {
                var firstName = _a.firstName, age = _a.age;
                return axios.post('http://localhost:3000/users', {
                    firstName: firstName,
                    age: age
                }).then(function (res) { return res.data; });
            }
        },
        deleteUser: {
            type: UserType,
            args: {
                id: { type: new GraphQLNonNull(GraphQLString) }
            },
            resolve: function (parentValue, _a) {
                var id = _a.id;
                return axios.delete('http://localhost:3000/users/' + id).then(function (res) { return res.data; });
            }
        },
        editUser: {
            type: UserType,
            args: {
                id: { type: new GraphQLNonNull(GraphQLString) },
                firstName: { type: GraphQLString },
                age: { type: GraphQLInt },
                companyId: { type: GraphQLString },
            },
            resolve: function (parentValue, args) {
                return axios.patch('http://localhost:3000/users/' + args.id, args).then(function (res) { return res.data; });
            }
        }
    }
});
module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation: mutation
});
