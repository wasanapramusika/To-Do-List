const todoForm = document.getElementById('todo-form');
const todoInput = document.getElementById('todo-input');
const todoList = document.getElementById('todo-list');
const taskCounter = document.getElementById('task-counter');
const filterBtns = document.querySelectorAll('.filter-btn');
const clearCompletedBtn = document.getElementById('clear-completed-btn');
const themeToggleBtn = document.getElementById('theme-toggle-btn');

const editDialog = document.getElementById('edit-dialog');
const editForm = document.getElementById('edit-form');
const editInput = document.getElementById('edit-input');
const cancelEditBtn = document.getElementById('cancel-edit-btn');

const STORAGE_KEY = 'taskmaster_todos';
const THEME_KEY = 'taskmaster_theme';

let todos = loadTodos();
let currentFilter = 'all';
let editingTodoId = null;

function saveTodos() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
}

function loadTodos() {
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored ? JSON.parse(stored) : [];
}

function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  themeToggleBtn.textContent = theme === 'light' ? '☀️' : '🌙';
  localStorage.setItem(THEME_KEY, theme);
}

function updateTaskCounter() {
  const activeCount = todos.filter(t => !t.completed).length;
  taskCounter.textContent = `${activeCount} task${activeCount === 1 ? '' : 's'} remaining`;
}

function getFilteredTodos() {
  if (currentFilter === 'active') return todos.filter(t => !t.completed);
  if (currentFilter === 'completed') return todos.filter(t => t.completed);
  return todos;
}

function renderTodos() {
  saveTodos();
  todoList.innerHTML = '';

  const filteredTodos = getFilteredTodos();

  if (filteredTodos.length === 0) {
    todoList.innerHTML = `
      <li class="empty-state">
        No ${currentFilter !== 'all' ? currentFilter : ''} tasks found.
      </li>
    `;
    updateTaskCounter();
    return;
  }

  filteredTodos.forEach((todo) => {
    const li = document.createElement('li');
    li.className = `todo-item ${todo.completed ? 'completed' : ''}`;
    li.dataset.id = todo.id;

    li.innerHTML = `
      <span class="task-text">${todo.text}</span>
      <div class="item-actions">
        <button class="edit-btn" aria-label="Edit task">✏️</button>
        <button class="delete-btn" aria-label="Delete task">&times;</button>
      </div>
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

  todos.push({ id: Date.now(), text, completed: false });
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
  } else if (target.classList.contains('edit-btn')) {
    const todo = todos.find(t => t.id === id);
    if (todo) {
      editingTodoId = id;
      editInput.value = todo.text;
      editDialog.showModal();
    }
  } else {
    todos = todos.map(todo => {
      if (todo.id === id) return { ...todo, completed: !todo.completed };
      return todo;
    });
    renderTodos();
  }
});

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    currentFilter = btn.dataset.filter;
    renderTodos();
  });
});

clearCompletedBtn.addEventListener('click', () => {
  todos = todos.filter(todo => !todo.completed);
  renderTodos();
});

cancelEditBtn.addEventListener('click', () => editDialog.close());

editForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const newText = editInput.value.trim();
  if (!newText || !editingTodoId) return;

  todos = todos.map(t => (t.id === editingTodoId ? { ...t, text: newText } : t));
  editDialog.close();
  renderTodos();
});

themeToggleBtn.addEventListener('click', () => {
  const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
  applyTheme(currentTheme === 'dark' ? 'light' : 'dark');
});

// App Startup
applyTheme(localStorage.getItem(THEME_KEY) || 'dark');
renderTodos();
