var express = require("express")
var { graphqlHTTP } = require("express-graphql")
var { buildSchema } = require("graphql")
const mongoose = require('mongoose');
const PORT = 4000;
require('dotenv').config();
const bcrypt = require('bcryptjs');

const Event = require('./models/event');
const User = require('./models/user'); 
const graphQlSchema = require('./graphql/schema/index.js');
const graphQlResolvers = require('./graphql/resolvers/index');






var app = express()
app.use(
  "/graphql",
  graphqlHTTP({
    schema: graphQlSchema,
    rootValue: graphQlResolvers,
    graphiql: true,
  })
)
// Connect to the MongoDB database
mongoose.connect(process.env.MONGODB_PASSWORD)
  .then(() => {
    console.log("Connected to MongoDB");

    // Start the GraphQL API server
    app.listen(PORT, () => {
      console.log(`Running a GraphQL API server at http://localhost:${PORT}/graphql`);
    });
  })
  .catch((err) => {
    console.error('Error connecting to MongoDB:', err);
  });