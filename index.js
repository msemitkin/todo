$(document).ready(function () {
    let tasks;
    if (localStorage['tasks']) {
        tasks = JSON.parse(localStorage['tasks']);
        tasks.sort(compare);
    } else {
        tasks = [];
    }

    function compare(task1, task2) {
        if (task1.position < task2.position) {
            return 1;
        }
        if (task1.position > task2.position) {
            return -1;
        }
        return 0;
    }

    for (let i = 0; i < tasks.length; i++) {
        prependTaskToList(tasks[i]);
    }

    $(document).on('click', '#add-btn', addTask);

    $(document).on('keyup', '#name', function (e) {
        const enterKeyCode = 13;
        if (e.keyCode === enterKeyCode) {
            addTask();
        }
    });


    $(document).on('click', '.done-btn', function () {
        let taskId = $(this).siblings('.id').val();
        tasks.forEach(task => {
            if (task.id == taskId) {
                task.done = true;
            }
        });
        flushTasksToLocalStorage();
        $(this).closest('li').addClass('done');
    });


    $(document).on('click', '.cancel-btn', function () {
        let taskId = $(this).siblings('.id').val();
        tasks = tasks.filter(task => task.id != taskId);
        flushTasksToLocalStorage()
        $(this).closest('li').fadeOut();
    });

    $(".connectedSortable").sortable({
        stop: function () {
            updateTaskOrder();
        }
    });


    function updateTaskOrder() {
        let taskOrderMap = new Map();
        let position = 0;
        $('.list-group').children('.list-group-item').each(function () {
            let taskId = Number($(this).children('.task').children('.id').val());
            taskOrderMap.set(taskId, position);
            position++;
        });
        tasks.forEach(task => {
            task.position = taskOrderMap.get(task.id);
        });
        flushTasksToLocalStorage();
    }

    function getNewTaskId() {
        let totalTasksCount = tasks.length;
        if (totalTasksCount === 0) {
            return 0;
        } else {
            return tasks[totalTasksCount - 1].id + 1;
        }
    }

    function saveTask(task) {
        tasks.push(task);
        flushTasksToLocalStorage();
    }

    function flushTasksToLocalStorage() {
        localStorage["tasks"] = JSON.stringify(tasks);
    }

    function addTask() {
        let input = $('#name').val().trim();
        if (input !== "") {
            let task = {
                id: getNewTaskId(),
                value: input,
                done: false,
                position: 0
            };
            saveTask(task)
            prependTaskToList(task);
            $('#name').val("").focus();
        }
    }


    function prependTaskToList(task) {
        $('#list').prepend(`
                    <li class="list-group-item ui-state-default ${task.done == true ? 'done' : ''}">
                        <div class="task">
                            <a href='#' class='done-btn'>Done</a>
                            <a href="#">|</a>
                            <a href='#' class='cancel-btn'>Delete</a>
                            <a href="#">|</a>
                            ${task.value}
                            <input type="hidden" class="id" value='${task.id}'>
                            <input type="hidden" class="done" value='${task.done}'>
                        </div>
                    </li>
        `);
    }
});