const bcrypt = require("bcryptjs");

const Event = require("../../models/event");
const User = require("../../models/user");

const events = (eventIds) => {
  return Event.find({ _id: { $in: eventIds } })
    .then((events) => {
      return events.map((event) => {
        return { ...event._doc, creator: user.bind(this, event.creator) };
      });
    })
    .catch((err) => {
      throw err;
    });
};

const user = (userId) => {
  return User.findById(userId)
    .then((user) => {
      return {
        ...user._doc,
        _id: user.id,
        createdEvents: events.bind(this, user._doc.createdEvents),
      };
    })
    .catch((err) => {
      throw err;
    });
};

module.exports = {
  events: () => {
    return Event.find()
      .then((events) => {
        return events.map((event) => {
          return {
            ...event._doc,
            creator: user.bind(this, event._doc.creator),
          };
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
        console.log(res._doc.creator);
        createdEvent = {
          ...res._doc,
          _id: res._doc._id.toString(),
          creator: user.bind(this, res._doc.creator),
        };
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
};
