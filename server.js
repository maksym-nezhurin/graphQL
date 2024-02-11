var express = require('express');
var expressGraphQL = require('express-graphql').graphqlHTTP;
var schema = require('./schema/schema');
var app = express();
app.use('/graphql', expressGraphQL({
    schema: schema,
    graphiql: true
}));
app.listen(4000, function () {
    console.log('listening...');
});
