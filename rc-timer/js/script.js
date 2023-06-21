document.addEventListener("DOMContentLoaded", () => {
  const timerVisual = document.querySelector(".timer-visual");
  const timerStatus = document.querySelector(".status");
  const timerPath = timerVisual.querySelector(".timer-path");
  const timerOutline = timerVisual.querySelector(".timer-outline");
  const timeDisplay = document.querySelector(".time-remaining");
  const sessionTimeDisplay = document.querySelector(".session-time");
  const startBtn = document.querySelector(".start-btn");
  const resetBtn = document.querySelector(".reset-btn");
  const longDisplay = document.querySelector(".long-time");
  const shortDisplay = document.querySelector(".short-time");
  const longIncreaseBtn = document.querySelector(".long-increase-btn");
  const longDecreaseBtn = document.querySelector(".long-decrease-btn");
  const shortIncreaseBtn = document.querySelector(".short-increase-btn");
  const shortDecreaseBtn = document.querySelector(".short-decrease-btn");
  const increaseBtn = document.querySelector(".increase-time");
  const decreaseBtn = document.querySelector(".decrease-time");
  const audio_shortbreak = new Audio("../sounds/shortbreak.ogg");
  const audio_start = new Audio("../sounds/start.ogg");
  const audio_longbreak = new Audio("../sounds/longbreak.ogg");
  const audio_end = new Audio("../sounds/end.ogg");
  const sessionIncreaseBtn = document.querySelector(".increase-sessions-sum");
  const sessionDecreaseBtn = document.querySelector(".decrease-sessions-sum");
  const sessionsSum = document.querySelector(".sessions");
  const todoList = document.querySelector(".todo-list");
  const form = todoList.querySelector("form");
  const taskList = todoList.querySelector("ul");

  let totalTime = 1 * 60;
  let time;
  let timeTotal = totalTime;
  let currentTime = totalTime;
  let timerInterval;
  let isTimerRunning = false;
  let longBreakTime = 2 * 60;
  let shortBreakTime = 1 * 60;
  let isShortBreakTime = false;
  let isLongBreakTime = false;
  let sessionTime = true;
  let sessionCount = 1;
  let sessionsQuantity = 1;
  let pomodoroQuantity = 1;

  sessionIncreaseBtn.addEventListener("click", () => {
    sessionsQuantity++;
    sessionsSum.innerHTML = sessionsQuantity;
  });

  sessionDecreaseBtn.addEventListener("click", () => {
    if (sessionsQuantity > 1) {
      sessionsQuantity--;
      sessionsSum.innerHTML = sessionsQuantity;
    }
  });

  timerStatus.innerHTML = "Waiting for start";

  function formatTime(timeInSeconds) {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = timeInSeconds % 60;
    return `${padTime(minutes)}:${padTime(seconds)}`;
  }

  function padTime(time) {
    return time.toString().padStart(2, "0");
  }

  const increaseLongBreakTime = () => {
    if (longBreakTime < 30 * 60) {
      longBreakTime += 60;
      longDisplay.innerHTML = formatTime(longBreakTime);
    }
  };

  const decreaseLongBreakTime = () => {
    if (longBreakTime >= 3 * 10 && longBreakTime > shortBreakTime + 60) {
      longBreakTime -= 60;
      longDisplay.innerHTML = formatTime(longBreakTime);
    }
  };

  const increaseShortBreakTime = () => {
    if (shortBreakTime < 10 * 60) {
      shortBreakTime += 60;
      shortDisplay.innerHTML = formatTime(shortBreakTime);
    }
  };

  const decreaseShortBreakTime = () => {
    if (shortBreakTime >= 120) {
      shortBreakTime -= 60;
      shortDisplay.innerHTML = formatTime(shortBreakTime);
    }
  };

  // time = totalTime;

  sessionTimeDisplay.innerHTML = formatTime(timeTotal);

  increaseBtn.addEventListener("click", () => {
    timeTotal += 60; // увеличиваем на 60 секунд
    currentTime += 61;
    updateTimer();
    sessionTimeDisplay.innerHTML = formatTime(timeTotal);
  });

  decreaseBtn.addEventListener("click", () => {
    if (timeTotal > 20 * 60) {
      // минимальное значение таймера - 1 минута
      timeTotal -= 60;
      currentTime -= 59;
      updateTimer();
      sessionTimeDisplay.innerHTML = formatTime(timeTotal);
    }
  });

  function updTimeDisplay() {
    const minutes = Math.floor(currentTime / 60); //currenttime
    const seconds = currentTime % 60;
    const displayString =
      (minutes < 10 ? "0" : "") +
      minutes +
      ":" +
      (seconds < 10 ? "0" : "") +
      seconds;
    timeDisplay.innerHTML = displayString;
  }

  const updateTimer = () => {
    updTimeDisplay();
    // Обновляем длину окружности для заполнения круга пропорционально времени
    const progress = currentTime / timeTotal;
    const circumference = timerPath.getTotalLength();
    timerPath.style.strokeDashoffset = progress * circumference;
    timerPath.style.strokeDasharray = circumference;

    // Обновляем счетчик времени
    currentTime--;

    // свитч
    if (currentTime < 0) {
      if (
        sessionTime === true &&
        sessionCount < 4 &&
        pomodoroQuantity < sessionsQuantity
      ) {
        currentTime = shortBreakTime;
        isShortBreakTime = true;
        sessionCount++;
        timeTotal = shortBreakTime; //time
        sessionTime = false;
        isLongBreakTime = false;

        timerStatus.innerHTML = "Short break";

        // Звуковой сигнал
        audio_shortbreak.play();
      } else if (
        (isShortBreakTime === true && pomodoroQuantity < sessionsQuantity) ||
        (isLongBreakTime === true && pomodoroQuantity < sessionsQuantity)
      ) {
        currentTime = totalTime;
        sessionTime = true;
        pomodoroQuantity++;
        timeTotal = totalTime; //time
        isShortBreakTime = false;
        isLongBreakTime = false;

        timerStatus.innerHTML = "in Session " + pomodoroQuantity;

        // Звуковой сигнал
        audio_start.play();
      } else if (
        sessionTime === true &&
        sessionCount === 4 &&
        isShortBreakTime === false &&
        pomodoroQuantity < sessionsQuantity
      ) {
        sessionTime = false;
        isShortBreakTime = false;
        isLongBreakTime = true;

        sessionCount = 1;

        currentTime = longBreakTime;

        timerStatus.innerHTML = "Looong break";

        timeTotal = longBreakTime; //time

        audio_longbreak.play();
      } else {
        stopTimer();
        audio_end.play();
      }
    }
  };

  const startTimer = () => {
    if (!isTimerRunning) {
      timerInterval = setInterval(updateTimer, 1000);
      isTimerRunning = true;
      startBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 320 512"><style>svg{fill:#000000}</style><path d="M48 64C21.5 64 0 85.5 0 112V400c0 26.5 21.5 48 48 48H80c26.5 0 48-21.5 48-48V112c0-26.5-21.5-48-48-48H48zm192 0c-26.5 0-48 21.5-48 48V400c0 26.5 21.5 48 48 48h32c26.5 0 48-21.5 48-48V112c0-26.5-21.5-48-48-48H240z"/></svg>';
      timerStatus.innerHTML = "in Session " + sessionCount;
      audio_start.play();
    } else {
      timerStatus.innerHTML = "Pause";
      pauseTimer();
    }
  };

  // Пауза таймера
  const pauseTimer = () => {
    clearInterval(timerInterval);
    isTimerRunning = false;
    startBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 384 512"><style>svg{fill:#000000}</style><path d="M73 39c-14.8-9.1-33.4-9.4-48.5-.9S0 62.6 0 80V432c0 17.4 9.4 33.4 24.5 41.9s33.7 8.1 48.5-.9L361 297c14.3-8.7 23-24.2 23-41s-8.7-32.2-23-41L73 39z"/></svg>`;
  };

  // Остановка таймера
  const stopTimer = () => {
    clearInterval(timerInterval);
    isTimerRunning = false;
    currentTime = timeTotal;
    startBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 384 512"><style>svg{fill:#000000}</style><path d="M73 39c-14.8-9.1-33.4-9.4-48.5-.9S0 62.6 0 80V432c0 17.4 9.4 33.4 24.5 41.9s33.7 8.1 48.5-.9L361 297c14.3-8.7 23-24.2 23-41s-8.7-32.2-23-41L73 39z"/></svg>`;
    timerPath.style.strokeDashoffset = 0;
  };

  // Сброс таймера
  const resetTimer = () => {
    timerStatus.innerHTML = "Waiting for start";
    time = timeTotal;
    currentTime = timeTotal;
    sessionCount = 1;
    stopTimer();
    updateTimer();
    sessionTimeDisplay.innerHTML = formatTime(timeTotal);
  };

  // Запускаем таймер при загрузке страницы
  updateTimer();

  // Добавляем обработчики событий для кнопок запуска и сброса таймера
  startBtn.addEventListener("click", startTimer);
  resetBtn.addEventListener("click", resetTimer);

  longDisplay.innerHTML = formatTime(longBreakTime);
  shortDisplay.innerHTML = formatTime(shortBreakTime);

  longIncreaseBtn.addEventListener("click", increaseLongBreakTime);
  longDecreaseBtn.addEventListener("click", decreaseLongBreakTime);
  shortIncreaseBtn.addEventListener("click", increaseShortBreakTime);
  shortDecreaseBtn.addEventListener("click", decreaseShortBreakTime);

  function createTaskElement(title, isDone) {
    const taskId = generateTaskId();
    const li = document.createElement("li");
    li.setAttribute("data-task-id", taskId);
  
    li.addEventListener("click", () => {
      const activeTask = taskList.querySelector(".active");
      if (activeTask) {
        activeTask.classList.remove("active");
      }
      li.classList.add("active");
      saveActiveTask();
    });

    if (isDone) {
      li.classList.add("completed");
      const checkbox = createCheckbox(true);
      li.appendChild(checkbox);
    } else {
      const checkbox = createCheckbox(false);
      li.appendChild(checkbox);
    }

    const taskTitle = document.createElement("span");
    taskTitle.classList.add("task-title");
    taskTitle.textContent = title;
    li.appendChild(taskTitle);

    const editBtn = document.createElement("button");
    editBtn.classList.add("edit");
    editBtn.innerHTML = "Edit";
    li.appendChild(editBtn);

    const deleteBtn = document.createElement("button");
    deleteBtn.classList.add("delete");
    deleteBtn.textContent = "Delete";
    li.appendChild(deleteBtn);

    const activeTaskId = localStorage.getItem("activeTaskId");
    if (activeTaskId && activeTaskId === taskId) {
      li.classList.add("active");
    }
  
    return li;
  }

  function createCheckbox(checked) {
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.classList.add("task-checkbox");
    checkbox.checked = checked;
    checkbox.addEventListener("change", toggleTaskState);
    return checkbox;
  }

  // функция для сохранения задач в Local Storage
  function saveTasks() {
    localStorage.setItem("tasks", taskList.innerHTML);
  }

  function generateTaskId() {
    // Генерируем случайный идентификатор задачи
    return Date.now().toString() + Math.floor(Math.random() * 1000).toString();
  }

  function loadTasks() {
    if (localStorage.getItem("tasks")) {
      taskList.innerHTML = localStorage.getItem("tasks");
      const checkboxes = taskList.querySelectorAll(".task-checkbox");
      checkboxes.forEach((checkbox) =>
        checkbox.addEventListener("change", toggleTaskState)
      );
      const editButtons = taskList.querySelectorAll(".edit");
      editButtons.forEach((button) =>
        button.addEventListener("click", editTask)
      );
      const deleteButtons = taskList.querySelectorAll(".delete");
      deleteButtons.forEach((button) =>
        button.addEventListener("click", deleteTask)
      );
  
      const taskItems = taskList.querySelectorAll("li[data-task-id]");
      taskItems.forEach((taskItem) =>
        taskItem.addEventListener("click", () => {
          const activeTask = taskList.querySelector(".active");
          if (activeTask) {
            activeTask.classList.remove("active");
          }
          taskItem.classList.add("active");
          saveActiveTask();
        })
      );
  
      const activeTaskId = localStorage.getItem("activeTaskId");
      if (activeTaskId) {
        const activeTask = taskList.querySelector(`li[data-task-id="${activeTaskId}"]`);
        if (activeTask) {
          activeTask.classList.add("active");
        } else {
          localStorage.removeItem("activeTaskId");
        }
      }
  
      // Установка состояния выполненных задач
      const completedTasks = taskList.querySelectorAll(".completed");
      completedTasks.forEach((task) => {
        const checkbox = task.querySelector(".task-checkbox");
        checkbox.checked = true;
      });
    }
  }
  

  
  function saveActiveTask() {
    const activeTask = taskList.querySelector(".active");
    if (activeTask) {
      const activeTaskId = activeTask.getAttribute("data-task-id");
      localStorage.setItem("activeTaskId", activeTaskId);
    } else {
      localStorage.removeItem("activeTaskId");
    }
  }  

  function toggleTaskState(event) {
    const checkbox = event.target;
    const li = checkbox.parentNode;
    li.classList.toggle("completed");
    saveTasks();
  }

  function editTask(event) {
    const li = event.target.parentNode;
    const taskTitle = li.querySelector(".task-title");
    const editBtn = li.querySelector(".edit");
    const deleteBtn = li.querySelector(".delete");

    const titleInput = document.createElement("input");
    titleInput.type = "text";
    titleInput.value = taskTitle.textContent;
    titleInput.classList.add("edit-title-input");
    taskTitle.replaceWith(titleInput);

    editBtn.classList.add("disabled");
    deleteBtn.classList.add("disabled");

    const saveBtn = document.createElement("button");
    saveBtn.classList.add("save");
    saveBtn.textContent = "Save";
    li.insertBefore(saveBtn, deleteBtn);
    saveBtn.addEventListener("click", saveEditedTask);
  }

  function saveEditedTask(event) {
    const li = event.target.parentNode;
    const taskTitle = li.querySelector(".edit-title-input");
    const editBtn = li.querySelector(".edit");
    const deleteBtn = li.querySelector(".delete");

    if (taskTitle.value.trim()) {
      const newTaskTitle = document.createElement("span");
      newTaskTitle.classList.add("task-title");
      newTaskTitle.textContent = taskTitle.value;
      taskTitle.replaceWith(newTaskTitle);

      editBtn.classList.remove("disabled");
      deleteBtn.classList.remove("disabled");

      li.removeChild(event.target);
      saveTasks();
    }
  }

  function deleteTask(event) {
    const li = event.target.parentNode;
    li.parentNode.removeChild(li);
    saveTasks();
    saveActiveTask();
  }

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const input = form.elements["task-title"];
    const title = input.value.trim();
    if (title) {
      const li = createTaskElement(title, false);
      taskList.appendChild(li);
      input.value = "";
      const checkbox = li.querySelector(".task-checkbox");
      checkbox.addEventListener("change", toggleTaskState);
      const editBtn = li.querySelector(".edit");
      editBtn.addEventListener("click", editTask);
      const deleteBtn = li.querySelector(".delete");
      deleteBtn.addEventListener("click", deleteTask);
      saveTasks();
    }
  });

  window.addEventListener("beforeunload", () => {
    saveTasks();
  });

  loadTasks();
});
