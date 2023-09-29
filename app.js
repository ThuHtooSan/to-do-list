const taskInput = document.querySelector('#task-input');
const addTaskBtn = document.querySelector('#addTaskBtn');
const taskContainer = document.querySelector('.task-container');
const removeAllBtn = document.querySelector('#removeAllBtn');

let tasks = [];

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
    } else if (parent.matches('button#removeBtn')) {
        parent.parentElement.classList.add('removed');
        setTimeout(() => {
            parent.parentElement.remove();
        }, 1100);

    // Marking the task as done

    // if the target is the button
    } else if (target.matches('button#markDoneBtn')) {
        if (parent.classList.contains('done')) {
            target.innerHTML = `<i class="fa-regular fa-circle"></i>`;
            parent.classList.remove('done');
        } else {
            target.innerHTML = `<i class="fa-solid fa-circle-check"></i>`;
            parent.classList.add('done');
        }

    // if the target is the icon inside a button
    } else if (parent.matches('button#markDoneBtn')) {
        if (parent.parentElement.classList.contains('done')) {
            target.outerHTML = `<i class="fa-regular fa-circle"></i>`;
            parent.parentElement.classList.remove('done');
        } else {
            target.outerHTML = `<i class="fa-solid fa-circle-check"></i>`;
            parent.parentElement.classList.add('done');
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

    toggleRemoveAll(formattedTasks.length);
}

(function restoreTasks() {
    const tasks = JSON.parse(localStorage.getItem('data'));
    if (!tasks) return;  // exit if no tasks were found

    // add tasks with nice animation + delay
    tasks.forEach((task, index) => {
        setTimeout(() => {
            addTask(task.content, task.isDone, true);
        }, 100 * index)
    });

    // save them after finish restoring
    setTimeout(() => {
        saveTasks();
    }, tasks.length * 100);
})();

function removeAllTasks() {
    const tasks = document.querySelectorAll('.task-container .task');
    tasks.forEach((task, index) => task.remove());
    saveTasks();  // empty localStorage data
    removeAllBtn.classList.remove('show');  // remove the button itself
}

function toggleRemoveAll(length) {
    // if tasks.length > 1, show the removeAllBtn, else hide it
    if (length > 1 && !removeAllBtn.classList.contains('show')) {
        removeAllBtn.classList.add('show');
    } else if (length < 2 && removeAllBtn.classList.contains('show')) {
        removeAllBtn.classList.remove('show');
    }
}


addTaskBtn.addEventListener('click', () => addTask(taskInput.value));
taskInput.addEventListener('keydown', (e) => {
    if (e.keyCode === 13) addTask(taskInput.value);
});
// manage means marking as done + removing
taskContainer.addEventListener('click', manageTask);
removeAllBtn.addEventListener('click', removeAllTasks);