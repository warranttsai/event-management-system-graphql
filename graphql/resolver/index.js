const bcrypt = require("bcryptjs");

const Event = require("../../models/event");
const User = require("../../models/user");
const Booking = require("../../models/booking");

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

const singleEvent = async (eventId) => {
  try {
    const event = await Event.findById(eventId);
    return {
      ...event._doc,
      id: event.id,
      createor: user.bind(this, event.creator),
    };
  } catch (err) {
    throw err;
  }
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
            date: new Date(event._doc.date).toISOString(),
            creator: user.bind(this, event._doc.creator),
          };
        });
      })
      .catch((err) => {
        throw err;
      });
  },

  bookings: async () => {
    try {
      const bookings = await Booking.find();
      return bookings.map((booking) => {
        return {
          ...booking._doc,
          id: booking._id,
          user: user.bind(this, booking._doc.user),
          event: singleEvent.bind(this, booking._doc.event),
          createdAt: new Date(booking._doc.createdAt).toISOString(),
          updatedAt: new Date(booking._doc.updatedAt).toISOString(),
        };
      });
    } catch (err) {
      throw err;
    }
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
          date: new Date(event._doc.date).toISOString(),
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
  bookEvent: async (args) => {
    const fetchedEvent = await Event.findOne({ _id: args.eventId });
    const booking = new Booking({
      user: "65bde3ac86d6d4ffdcebd88d",
      event: fetchedEvent,
    });
    const result = await booking.save();
    return {
      ...result._doc,
      id: result.id,
      user: user.bind(this, booking._doc.user),
      event: singleEvent.bind(this, booking._doc.event),
      createdAt: new Date(result._doc.createdAt).toISOString(),
      updatedAt: new Date(result._doc.updatedAt).toISOString(),
    };
  },
  cancelBooking: async (args) => {
    try {
      const booking = await Booking.findById(args.bookingId).populate("event");
      const event = {
        ...booking.event._doc,
        _id: booking.event.id,
        creator: user.bind(this, booking.creator),
      };
      await Booking.deleteOne({ _id: args.bookingId });
      console.log(event);
      return event;
    } catch (err) {
      throw err;
    }
  },
};
