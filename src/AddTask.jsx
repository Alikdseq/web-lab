import React, { useState } from 'react';

const ToDoForm = ({ addTask }) => {
    const [userInput, setUserInput] = useState('');

    const handleChange = (e) => {
        setUserInput(e.currentTarget.value);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        addTask(userInput);
        setUserInput('');
    };

    const handleKeyPress = (e) => {
        if (e.key === "Enter") {
            handleSubmit(e);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <input
                value={userInput}
                type="text"
                onChange={handleChange}
                onKeyDown={handleKeyPress}
                placeholder="Введите задачу..."
            />
            <button>Добавить</button>
        </form>
    );
};

export default ToDoForm;