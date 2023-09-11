require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const users = require('./routes/users.js');
const orders = require('./routes/orders.js');
const records = require('./routes/records.js');
const addresses = require('./routes/addresses.js');

const Order = require('./models/Order.js');
const Record = require('./models/Record.js');
const User = require('./models/User.js');
const Address = require('./models/Address.js');

const { connect, closeConnection } = require('./configs/db.js');

const app = express();

const Chance = require('chance');
const chance = new Chance();

// Read parameters for db initialization options:
const [ node, script, ...args ] = process.argv;
// Check for args:
if (args[0] === "init" && args[1] === "-db") {
    // initialize db via Chance generated random data...

    // write function to return object:
    /* const chanceFirstname = chance.first();
    const chanceLastname = chance.last();
    const chanceCompany = chance.company().replace(' ', '');
    const chanceEmail = `${ chanceFirstname }.${ chanceLastname }@provider.${ chance.country().toLowerCase() }`;
    const chancePassword = chance.string({ length: 10 });*/

    // Script from Faker tutorial:

    // Maybe use config/db.js instead:
    const connectDB = async () => {
      try {
        await mongoose.connect(`${ process.env.DB_URL }${ process.env.DB_NAME }`);
        console.log("connected to db");
      } catch (error) {
        console.error(error);
      }
    };
    connectDB();

    const generateAddresses = /* async */ (num) => {
      const address = [];
    
      for (let i = 0; i < num; i++) {
        const street = chance.street();
        const city = chance.city();
    
        address.push({
          street,
          city
        });
      }
    
      return address;
    };

    const address = generateAddresses(10);

    Address.insertMany(address)
      .then(docs => console.log(`${docs.length} addresses have been inserted into the database.`))
      .catch(err => {
          console.error(err);
          console.error(`${err.writeErrors?.length ?? 0} errors occurred during the insertMany operation.`);
      });

    const generateUsers = /*async*/ (num) => {
      const user = [];
    
      for (let i = 0; i < num; i++) {
        const id = i+1;
        const firstname = chance.first();
        const lastname = chance.last();
        const email = chance.email();
        const password = chance.string({ length: 10 });
        const randStreet = chance.street();
        const randCity = chance.city();
        const address = { street: randStreet, city: randCity };
        //const address = await Address.find({}, {_id: 1}).limit(1);
        //console.log(address);
    
        user.push({
          id,
          firstname,
          lastname,
          email,
          password,
          address
        });
      }
      
      return user;
    };

    const user = generateUsers(10);

    User.insertMany(user)
      .then(docs => console.log(`${docs.length} users have been inserted into the database.`))
      .catch(err => {
          console.error(err);
          console.error(`${err.writeErrors?.length ?? 0} errors occurred during the insertMany operation.`);
      });

    const generateRecords = /* async */ (num) => {
      const record = [];
    
      for (let i = 0; i < num; i++) {
        const id = i+1;
        const title = chance.sentence({ words: 5 });
        const artist = chance.sentence({ words: 2 });
        const year = chance.integer({ min: 1950, max: 2024});
        const cover = `https://www.record-shop.com/${chance.string({length: 5})}`;
        const price = chance.integer({ min: 10, max: 20 });
      
        record.push({
          id,
          title,
          artist,
          year,
          cover,
          price
        });
      }
    
      return record;
    };

    const record = generateRecords(10);

    Record.insertMany(record)
      .then(docs => console.log(`${docs.length} records have been inserted into the database.`))
      .catch(err => {
          console.error(err);
          console.error(`${err.writeErrors?.length ?? 0} errors occurred during the insertMany operation.`);
      });

    const generateOrders = /* async */ (num) => {
      const order = [];
        
      for (let i = 0; i < num; i++) {
        const id = i+1;
        const qty = chance.integer({ min: 1, max: 20});
      
        order.push({
          id,
          qty,
        });
      }
      
      return order;
    };
      
    const order = generateOrders(10);
      
    Order.insertMany(order)
      .then(docs => console.log(`${docs.length} orders have been inserted into the database.`))
      .catch(err => {
          console.error(err);
          console.error(`${err.writeErrors?.length ?? 0} errors occurred during the insertMany operation.`);
      });

};

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use("/users", users);
app.use("/orders", orders);
app.use("/records", records);
app.use("/addresses", addresses);

const port = process.env.PORT;

app.listen(port, () => {
    console.log(`Server läuft auf port ${ port }`);
});
