// script.js - Complete Application Logic

// ==========================================
// 1. DOM Element References
// ==========================================
const todoForm = document.getElementById('todo-form');
const todoInput = document.getElementById('todo-input');
const todoList = document.getElementById('todo-list');
const taskCounter = document.getElementById('task-counter');
const filterBtns = document.querySelectorAll('.filter-btn');
const clearCompletedBtn = document.getElementById('clear-completed-btn');
const themeToggleBtn = document.getElementById('theme-toggle-btn');

// Edit Modal Elements
const editDialog = document.getElementById('edit-dialog');
const editForm = document.getElementById('edit-form');
const editInput = document.getElementById('edit-input');
const cancelEditBtn = document.getElementById('cancel-edit-btn');

// Storage Keys
const STORAGE_KEY = 'taskmaster_todos';
const THEME_KEY = 'taskmaster_theme';

// ==========================================
// 2. Application State
// ==========================================
let todos = loadTodos();
let currentFilter = 'all';
let editingTodoId = null;

// ==========================================
// 3. Storage & Theme Helpers
// ==========================================
function saveTodos() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
}

function loadTodos() {
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored ? JSON.parse(stored) : [];
}

function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  if (themeToggleBtn) {
    themeToggleBtn.textContent = theme === 'light' ? '☀️' : '🌙';
  }
  localStorage.setItem(THEME_KEY, theme);
}

// ==========================================
// 4. UI Render Engine
// ==========================================
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
  saveTodos(); // Save current state to LocalStorage on every UI update
  todoList.innerHTML = '';

  const filteredTodos = getFilteredTodos();

  // Render Empty State Placeholder
  if (filteredTodos.length === 0) {
    const filterText = currentFilter !== 'all' ? ` ${currentFilter}` : '';
    todoList.innerHTML = `
      <li class="empty-state">
        🎉 No${filterText} tasks found.
      </li>
    `;
    updateTaskCounter();
    return;
  }

  // Render List Items
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

// ==========================================
// 5. Event Handlers & Listeners
// ==========================================

// Add New Task Form Submission
todoForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const text = todoInput.value.trim();

  // Guard against empty submissions
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

// Delegation Handler for Toggle, Edit, and Delete
todoList.addEventListener('click', (e) => {
  const target = e.target;
  const li = target.closest('li');
  if (!li) return;

  const id = Number(li.dataset.id);

  if (target.classList.contains('delete-btn')) {
    // Delete Task
    todos = todos.filter(todo => todo.id !== id);
    renderTodos();
  } else if (target.classList.contains('edit-btn')) {
    // Open Edit Modal
    const todo = todos.find(t => t.id === id);
    if (todo) {
      editingTodoId = id;
      editInput.value = todo.text;
      editDialog.showModal();
    }
  } else {
    // Toggle Completion Status
    todos = todos.map(todo => {
      if (todo.id === id) {
        return { ...todo, completed: !todo.completed };
      }
      return todo;
    });
    renderTodos();
  }
});

// Filter Buttons Handler
filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    currentFilter = btn.dataset.filter;
    renderTodos();
  });
});

// Clear Completed Tasks
if (clearCompletedBtn) {
  clearCompletedBtn.addEventListener('click', () => {
    todos = todos.filter(todo => !todo.completed);
    renderTodos();
  });
}

// Edit Form Modal Submission
editForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const newText = editInput.value.trim();
  
  if (!newText || !editingTodoId) return;

  todos = todos.map(t => (t.id === editingTodoId ? { ...t, text: newText } : t));
  editDialog.close();
  renderTodos();
});

// Cancel Edit Button
if (cancelEditBtn) {
  cancelEditBtn.addEventListener('click', () => {
    editDialog.close();
  });
}

// Theme Switcher Toggle
if (themeToggleBtn) {
  themeToggleBtn.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    applyTheme(newTheme);
  });
}

// ==========================================
// 6. Application Startup Initialization
// ==========================================
const savedTheme = localStorage.getItem(THEME_KEY) || 'dark';
applyTheme(savedTheme);
renderTodos();