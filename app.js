var express = require("express")
var { graphqlHTTP } = require("express-graphql")
const mongoose = require('mongoose');
const PORT = 4000;
require('dotenv').config();

const graphiQLSchema = require('./graphql/schema/index');
const graphiQlResolver = require('./graphql/resolvers/index');




var app = express()
app.use(
  "/graphql",
  graphqlHTTP({
    schema: graphiQLSchema,
    rootValue: graphiQlResolver,
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