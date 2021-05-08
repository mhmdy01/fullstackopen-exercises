const mongoose = require("mongoose");

if (process.argv.length === 2) {
  console.log("usage: node mongo.js <password> [name] [number]");
  process.exit(1);
}

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
});
const Person = mongoose.model("Person", personSchema);

const dbPassword = process.argv[2];
const dbName = "phonebook-app-test";
const dbUrl =
  `mongodb+srv://m001-student:${dbPassword}` +
  `@sandbox.58t3e.mongodb.net/${dbName}` +
  "?retryWrites=true&w=majority";
mongoose.connect(dbUrl, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true,
});

if (process.argv.length === 3) {
  Person.find({})
    .then((persons) => {
      console.log("phonebook");
      persons.forEach((p) => {
        console.log(`${p.name} ${p.number}`);
      });
      mongoose.connection.close();
    })
    .catch((error) => {
      console.log(error);
      mongoose.connection.close();
    });
} else {
  const person = new Person({ name: process.argv[3], number: process.argv[4] });
  person
    .save()
    .then((p) => {
      console.log(`added ${p.name} number ${p.number} to phonebook`);
      mongoose.connection.close();
    })
    .catch((error) => {
      console.log(error);
      mongoose.connection.close();
    });
}
