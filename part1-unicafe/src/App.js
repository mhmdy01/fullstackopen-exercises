import React, { useState } from "react";

const Button = ({ label, clickHandler }) => {
  return <button onClick={clickHandler}>{label}</button>;
};

const Statistic = ({ name, value }) => {
  return (
    <tr>
      <th>{name}</th>
      <td>{value}</td>
    </tr>
  );
};

const Statistics = ({ good, neutral, bad }) => {
  const total = good + neutral + bad;
  if (total === 0) {
    return <div>no feedback given</div>;
  }
  return (
    <div>
      <table>
        <tbody>
          <Statistic name="good" value={good} />
          <Statistic name="neutral" value={neutral} />
          <Statistic name="bad" value={bad} />
          <Statistic name="total" value={total} />
          <Statistic name="average" value={(good - bad) / total} />
          <Statistic name="positive" value={`${(good / total) * 100} %`} />
        </tbody>
      </table>
    </div>
  );
};

const App = () => {
  const [good, setGood] = useState(0);
  const [neutral, setNeutral] = useState(0);
  const [bad, setBad] = useState(0);

  const incrementGood = () => {
    setGood(good + 1);
  };
  const incrementNeutral = () => {
    setNeutral(neutral + 1);
  };
  const incrementBad = () => {
    setBad(bad + 1);
  };

  return (
    <div>
      <div>
        <h2>give feedback</h2>
        <div>
          <Button label="good" clickHandler={incrementGood} />{" "}
          <Button label="neutral" clickHandler={incrementNeutral} />{" "}
          <Button label="bad" clickHandler={incrementBad} />
        </div>
      </div>
      <div>
        <h2>statistics</h2>
        <Statistics good={good} neutral={neutral} bad={bad} />
      </div>
    </div>
  );
};

export default App;
