#!/usr/bin/env node

const fs = require('fs');
const path = './tasks.json';
const args = process.argv.slice(2);

if (!fs.existsSync(path)) fs.writeFileSync(path, '[]');

const tasks = JSON.parse(fs.readFileSync(path, 'utf8'));

function save() {
    fs.writeFileSync(path, JSON.stringify(tasks, null, 2));
}

function now() {
    return new Date().toISOString();
}

function generateId() {
    return tasks.length ? Math.max(...tasks.map(t => t.id)) + 1 : 1;
}

const [command, ...rest] = args;

switch (command) {
    case 'add': {
        const description = rest.join(' ');
        const task = {
            id: generateId(),
            description,
            status: 'todo',
            createdAt: now(),
            updatedAt: now()
        };
        tasks.push(task);
        save();
        console.log('✅ Task added:', task);
        break;
    }

    case 'update': {
        const id = parseInt(rest[0]);
        const description = rest.slice(1).join(' ');
        const task = tasks.find(t => t.id === id);
        if (!task) return console.log('❌ Task not found');
        task.description = description;
        task.updatedAt = now();
        save();
        console.log('✏️ Task updated:', task);
        break;
    }

    case 'delete': {
        const id = parseInt(rest[0]);
        const index = tasks.findIndex(t => t.id === id);
        if (index === -1) return console.log('❌ Task not found');
        const removed = tasks.splice(index, 1)[0];
        save();
        console.log('🗑️ Task deleted:', removed);
        break;
    }

    case 'status': {
        const id = parseInt(rest[0]);
        const newStatus = rest[1];
        if (!['todo', 'in-progress', 'done'].includes(newStatus)) {
            return console.log('❌ Invalid status');
        }
        const task = tasks.find(t => t.id === id);
        if (!task) return console.log('❌ Task not found');
        task.status = newStatus;
        task.updatedAt = now();
        save();
        console.log('🔄 Status updated:', task);
        break;
    }

    case 'mark-in-progress': {
        const id = parseInt(rest[0]);
        const task = tasks.find(t => t.id === id);
        if (!task) return console.log('❌ Task not found');
        task.status = 'in-progress';
        task.updatedAt = now();
        save();
        console.log('🔄 Task marked as in-progress');
        break;
    }

    case 'mark-done': {
        const id = parseInt(rest[0]);
        const task = tasks.find(t => t.id === id);
        if (!task) return console.log('❌ Task not found');
        task.status = 'done';
        task.updatedAt = now();
        save();
        console.log('✅ Task marked as done');
        break;
    }


    case 'list': {
        const filter = rest[0];
        const filtered = filter
            ? tasks.filter(t => t.status === filter)
            : tasks;
        if (filtered.length === 0) return console.log('📭 No tasks found');
        filtered.forEach(t => {
            console.log(`${t.id}. [${t.status}] ${t.description}`);
        });
        break;
    }

    default:
        console.log('📘 Commands:');
        console.log('  add "description"');
        console.log('  update <id> "new description"');
        console.log('  delete <id>');
        console.log('  status <id> <todo|in-progress|done>');
        console.log('  list [status]');
}
