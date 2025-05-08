document.addEventListener('DOMContentLoaded', function () {
    const taskInput = document.getElementById('taskInput');
    const dueDateInput = document.getElementById('dueDateInput');
    const addTaskBtn = document.getElementById('addTaskBtn');
    const taskList = document.getElementById('taskList');
    const toggleBtn = document.getElementById('toggleModeBtn');
  
    loadTasks();
  
    // Dark mode setup
    if (localStorage.getItem('darkMode') === 'true') {
      document.body.classList.add('dark');
      toggleBtn.textContent = '☀️ Light Mode';
    }
  
    toggleBtn.addEventListener('click', () => {
      document.body.classList.toggle('dark');
      const isDark = document.body.classList.contains('dark');
      toggleBtn.textContent = isDark ? '☀️ Light Mode' : '🌙 Dark Mode';
      localStorage.setItem('darkMode', isDark);
    });
  
    addTaskBtn.addEventListener('click', function () {
      const taskText = taskInput.value.trim();
      const dueDate = dueDateInput.value;
  
      if (taskText !== '') {
        const task = { text: taskText, completed: false, dueDate: dueDate };
        const tasks = getTasks();
        tasks.push(task);
        saveTasks(tasks);
        renderTasks();
        taskInput.value = '';
        dueDateInput.value = '';
      }
    });
  
    taskList.addEventListener('click', function (e) {
      const index = e.target.closest('li')?.dataset.index;
      let tasks = getTasks();
  
      if (e.target.classList.contains('deleteBtn')) {
        tasks.splice(index, 1);
        saveTasks(tasks);
        renderTasks();
      } else if (e.target.tagName === 'SPAN') {
        tasks[index].completed = !tasks[index].completed;
        saveTasks(tasks);
        renderTasks();
      } else if (e.target.classList.contains('editBtn')) {
        const li = e.target.closest('li');
        const currentText = tasks[index].text;
        const currentDate = tasks[index].dueDate || '';
  
        const input = document.createElement('input');
        input.type = 'text';
        input.value = currentText;
  
        const dateInput = document.createElement('input');
        dateInput.type = 'date';
        dateInput.value = currentDate;
  
        const saveBtn = document.createElement('button');
        saveBtn.textContent = 'Save';
  
        li.innerHTML = '';
        li.appendChild(input);
        li.appendChild(dateInput);
        li.appendChild(saveBtn);
  
        saveBtn.addEventListener('click', () => {
          const newText = input.value.trim();
          const newDate = dateInput.value;
          if (newText) {
            tasks[index].text = newText;
            tasks[index].dueDate = newDate;
            saveTasks(tasks);
            renderTasks();
          }
        });
      }
    });
  
    function getTasks() {
      return JSON.parse(localStorage.getItem('tasks')) || [];
    }
  
    function saveTasks(tasks) {
      localStorage.setItem('tasks', JSON.stringify(tasks));
    }
  
    function renderTasks() {
      const tasks = getTasks();
      taskList.innerHTML = '';
  
      tasks.forEach((task, index) => {
        const li = document.createElement('li');
        li.dataset.index = index;
        if (task.completed) li.classList.add('completed');
  
        li.innerHTML = `
          <div>
            <span>${task.text}</span>
            ${task.dueDate ? `<small style="display:block;font-size:12px;">Due: ${task.dueDate}</small>` : ''}
          </div>
          <div>
            <button class="editBtn">✏️</button>
            <button class="deleteBtn">&times;</button>
          </div>
        `;
        taskList.appendChild(li);
      });
    }
  
    function loadTasks() {
      renderTasks();
    }
  });
  