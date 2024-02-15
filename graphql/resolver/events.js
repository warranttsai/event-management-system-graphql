const { dateToString } = require("../../helpers/date");
const Event = require("../../models/event");
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

  createEvent: (args) => {
    const event = new Event({
      title: args.eventInput.title,
      description: args.eventInput.description,
      price: +args.eventInput.price,
      date: dateToString(args.eventInput.date),
      creator: "65bde3ac86d6d4ffdcebd88d",
    });

    let createdEvent;
    event
      .save()
      .then((res) => {
        createdEvent = transformEvent(res);
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
};
