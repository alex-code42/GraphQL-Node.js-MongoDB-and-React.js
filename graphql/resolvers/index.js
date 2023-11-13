const bcrypt = require('bcryptjs');
const Event = require('../../models/event.js');
const User = require('../../models/user.js'); 

const events = async (eventIds) => {
    try {
      const eventsData = await Event.find({ _id: { $in: eventIds } });
      return eventsData.map((event) => ({
        ...event._doc,
        _id: event.id,
        date: new Date(event._doc.date).toISOString(),
        creator: user.bind(this, event.creator),
      }));
    } catch (err) {
      throw err;
    }
  };
  
  const user = async userId => {
    try{
    const userData= await User.findById(userId)
        user => {
            return {...user._doc, _id: user.id, createdEvents: events.bind(this, user._doc.createdEvents) }
        }}
    catch(err ){throw err;};
    }

module.exports = event = {
    events: async () => {
      const eventData = await Event.find()
    
      .then(events => {
          return events.map(event => {
              return {
                ...event._doc, 
                _id: event._doc._id.toString(),
                date: new Date(event._doc.date).toISOString(),
              creator: user.bind(this, event.creator)
              };
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
          return event
          .save()
          .then(result => {
            User.findById("65426027bf56cb66153fa369")
            .then(user => {
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



