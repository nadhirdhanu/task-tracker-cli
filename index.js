const fs = require('fs');
const readline = require('readline-sync');

const TASKS_FILE = './tasks.json';

function loadTasks() {
    return JSON.parse(fs.readFileSync(TASKS_FILE, 'utf8'));
}

function saveTasks(tasks) {
    fs.writeFileSync(TASKS_FILE, JSON.stringify(tasks, null, 2));
}

function listTasks(tasks) {
    if (tasks.length === 0) return console.log('✅ No tasks yet!');
    tasks.forEach((task, i) => {
        console.log(`${i + 1}. [${task.done ? 'x' : ' '}] ${task.title}`);
    });
}

function addTask(tasks) {
    const title = readline.question('Task title: ');
    tasks.push({ title, done: false });
    saveTasks(tasks);
    console.log('✅ Task added!');
}

function markDone(tasks) {
    listTasks(tasks);
    const index = readline.questionInt('Mark which task as done (number)? ') - 1;
    if (tasks[index]) {
        tasks[index].done = true;
        saveTasks(tasks);
        console.log('🎉 Task marked as done!');
    } else {
        console.log('❌ Invalid task number.');
    }
}

function main() {
    const tasks = loadTasks();
    console.log('\n📋 Task Tracker CLI');
    console.log('1. List tasks');
    console.log('2. Add task');
    console.log('3. Mark task as done');
    console.log('4. Exit');

    const choice = readline.questionInt('\nChoose an option: ');

    switch (choice) {
        case 1: listTasks(tasks); break;
        case 2: addTask(tasks); break;
        case 3: markDone(tasks); break;
        case 4: console.log('👋 Goodbye!'); return;
        default: console.log('❌ Invalid choice.');
    }

    readline.question('\nPress Enter to continue...');
    console.clear();
    main(); // Loop again
}

main();
