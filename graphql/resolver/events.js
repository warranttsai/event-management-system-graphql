const { dateToString } = require("../../helpers/date");
const Event = require("../../models/event");
const User = require("../../models/user");
const { transformEvent } = require("./merge");

module.exports = {
  events: () => {
    return Event.find()
      .then((events) => {
        return events.map((event) => {
          return transformEvent(event);
        });
      })
      .catch((err) => {
        throw err;
      });
  },

  createEvent: (args, req) => {
    if (!req.isAuth) {
      throw new Error("Unauthenticated!");
    }

    const event = new Event({
      title: args.eventInput.title,
      description: args.eventInput.description,
      price: +args.eventInput.price,
      date: dateToString(args.eventInput.date),
      creator: req.userId,
    });

    let createdEvent;
    event
      .save()
      .then((res) => {
        createdEvent = transformEvent(res);
        return User.findById(req.userId);
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
};
