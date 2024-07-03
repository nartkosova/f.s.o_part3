import React from 'react';

const PersonForm = ({ addName, newName, handleNameChange, newNumber, handleNumberChange }) => {
  return (
    <form onSubmit={addName}>
      <li>
        name: <input value={newName} onChange={handleNameChange} />
      </li>
      <li>
        number: <input value={newNumber} onChange={handleNumberChange} />
      </li>
      <li>
        <button type="submit">add</button>
      </li>
    </form>
  );
};

export default PersonForm;
