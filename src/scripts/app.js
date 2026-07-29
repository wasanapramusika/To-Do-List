
const todoForm = document.getElementById('todo-form');
const todoInput = document.getElementById('todo-input');
const todoList = document.getElementById('todo-list');
const taskCounter = document.getElementById('task-counter');


let todos = [];

function renderTodos() {
  todoList.innerHTML = '';

  todos.forEach((todo) => {
    const li = document.createElement('li');
    li.className = `todo-item ${todo.completed ? 'completed' : ''}`;
    li.dataset.id = todo.id;

    li.innerHTML = `
      <span class="task-text">${todo.text}</span>
      <button class="delete-btn" aria-label="Delete task">&times;</button>
    `;

    todoList.appendChild(li);
  });
}


function updateTaskCounter() {
  const activeCount = todos.filter(t => !t.completed).length;
  taskCounter.textContent = `${activeCount} task${activeCount === 1 ? '' : 's'} remaining`;
}

// Modify renderTodos to invoke counter
function renderTodos() {
  todoList.innerHTML = '';

  todos.forEach((todo) => {
    const li = document.createElement('li');
    li.className = `todo-item ${todo.completed ? 'completed' : ''}`;
    li.dataset.id = todo.id;

    li.innerHTML = `
      <span class="task-text">${todo.text}</span>
      <button class="delete-btn" aria-label="Delete task">&times;</button>
    `;

    todoList.appendChild(li);
  });

  updateTaskCounter();
}


todoForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const text = todoInput.value.trim();
  if (!text) return;

  const newTodo = {
    id: Date.now(),
    text: text,
    completed: false
  };

  todos.push(newTodo);
  todoInput.value = '';
  renderTodos();
});


todoList.addEventListener('click', (e) => {
  const target = e.target;
  const li = target.closest('li');
  if (!li) return;

  const id = Number(li.dataset.id);

  if (target.classList.contains('delete-btn')) {
    todos = todos.filter(todo => todo.id !== id);
    renderTodos();
  }
});


todoList.addEventListener('click', (e) => {
  const target = e.target;
  const li = target.closest('li');
  if (!li) return;

  const id = Number(li.dataset.id);

  if (target.classList.contains('delete-btn')) {
    todos = todos.filter(todo => todo.id !== id);
    renderTodos();
  } else {
    // Toggle completed flag
    todos = todos.map(todo => {
      if (todo.id === id) {
        return { ...todo, completed: !todo.completed };
      }
      return todo;
    });
    renderTodos();
  }
});

const STORAGE_KEY = 'taskmaster_todos';

function saveTodos() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
}

function loadTodos() {
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored ? JSON.parse(stored) : [];
}


todos = loadTodos();

todoForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const text = todoInput.value.trim();

  // Guard against blank/spaces-only input
  if (!text) {
    todoInput.classList.add('error');
    setTimeout(() => todoInput.classList.remove('error'), 600);
    return;
  }

  const newTodo = {
    id: Date.now(),
    text: text,
    completed: false
  };

  todos.push(newTodo);
  todoInput.value = '';
  renderTodos();
});

// Complete final script.js logic

const todoForm = document.getElementById('todo-form');
const todoInput = document.getElementById('todo-input');
const todoList = document.getElementById('todo-list');
const taskCounter = document.getElementById('task-counter');

const STORAGE_KEY = 'taskmaster_todos';

function saveTodos() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
}

function loadTodos() {
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored ? JSON.parse(stored) : [];
}

let todos = loadTodos();

function updateTaskCounter() {
  const activeCount = todos.filter(t => !t.completed).length;
  taskCounter.textContent = `${activeCount} task${activeCount === 1 ? '' : 's'} remaining`;
}

function renderTodos() {
  saveTodos(); // Save current state on every view refresh
  todoList.innerHTML = '';

  if (todos.length === 0) {
    todoList.innerHTML = `
      <li class="empty-state">
        🎉 All caught up! Add a task above to get started.
      </li>
    `;
    updateTaskCounter();
    return;
  }

  todos.forEach((todo) => {
    const li = document.createElement('li');
    li.className = `todo-item ${todo.completed ? 'completed' : ''}`;
    li.dataset.id = todo.id;

    li.innerHTML = `
      <span class="task-text">${todo.text}</span>
      <button class="delete-btn" aria-label="Delete task">&times;</button>
    `;

    todoList.appendChild(li);
  });

  updateTaskCounter();
}

// Event Listeners
todoForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const text = todoInput.value.trim();

  if (!text) {
    todoInput.classList.add('error');
    setTimeout(() => todoInput.classList.remove('error'), 600);
    return;
  }

  const newTodo = {
    id: Date.now(),
    text: text,
    completed: false
  };

  todos.push(newTodo);
  todoInput.value = '';
  renderTodos();
});

todoList.addEventListener('click', (e) => {
  const target = e.target;
  const li = target.closest('li');
  if (!li) return;

  const id = Number(li.dataset.id);

  if (target.classList.contains('delete-btn')) {
    todos = todos.filter(todo => todo.id !== id);
    renderTodos();
  } else {
    todos = todos.map(todo => {
      if (todo.id === id) {
        return { ...todo, completed: !todo.completed };
      }
      return todo;
    });
    renderTodos();
  }
});

renderTodos();


let currentFilter = 'all';

const filterBtns = document.querySelectorAll('.filter-btn');

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    currentFilter = btn.dataset.filter;
    renderTodos();
  });
});

function getFilteredTodos() {
  if (currentFilter === 'active') return todos.filter(t => !t.completed);
  if (currentFilter === 'completed') return todos.filter(t => t.completed);
  return todos;
}


const clearCompletedBtn = document.getElementById('clear-completed-btn');

clearCompletedBtn.addEventListener('click', () => {
  todos = todos.filter(todo => !todo.completed);
  renderTodos();
});

const editDialog = document.getElementById('edit-dialog');
const editForm = document.getElementById('edit-form');
const editInput = document.getElementById('edit-input');
const cancelEditBtn = document.getElementById('cancel-edit-btn');
let editingTodoId = null;

function openEditModal(id, currentText) {
  editingTodoId = id;
  editInput.value = currentText;
  editDialog.showModal();
}

cancelEditBtn.addEventListener('click', () => {
  editDialog.close();
});

editForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const newText = editInput.value.trim();
  if (!newText || !editingTodoId) return;

  todos = todos.map(todo => {
    if (todo.id === editingTodoId) {
      return { ...todo, text: newText };
    }
    return todo;
  });

  editDialog.close();
  renderTodos();
});

const themeToggleBtn = document.getElementById('theme-toggle-btn');
const THEME_KEY = 'taskmaster_theme';

function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  themeToggleBtn.textContent = theme === 'light' ? '☀️' : '🌙';
  localStorage.setItem(THEME_KEY, theme);
}

themeToggleBtn.addEventListener('click', () => {
  const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
  applyTheme(newTheme);
});

// Initialize theme from storage
const savedTheme = localStorage.getItem(THEME_KEY) || 'dark';
applyTheme(savedTheme);