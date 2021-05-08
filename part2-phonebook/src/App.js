import React, { useState, useEffect } from "react";
import Persons from "./components/Persons";
import NewPerson from "./components/NewPerson";
import FilterPersons from "./components/FilterPersons";
import Notifications from "./components/Notifications";
import personService from "./services/persons";

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [keyword, setKeyword] = useState("");
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const fetchPersons = async () => {
      // console.log("fetching from api");
      try {
        const fetchedPersons = await personService.readAll();
        setPersons(fetchedPersons);
      } catch (error) {
        console.log(error);
      }
    };
    fetchPersons();
  }, []);

  const handleNewNameChange = (event) => {
    setNewName(event.target.value);
  };
  const handleNewNumberChange = (event) => {
    setNewNumber(event.target.value);
  };
  const handleKeywordChange = (event) => {
    setKeyword(event.target.value);
  };

  const toLowerCase = (s) => s.toLowerCase();

  const addPerson = async (event) => {
    event.preventDefault();
    const duplicate = persons.find((p) => {
      // BUG ALERT: s.includes would cause a LOGIC ERROR
      // eg. mhmdy includes mhm (BUT THEY ARE DIFF NAMES)
      return toLowerCase(p.name) === toLowerCase(newName);
    });
    if (duplicate) {
      const answer = window.confirm(
        `${newName} already exists.\nreplace the old number with the new one?`
      );
      if (answer) {
        changePersonNumber(duplicate);
      }
      return;
    }
    const newPerson = { name: newName, number: newNumber };
    try {
      const createdPerson = await personService.create(newPerson);
      setPersons(persons.concat(createdPerson));
      setNewName("");
      setNewNumber("");
      createNotification({
        type: "success",
        msg: `added: ${createdPerson.name}`,
      });
    } catch (error) {
      console.log(error);
      let errorMsg = error.response
        ? error.response.data
          ? error.response.data.error
          : error.message
        : error.message;
      createNotification({
        type: "error",
        msg: errorMsg,
      });
    }
  };

  const deletePerson = async (person) => {
    const answer = window.confirm(`delete ${person.name}?`);
    if (!answer) {
      return;
    }
    try {
      await personService.remove(person);
      setPersons(persons.filter((p) => p.id !== person.id));
      createNotification({
        type: "success",
        msg: `deleted: ${person.name}`,
      });
    } catch (error) {
      console.log({ ...error });
      let errorMsg = error.response
        ? error.response.data
          ? error.response.data.error
          : error.message
        : error.message;
      if (error.response.status === 404) {
        setPersons(persons.filter((p) => p.id !== person.id));
        errorMsg = `error: ${person.name} doesn't exist on server`;
      }
      createNotification({
        type: "error",
        msg: errorMsg,
      });
    }
  };

  const changePersonNumber = async (person) => {
    const changedPerson = { ...person, number: newNumber };
    try {
      const updatedPerson = await personService.update(changedPerson);
      setPersons(
        persons.map((p) => (p.id === updatedPerson.id ? updatedPerson : p))
      );
      setNewName("");
      setNewNumber("");
      createNotification({
        type: "success",
        msg: `updated: ${person.name}`,
      });
    } catch (error) {
      console.log({ ...error });
      let errorMsg = error.response
        ? error.response.data
          ? error.response.data.error
          : error.message
        : error.message;
      if (error.response.status === 404) {
        setPersons(persons.filter((p) => p.id !== person.id));
        errorMsg = `error: ${person.name} doesn't exist on server`;
      }
      createNotification({
        type: "error",
        msg: errorMsg,
      });
    }
  };

  const createNotification = (notification, delay = 5) => {
    const id = setTimeout(() => {
      clearNotification(id);
    }, delay * 1000);

    const notificationToAdd = { ...notification, id };
    setNotifications((notifications) => [...notifications, notificationToAdd]);
  };

  const clearNotification = (notificationId) => {
    setNotifications((notifications) =>
      notifications.filter((notif) => notif.id !== notificationId)
    );
  };

  const personsToShow = keyword
    ? persons.filter((p) => toLowerCase(p.name).includes(toLowerCase(keyword)))
    : persons;

  return (
    <div>
      <Notifications notifications={notifications} />
      <h2>Phonebook</h2>
      <FilterPersons
        keyword={keyword}
        handleKeywordChange={handleKeywordChange}
      />
      <div>
        <h2>add new</h2>
        <NewPerson
          addPerson={addPerson}
          newName={newName}
          handleNewNameChange={handleNewNameChange}
          newNumber={newNumber}
          handleNewNumberChange={handleNewNumberChange}
        />
      </div>
      <div>
        <h2>Numbers</h2>
        <Persons persons={personsToShow} deletePerson={deletePerson} />
      </div>
    </div>
  );
};

export default App;
