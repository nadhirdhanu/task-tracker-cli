#!/usr/bin/env node
const fs = require('fs');
const { get } = require('http');
const path = require('path');
const crypto = require('crypto');

// File paths
const USERS_FILE = path.join(__dirname, 'users.json');
const SESSION_FILE = path.join(__dirname, 'session.json');
const TASKS_FILE = path.join(__dirname, 'tasks.json');

// Helpers
const loadJSON = (file) => fs.existsSync(file) ? JSON.parse(fs.readFileSync(file)) : [];
const saveJSON = (file, data) => fs.writeFileSync(file, JSON.stringify(data, null, 2));
const now = () => new Date().toISOString();
const getSession = () => fs.existsSync(SESSION_FILE) ? JSON.parse(fs.readFileSync(SESSION_FILE)) : null;

// Parse command
const [command, ...args] = process.argv.slice(2);
const validCommands = [
    'register', 'login', 'logout',
    'add', 'update', 'delete',
    'status', 'progress', 'done', 'list'
];

switch (command) {
    case 'register': {
        const [username, password] = args;

        if (!username || !password || username.trim() === '' || password.trim() === '') {
            console.log('❌ Username and password are required and cannot be empty.');
            break;
        }

        const normalizedUsername = username.trim().toLowerCase();
        const users = loadJSON(USERS_FILE);

        if (users.find(u => u.username.toLowerCase() === normalizedUsername)) {
            console.log('❌ Username already exists');
            break;
        }

        const hashedPassword = crypto.createHash('sha256').update(password).digest('hex');

        users.push({ username: normalizedUsername, password: hashedPassword });
        saveJSON(USERS_FILE, users);
        console.log('✅ Registered successfully');
        break;
    }

    case 'login': {
        const [username, password] = args;
        const users = loadJSON(USERS_FILE);
        const user = users.find(u => u.username === username && u.password === password);
        if (!user) {
            console.log('❌ Invalid credentials');
            break;
        }
        saveJSON(SESSION_FILE, { username });
        console.log(`🔓 Logged in as ${username}`);
        break;
    }

    case 'logout': {
        if (fs.existsSync(SESSION_FILE)) fs.unlinkSync(SESSION_FILE);
        console.log('🔒 Logged out');
        break;
    }
}

// Task commands (require login)
if (['add', 'update', 'delete', 'status', 'progress', 'done', 'list'].includes(command)) {
    const session = getSession();
    if (!session) {
        console.log('🔐 Please login first');
        console.log('Use "login <username> <password>" to log in');
        console.log('Use "register <username> <password>" to create an account');
        process.exit(1);
    }

    const tasks = loadJSON(TASKS_FILE);

    switch (command) {
        case 'add': {
            const description = args.join(' ');
            const task = {
                id: Date.now(),
                description,
                status: 'todo',
                createdAt: now(),
                updatedAt: now(),
                owner: session.username
            };
            tasks.push(task);
            saveJSON(TASKS_FILE, tasks);
            console.log(`✅ Task added successfully (ID: ${task.id})`);
            break;
        }

        case 'update': {
            const [id, ...descParts] = args;
            const task = tasks.find(t => t.id == id && t.owner === session.username);
            if (!task) return console.log('❌ Task not found or unauthorized');
            task.description = descParts.join(' ');
            task.updatedAt = now();
            saveJSON(TASKS_FILE, tasks);
            console.log('✏️ Task updated successfully');
            break;
        }

        case 'delete': {
            const [id] = args;
            const index = tasks.findIndex(t => t.id == id && t.owner === session.username);
            if (index === -1) return console.log('❌ Task not found or unauthorized');
            tasks.splice(index, 1);
            saveJSON(TASKS_FILE, tasks);
            console.log('🗑️ Task deleted successfully');
            break;
        }

        case 'status': {
            const [id] = args;
            const task = tasks.find(t => t.id == id && t.owner === session.username);
            if (!task) return console.log('❌ Task not found or unauthorized');
            console.log(`📌 Status: ${task.status}`);
            break;
        }

        case 'progress': {
            const [id] = args;
            const task = tasks.find(t => t.id == id && t.owner === session.username);
            if (!task) return console.log('❌ Task not found or unauthorized');
            task.status = 'in-progress';
            task.updatedAt = now();
            saveJSON(TASKS_FILE, tasks);
            console.log('🚧 Task marked as in-progress');
            break;
        }

        case 'done': {
            const [id] = args;
            const task = tasks.find(t => t.id == id && t.owner === session.username);
            if (!task) return console.log('❌ Task not found or unauthorized');
            task.status = 'done';
            task.updatedAt = now();
            saveJSON(TASKS_FILE, tasks);
            console.log('✅ Task marked as done');
            break;
        }

        case 'list': {
            const [statusFilter] = args;
            const userTasks = tasks.filter(t => t.owner === session.username);
            const filtered = statusFilter ? userTasks.filter(t => t.status === statusFilter) : userTasks;
            if (filtered.length === 0) return console.log('📭 No tasks found');
            filtered.forEach(t => {
                console.log(`${t.id}. [${t.status}] ${t.description}`);
            });
            break;
        }
    }
}

const session = getSession();

if (!command || !validCommands.includes(command)) {
    if (!command) {
        if (!session) {
            console.log('🔐 You are not logged in.');
            console.log('📘 Available commands:');
            console.log('  register <username> <password>   → Create a new account');
            console.log('  login <username> <password>      → Log in to your account');
        } else {
            console.log(`👋 Hello, ${session.username}!`);
            console.log('📘 Task commands:');
            console.log('  add "<description>"              → Add a new task');
            console.log('  update <id> "<new description>"  → Update a task');
            console.log('  delete <id>                      → Delete a task');
            console.log('  status <id>                      → Show task status');
            console.log('  progress <id>                    → Mark task as in-progress');
            console.log('  done <id>                        → Mark task as done');
            console.log('  list [status]                    → List tasks (optional filter)');
            console.log('  logout                           → Log out of your account');
        }
    }
    else {
        console.log(`❌ Invalid command: ${command}`);
    }
    process.exit(1);
}