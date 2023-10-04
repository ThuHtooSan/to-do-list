const taskInput = document.querySelector('#task-input');
const addTaskBtn = document.querySelector('#addTaskBtn');
const taskContainer = document.querySelector('.task-container');
const removeAllBtn = document.querySelector('#removeAllBtn');

function addTask(content, isDone = false, isRestored = false) {
    if (content === "") return; // exit if user input is blank
    
    const li = document.createElement('li');

    const p = document.createElement('p');
    p.textContent = content;
    taskInput.value = ''; // clear the input

    const markDoneBtn = document.createElement('button');
    markDoneBtn.setAttribute('id', 'markDoneBtn');
    if (!isDone) {
        li.classList.add('task');
        markDoneBtn.innerHTML = `<i class="fa-regular fa-circle"></i>`;
    } else {
        li.classList.add('task', 'done');
        markDoneBtn.innerHTML = `<i class="fa-solid fa-circle-check"></i>`
    }

    const removeBtn = document.createElement('button');
    removeBtn.setAttribute('id', 'removeBtn');
    removeBtn.innerHTML = `<i class="fa-solid fa-trash-can"></i>`;

    [markDoneBtn, p, removeBtn].forEach(elem => li.appendChild(elem));

    if (isRestored) {
        li.style.animation = "slideUp 1s"; // add restore animation
        taskContainer.appendChild(li);
    } else {
        taskContainer.prepend(li);
        saveTasks();
    }
}

function manageTask(e) {
    const target = e.target;
    const parent = target.parentElement;

    // Removing the task
    if (target.matches('button#removeBtn')) {
        parent.classList.add('removed');
        setTimeout(() => {
            parent.remove();
        }, 1100);

    // Marking the task as done
    } else if (target.matches('button#markDoneBtn')) {
        if (parent.classList.contains('done')) {
            target.innerHTML = `<i class="fa-regular fa-circle"></i>`;
            parent.classList.remove('done');
        } else {
            target.innerHTML = `<i class="fa-solid fa-circle-check"></i>`;
            parent.classList.add('done');
        }
    } else return; // don't save if the target 
                   // matches none of the above conditions

    saveTasks();
}

function saveTasks() {
    const tasks = document.querySelectorAll('.task-container .task');

    const formattedTasks = [...tasks].reduce((result, task) => {
        if (!task.classList.contains('removed')) {
            result.push({ 
                content: task.firstElementChild.nextElementSibling.textContent, 
                isDone: task.classList.contains('done')
            });
        }
        return result;
    }, []);

    localStorage.setItem('data', JSON.stringify(formattedTasks));

    // add remove all button accordingly
    removeAllBtn.classList.toggle('show', formattedTasks.length > 1);
}

(function restoreTasks() {
    const data = localStorage.getItem('data');

    if (!data) return; // exit if no tasks were found

    const tasks = JSON.parse(data);

    // add tasks with nice animation + delay
    tasks.forEach((task, index) => {
        setTimeout(() => {
            addTask(task.content, task.isDone, true);
        }, 100 * index)
    });

    // add remove all button accordingly
    setTimeout(() => {
        removeAllBtn.classList.toggle('show', tasks.length > 1);
    }, tasks.length * 100);
})();

function removeAllTasks() {
    taskContainer.innerHTML = "";
    localStorage.removeItem('data');  // empty task data
    removeAllBtn.classList.remove('show');  // hide the button itself
}

addTaskBtn.addEventListener('click', () => addTask(taskInput.value));
taskInput.addEventListener('keydown', (e) => {
    if (e.keyCode === 13) addTask(taskInput.value);
});
// manage means marking as done + removing
taskContainer.addEventListener('click', manageTask);
removeAllBtn.addEventListener('click', removeAllTasks);