const express = require("express");
const bodyParser = require("body-parser");
const { graphqlHTTP } = require("express-graphql");
const { buildSchema } = require("graphql");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const Event = require("./models/event");
const User = require("./models/user");

const app = express();
app.use(bodyParser.json());

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
      } 
      type User {
        _id: ID!
        email: String!
        password: String!
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
        createEvent(eventInput: EventInput): Event
        createUser(userInput: UserInput): User
      }
    
      schema{
        query: RootQuery ,
        mutation: RootMutation
      }
    `),
    rootValue: {
      events: () => {
        return Event.find()
          .then((res) => {
            return res.map((item) => {
              return { ...item._doc };
            });
          })
          .catch((err) => {
            throw err;
          });
      },

      createEvent: (args) => {
        const event = new Event({
          title: args.eventInput.title,
          description: args.eventInput.description,
          price: +args.eventInput.price,
          date: new Date(args.eventInput.date),
          creator: "65bde3ac86d6d4ffdcebd88d",
        });
        let createdEvent;

        event
          .save()
          .then((res) => {
            createdEvent = { ...res._doc, _id: res._doc._id.toString() };
            return User.findById("65bde3ac86d6d4ffdcebd88d");
          })
          .then((user) => {
            if (!user) {
              throw new Error(`User not found.`);
            }

            user.createdEvents.push(event);
            return user.save();
          })
          .then(() => {
            return createdEvent;
          })
          .catch((err) => {
            console.log(err);
            throw err;
          });
        return event;
      },
      createUser: (args) => {
        return User.findOne({ email: args.userInput.email })
          .then((res) => {
            if (res) {
              throw new Error(`User exist already.`);
            } else {
              return bcrypt.hash(args.userInput.password, 12);
            }
          })
          .then((res) => {
            const user = new User({
              email: args.userInput.email,
              password: res,
            });

            return user.save();
          })
          .then((res) => {
            return { ...res._doc, password: "", _id: res.id };
          })
          .catch((err) => {
            throw err;
          });
      },
    },
    graphiql: true,
  })
);

const uri = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0.gpwx7zw.mongodb.net/${process.env.MONGO_DB}?retryWrites=true&w=majority`;
mongoose
  .connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    app.listen(3000);
  })
  .catch((err) => console.log(err));
