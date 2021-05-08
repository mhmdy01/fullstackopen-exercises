const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

mongoose
  .connect(process.env.DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
  })
  .then((msg) => console.log(`connect_db | success`))
  .catch((error) => {
    console.log(`connect_db | error | ${error.name} | ${error.message}`);
  });

const personSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true, minLength: 3 },
  number: { type: String, required: true, minLength: 8 },
});
personSchema.plugin(uniqueValidator);

personSchema.set("toJSON", {
  transform: (doc, ret) => {
    ret.id = ret._id.toString();
    delete ret._id;
    delete ret.__v;
  },
});

const Person = mongoose.model("Person", personSchema);

module.exports = Person;
