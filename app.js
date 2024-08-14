document.addEventListener('DOMContentLoaded', () => {
    const taskInput = document.getElementById('new-task');
    const addTaskBtn = document.getElementById('add-task-btn');
    const taskList = document.getElementById('task-list');
    const filterBtns = document.querySelectorAll('.filter-btn');

    let tasks = [];

    // Load tasks from localStorage
    if (localStorage.getItem('tasks')) {
        tasks = JSON.parse(localStorage.getItem('tasks'));
        renderTasks();
    }

    addTaskBtn.addEventListener('click', addTask);
    taskList.addEventListener('click', handleTaskActions);
    filterBtns.forEach(btn => btn.addEventListener('click', filterTasks));

    function addTask() {
        const taskText = taskInput.value.trim();
        if (taskText !== '') {
            tasks.push({ text: taskText, completed: false });
            taskInput.value = '';
            saveTasks();
            renderTasks();
        }
    }

    function handleTaskActions(e) {
        if (e.target.classList.contains('edit-btn')) {
            const index = e.target.parentElement.dataset.index;
            editTask(index);
        } else if (e.target.classList.contains('delete-btn')) {
            const index = e.target.parentElement.dataset.index;
            deleteTask(index);
        } else if (e.target.tagName === 'LI') {
            const index = e.target.dataset.index;
            toggleComplete(index);
        }
    }

    function editTask(index) {
        const newText = prompt('Edit task:', tasks[index].text);
        if (newText !== null) {
            tasks[index].text = newText.trim();
            saveTasks();
            renderTasks();
        }
    }

    function deleteTask(index) {
        tasks.splice(index, 1);
        saveTasks();
        renderTasks();
    }

    function toggleComplete(index) {
        tasks[index].completed = !tasks[index].completed;
        saveTasks();
        renderTasks();
    }

    function filterTasks(e) {
        const filter = e.target.dataset.filter;
        filterBtns.forEach(btn => btn.classList.remove('active'));
        e.target.classList.add('active');
        renderTasks(filter);
    }

    function renderTasks(filter = 'all') {
        taskList.innerHTML = '';

        tasks.forEach((task, index) => {
            if (filter === 'all' || (filter === 'pending' && !task.completed) || (filter === 'completed' && task.completed)) {
                const li = document.createElement('li');
                li.textContent = task.text;
                li.dataset.index = index;

                if (task.completed) {
                    li.classList.add('completed');
                }

                const editBtn = document.createElement('button');
                editBtn.textContent = 'Edit';
                editBtn.classList.add('edit-btn');

                const deleteBtn = document.createElement('button');
                deleteBtn.textContent = 'Delete';
                deleteBtn.classList.add('delete-btn');

                li.appendChild(editBtn);
                li.appendChild(deleteBtn);

                taskList.appendChild(li);
            }
        });
    }

    function saveTasks() {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }
});
