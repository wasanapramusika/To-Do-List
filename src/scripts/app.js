
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