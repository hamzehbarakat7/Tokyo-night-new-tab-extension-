function updateClock() {
  const now = new Date();
  let hour = String(now.getHours()).padStart(2, '0');
  let minute = String(now.getMinutes()).padStart(2, '0');
  document.getElementById("clock").textContent = `${hour}:${minute}`;
}
setInterval(updateClock, 1000);
updateClock();

async function fetchWeather() {
  const apiKey = "cfbd7afb1454cca4e839863934c6ffe9"; 
  const city = "Amman,JO";
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

  try {
    const res = await fetch(url);
    const data = await res.json();
    const temp = Math.round(data.main.temp);
    const desc = data.weather[0].description;
    const emoji = getWeatherEmoji(data.weather[0].main);
    document.getElementById("weather").textContent = `${emoji} ${temp}°C – ${desc}`;
  } catch (e) {
    document.getElementById("weather").textContent = "⚠️ Failed to load weather";
  }
}

function getWeatherEmoji(condition) {
  switch (condition) {
    case "Clear": return "☀️";
    case "Clouds": return "☁️";
    case "Rain": return "🌧️";
    case "Drizzle": return "🌦️";
    case "Thunderstorm": return "⛈️";
    case "Snow": return "❄️";
    default: return "🌡️";
  }
}
fetchWeather();

/* ================= TIMER FUNCTIONALITY ================= */
let timerInterval;
let defaultTime = 300; // 5 minutes default setup
let timeRemaining = defaultTime; 
const timerDisplay = document.getElementById('timer-display');

function updateTimerDisplay() {
  const minutes = String(Math.floor(timeRemaining / 60)).padStart(2, '0');
  const seconds = String(timeRemaining % 60).padStart(2, '0');
  timerDisplay.textContent = `${minutes}:${seconds}`;
}

// Custom Time Editing
timerDisplay.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    e.preventDefault();
    timerDisplay.blur();
  }
});

timerDisplay.addEventListener('blur', () => {
  const timeParts = timerDisplay.textContent.split(':');
  let parsedMinutes = parseInt(timeParts[0], 10) || 0;
  let parsedSeconds = parseInt(timeParts[1], 10) || 0;
  
  defaultTime = (parsedMinutes * 60) + parsedSeconds;
  timeRemaining = defaultTime;
  updateTimerDisplay();
});

document.getElementById('start-timer').addEventListener('click', () => {
  clearInterval(timerInterval);
  timerInterval = setInterval(() => {
    if (timeRemaining > 0) {
      timeRemaining--;
      updateTimerDisplay();
    } else {
      clearInterval(timerInterval);
      alert("Time's up!");
    }
  }, 1000);
});

document.getElementById('pause-timer').addEventListener('click', () => {
  clearInterval(timerInterval);
});

document.getElementById('reset-timer').addEventListener('click', () => {
  clearInterval(timerInterval);
  timeRemaining = defaultTime;
  updateTimerDisplay();
});

/* ================= TO-DO FUNCTIONALITY ================= */
const todoInput = document.getElementById('todo-input');
const addTodoBtn = document.getElementById('add-todo-btn');
const todoList = document.getElementById('todo-list');

// Structure modified to support object containing completion status
let todos = JSON.parse(localStorage.getItem('todos-v2')) || [];

function saveAndRenderTodos() {
  localStorage.setItem('todos-v2', JSON.stringify(todos));
  todoList.innerHTML = '';
  
  todos.forEach((todo, index) => {
    const li = document.createElement('li');
    li.className = `todo-item ${todo.completed ? 'completed' : ''}`;
    
    li.innerHTML = `
      <div class="todo-left">
        <input type="checkbox" class="todo-checkbox" ${todo.completed ? 'checked' : ''} data-index="${index}">
        <span>${todo.text}</span>
      </div>
      <button class="todo-delete-btn" data-index="${index}">✕</button>
    `;
    todoList.appendChild(li);
  });
}

// Add Item
addTodoBtn.addEventListener('click', () => {
  const taskText = todoInput.value.trim();
  if (taskText) {
    todos.push({ text: taskText, completed: false });
    todoInput.value = '';
    saveAndRenderTodos();
  }
});

todoInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') addTodoBtn.click();
});

// Event Delegation for Checkbox toggles and Delete actions
todoList.addEventListener('click', (e) => {
  const index = e.target.getAttribute('data-index');
  if (index === null) return;

  if (e.target.classList.contains('todo-checkbox')) {
    todos[index].completed = e.target.checked;
    saveAndRenderTodos();
  } else if (e.target.classList.contains('todo-delete-btn')) {
    todos.splice(index, 1);
    saveAndRenderTodos();
  }
});

saveAndRenderTodos();
