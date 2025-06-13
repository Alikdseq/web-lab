import React, { useState, useEffect } from "react";
import "./App.css";
import { getWeatherByCoords, isTodayDayOff } from "./api";
import ToDoForm from "./AddTask";
import ToDo from "./Task";
import axios from "axios";

const TASKS_STORAGE_KEY = "tasks-list-project-web";

function App() {
  const [weatherData, setWeatherData] = useState(null);
  const [isDayOff, setIsDayOff] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [todos, setTodos] = useState([]);

  useEffect(() => {
    const storedTasks = localStorage.getItem(TASKS_STORAGE_KEY);
    if (storedTasks) {
      try {
        const parsedTasks = JSON.parse(storedTasks);
        if (Array.isArray(parsedTasks)) {
          setTodos(parsedTasks);
        }
      } catch (error) {
        console.error("Ошибка при чтении задач:", error);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(todos));
  }, [todos]);

  useEffect(() => {
    async function fetchData() {
      try {
        navigator.geolocation.getCurrentPosition(async (position) => {
          const { latitude, longitude } = position.coords;

          const weather = await getWeatherByCoords(latitude, longitude);
          setWeatherData({
            temperature: weather.temperature, // °C
            windSpeed: weather.windSpeed,
            clouds: weather.clouds,
          });

          const isOff = await isTodayDayOff();
          setIsDayOff(isOff);
        });
      } catch (err) {
        console.error("Ошибка при загрузке:", err);
        setError("Ошибка загрузки данных");
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  const addTask = (userInput) => {
    if (userInput.trim()) {
      const newItem = {
        id: Math.random().toString(36).substr(2, 9),
        task: userInput,
        complete: false,
      };
      setTodos([...todos, newItem]);
    }
  };

  const removeTask = (id) => {
    setTodos([...todos.filter((todo) => todo.id !== id)]);
  };

  const handleToggle = (id) => {
    setTodos(
      todos.map((task) =>
        task.id === id ? { ...task, complete: !task.complete } : task
      )
    );
  };

  return (
    <div className="App">
      {loading && <p>Загрузка...</p>}
      {!loading && error && <p style={{ color: "red" }}>{error}</p>}

      {!loading && !error && (
        <div className="info">
          {weatherData && (
            <div className="weather-info">
              Погода сегодня: <br />
              🌡️ {weatherData.temperature}°C &nbsp; 🍃 {weatherData.windSpeed}{" "}
              м/с &nbsp; ☁️ {weatherData.clouds ?? "-"}%
            </div>
          )}

          {isDayOff !== null && (
            <div className="dayoff-info">
              Сегодня: {isDayOff ? "выходной день 🎉" : "рабочий день 💼"}
            </div>
          )}
        </div>
      )}
      <header>
        <h1 className="list-header">Список задач: {todos.length}</h1>
      </header>

      <ToDoForm addTask={addTask} />

      {todos.map((todo) => (
        <ToDo
          key={todo.id}
          todo={todo}
          toggleTask={handleToggle}
          removeTask={removeTask}
        />
      ))}
    </div>
  );
}

export default App;
