import React, { useState } from "react";

const anecdotes = [
  "If it hurts, do it more often",
  "Adding manpower to a late software project makes it later!",
  "The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.",
  "Any fool can write code that a computer can understand. Good programmers write code that humans can understand.",
  "Premature optimization is the root of all evil.",
  "Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.",
];

const Anecdote = ({ text, votes }) => {
  return (
    <div>
      <div>{text}</div>
      <div>has {votes} votes</div>
    </div>
  );
};

const App = () => {
  const [selected, setSelected] = useState(0);
  const [votes, setVotes] = useState(new Array(anecdotes.length).fill(0));

  const generateRandomIndex = () => {
    let randomIndex = null;
    while (true) {
      randomIndex = Math.floor(Math.random() * anecdotes.length);
      if (randomIndex !== selected) {
        break;
      }
    }
    setSelected(randomIndex);
  };

  const incrementVotes = () => {
    setVotes(
      votes.map((vote, index) => {
        return index === selected ? vote + 1 : vote;
      })
    );
  };

  const indexOfMostVotes = votes.indexOf(Math.max(...votes));
  return (
    <div>
      <div>
        <h2>Anecdote of the day</h2>
        <Anecdote text={anecdotes[selected]} votes={votes[selected]} />
      </div>
      <div>
        <button onClick={incrementVotes}>vote</button>{" "}
        <button onClick={generateRandomIndex}>next anecdote</button>
      </div>
      <div>
        <h2>Anecdote with most votes</h2>
        <Anecdote
          text={anecdotes[indexOfMostVotes]}
          votes={votes[indexOfMostVotes]}
        />
      </div>
    </div>
  );
};

export default App;
