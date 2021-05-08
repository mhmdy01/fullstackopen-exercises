require("dotenv").config();
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const Person = require("./models/person");

const app = express();
app.use(cors());
app.use(express.json());
const morganLogger = () => {
  morgan.token("body", (req, res) => JSON.stringify(req.body));
  return morgan(
    ":method :url :status :res[content-length] - :response-time ms :body"
  );
};
app.use(morganLogger());

app.get("/api/persons", (req, res, next) => {
  Person.find({})
    .then((persons) => {
      res.json(persons);
    })
    .catch((error) => next(error));
});

app.get("/api/persons/:id", (req, res, next) => {
  Person.findById(req.params.id)
    .then((person) => {
      if (!person) {
        return res.status(404).end();
      }
      res.json(person);
    })
    .catch((error) => next(error));
});

app.delete("/api/persons/:id", (req, res, next) => {
  Person.findByIdAndRemove(req.params.id)
    .then((removedPerson) => {
      if (!removedPerson) {
        return res.status(404).end();
      }
      res.status(204).end();
    })
    .catch((error) => next(error));
});

app.post("/api/persons", (req, res, next) => {
  const recievedPerson = req.body;

  const personToAdd = new Person({
    name: recievedPerson.name,
    number: recievedPerson.number,
  });
  personToAdd
    .save()
    .then((savedPerson) => {
      res.status(201).json(savedPerson);
    })
    .catch((error) => next(error));
});

app.put("/api/persons/:id", (req, res, next) => {
  const id = req.params.id;
  const receivedPerson = req.body;

  const chanedPerson = { number: receivedPerson.number };
  Person.findByIdAndUpdate(id, chanedPerson, { new: true, runValidators: true })
    .then((updatedPerson) => {
      if (!updatedPerson) {
        return res.status(404).end();
      }
      res.json(updatedPerson);
    })
    .catch((error) => next(error));
});

app.get("/info", (req, res) => {
  Person.find({})
    .then((persons) => {
      const html =
        `<p>Phonebook has info for ${persons.length} people</p>` +
        `<p>${new Date().toString()}</p>`;
      res.send(html);
    })
    .catch((error) => next(error));
});

const errorHandler = (error, req, res, next) => {
  console.log(`${error.name} | ${error.message}`);
  switch (error.name) {
    case "CastError":
      return res.status(400).json({ error: "wrong field: id" });
    case "ValidationError":
      return res.status(400).json({ error: error.message });
    default:
      next(error);
  }
};
app.use(errorHandler);

const port = 3001;
app.listen(port, () => {
  console.log(`express app running at http://localhost:${port}`);
});
