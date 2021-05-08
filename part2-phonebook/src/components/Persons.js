import React from "react";
import Person from "./Person";

const Persons = ({ persons, deletePerson }) => {
  return (
    <div>
      {persons.map((person) => (
        <Person
          key={person.id}
          person={person}
          deletePerson={() => deletePerson(person)}
        />
      ))}
    </div>
  );
};

export default Persons;
