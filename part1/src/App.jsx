import { useState, useEffect } from 'react';
import personService from './services/persons';
import Filter from './Filter';
import PersonForm from './PersonForm';
import Persons from './Persons';
import Notification from './Notification';

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState('');
  const [newNumber, setNewNumber] = useState('');
  const [newFilter, setFilter] = useState('');
  const [notification, setNotification] = useState(null);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    personService.getAll().then(initialPersons => {
      setPersons(initialPersons);
    });
  }, []);

  const handleNameChange = (event) => {
    setNewName(event.target.value);
  };

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value);
  };

  const handleFilterChange = (event) => {
    setFilter(event.target.value);
  };

  const addName = (event) => {
    event.preventDefault();
    const existingPerson = persons.find(person => person.name === newName);

    if (existingPerson) {
      const confirmUpdate = window.confirm(
        `${newName} is already in the phonebook. Replace the old number with a new one?`
      );
      if (confirmUpdate) {
        const updatedPerson = { ...existingPerson, number: newNumber };
        personService.update(existingPerson.id, updatedPerson)
          .then(returnedPerson => {
            setPersons(persons.map(person => person.id !== existingPerson.id ? person : returnedPerson));
            setNotification(`Updated ${newName}'s number.`);
            setIsError(false);
            setTimeout(() => {
              setNotification(null);
            }, 5000);
            setNewName('');
            setNewNumber('');
          })
          .catch(error => {
            setNotification(`The person '${existingPerson.name}' has already been removed from the server`);
            setIsError(true);
            setTimeout(() => {
              setNotification(null);
            }, 5000);
            setPersons(persons.filter(p => p.id !== existingPerson.id));
          });
      }
    } else {
      const newPerson = { name: newName, number: newNumber };
      personService.create(newPerson).then(returnedPerson => {
        setPersons(persons.concat(returnedPerson));
        setNotification(`Added ${newName} to the phonebook.`);
        setIsError(false);
        setTimeout(() => {
          setNotification(null);
        }, 5000);
        setNewName('');
        setNewNumber('');
      })
      .catch(error => {
        setNotification(error.response.data.error);
        setIsError(true);
        setTimeout(() => {
          setNotification(null);
        }, 5000);
      });
    }
  };

  const deletePerson = (id) => {
    const person = persons.find(p => p.id === id);
    if (window.confirm(`Delete ${person.name}?`)) {
      personService.remove(id).then(() => {
        setPersons(persons.filter(p => p.id !== id));
        setNotification(`Deleted ${person.name}'s number.`);
        setIsError(false);
        setTimeout(() => {
          setNotification(null);
        }, 5000);
      }).catch(error => {
        setNotification(`The person '${person.name}' was already deleted from the server.`);
        setIsError(true);
        setTimeout(() => {
          setNotification(null);
        }, 5000);
        setPersons(persons.filter(p => p.id !== id));
      });
    }
  };

  const filteredPersons = persons.filter(person =>
    person.name.toLowerCase().includes(newFilter.toLowerCase())
  );

  return (
    <div>
      <h1>Phonebook</h1>
      <Notification message={notification} isError={isError} />
      <Filter value={newFilter} onChange={handleFilterChange} />
      <h1>Add New</h1>
      <PersonForm
        addName={addName}
        newName={newName}
        handleNameChange={handleNameChange}
        newNumber={newNumber}
        handleNumberChange={handleNumberChange}
      />
      <h1>Numbers:</h1>
      <Persons persons={filteredPersons} deletePerson={deletePerson} />
    </div>
  );
};

export default App;
