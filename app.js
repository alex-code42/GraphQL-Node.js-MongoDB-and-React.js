var express = require("express")
var { graphqlHTTP } = require("express-graphql")
var { buildSchema } = require("graphql")
const mongoose = require('mongoose');
const PORT = 4000;
require('dotenv').config();
const bcrypt = require('bcryptjs');

const Event = require('./models/event');
const User = require('./models/user'); 





// The root provides a resolver function for each API endpoint
var event = {
  events: () => {
    return Event.find().populate('creator').then(events => {
        return events.map(event => {
            return {...event._doc, _id: event._doc._id.toString()};
        });
    })
  },
    createEvent: (args) => {
        const event = new Event({
            title: args.eventInput.title,
            description: args.eventInput.description,
            price: +args.eventInput.price,
            date: new Date(args.eventInput.date),
            creator: "65426027bf56cb66153fa369"
        });
        return event.save().then(result => {
          User.findById("65426027bf56cb66153fa369").then(user => {
            if(!user){
              throw new Error('User not found.');
            }
            user.createdEvents.push(event);
            user.save();
          
          })
            console.log(result);
            return {...result._doc};
        
        }).catch(err => {console.log(err); throw err;});
        
    },
    createUser: (args) => {
        return User.findOne({email: args.userInput.email}).then(user => {
            if(user){
                throw new Error('User exists already.');
            }
            return bcrypt.hash(args.userInput.password, 12);
        }).then(hashedPassword => {
            const user = new User({
                email: args.userInput.email,
                password: hashedPassword
            });
            return user.save();
        }).then(result => {
            return {...result._doc, password: null, _id: result.id};
        }).catch(err => {throw err;});
    }
}


var app = express()
app.use(
  "/graphql",
  graphqlHTTP({
    schema: buildSchema(`
        type Event {
            _id: ID!
            title: String!
            description: String!
            price: Float!
            date: String!
            creator: User
        }
        type User{
            _id: ID!
            email: String!
            password: String
            createdEvents: [Event!]
        }

        input EventInput {
            title: String!
            description: String!
            price: Float!
            date: String!
        }
        input UserInput {
            email: String!
            password: String!
        }

      type RootQuery {
        events: [Event!]!
      }
        type RootMutation {
            createEvent(eventInput: EventInput): Event,
            createUser(userInput: UserInput): User
        }
        schema {
            query: RootQuery
            mutation: RootMutation
        }
    `),
    rootValue: event,
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