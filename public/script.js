const todoInput = document.getElementById('todo-input');
const addBtn = document.getElementById('add-btn');
const todoList = document.getElementById('todo-list');
const API_URL = 'http://localhost:3000/api/todos';
async function fetchTodos() {
    try {
        const response = await fetch(API_URL);
        const todos = await response.json();
        todoList.innerHTML = ''; // Clear existing list
        todos.forEach(todo => {
            renderTodo(todo);
        });
    } catch (error) {
        console.error('Error fetching todos:', error);
    }
}
function renderTodo(todo) {
    const li = document.createElement('li');
    li.dataset.id = todo._id;
    li.textContent = todo.text;
    if (todo.completed) {
        li.classList.add('completed');
    }

    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'Delete';
    deleteBtn.classList.add('delete-btn');

    li.appendChild(deleteBtn);
    todoList.appendChild(li);

    // Add event listeners
    li.addEventListener('click', () => toggleTodo(todo._id, !todo.completed));
    deleteBtn.addEventListener('click', (event) => {
        event.stopPropagation(); // Prevents li click from firing
        deleteTodo(todo._id);
    });
}
async function addTodo() {
    const text = todoInput.value.trim();
    if (!text) return;

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ text })
        });
        const newTodo = await response.json();
        renderTodo(newTodo);
        todoInput.value = ''; // Clear input
    } catch (error) {
        console.error('Error adding todo:', error);
    }
}

async function toggleTodo(id, completed) {
    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ completed })
        });
        if (response.ok) {
            const li = todoList.querySelector(`[data-id="${id}"]`);
            li.classList.toggle('completed');
        }
    } catch (error) {
        console.error('Error toggling todo:', error);
    }
}

async function deleteTodo(id) {
    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: 'DELETE'
        });
        if (response.ok) {
            const li = todoList.querySelector(`[data-id="${id}"]`);
            li.remove();
        }
    } catch (error) {
        console.error('Error deleting todo:', error);
    }
}
document.addEventListener('DOMContentLoaded', fetchTodos);
addBtn.addEventListener('click', addTodo);