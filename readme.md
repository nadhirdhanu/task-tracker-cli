# Task Tracker CLI
This is the task to complete the project from https://roadmap.sh/projects/task-tracker. It is a simple command-line tool to manage your tasks efficiently. Track what you need to do, what you're working on, and what you've completed—all from your terminal.

---

## Features

- Add, update, and delete tasks
- Mark tasks as `todo`, `in-progress`, or `done`
- List all tasks or filter by status
- Stores tasks in a local JSON file
- No external dependencies—pure Node.js

---

## Installation

### 1. Clone the repository

```bash
git clone https://github.com/your-username/task-cli.git
cd task-cli
```

### 2. Install and link globally

```bash
npm install
npm link
This makes the CLI available globally as task-cli.
```

## Usage

### Add a new task

```bash
task-cli add "Buy groceries"
# Output: Task added successfully (ID: 1)
```

### Update a task

```bash
task-cli update 1 "Buy groceries and cook dinner"
# Output: Task updated successfully
```

### Delete a task

```bash
task-cli delete 1
# Output: Task deleted successfully
```

### Mark task as in-progress or done

```bash
task-cli mark-in-progress 2
task-cli mark-done 2
```

### List all tasks

```bash
task-cli list
```

### List tasks by status

```bash
task-cli list todo
task-cli list in-progress
task-cli list done
```

## Data Storage

Tasks are stored in a local tasks.json file in the current working directory. If the file doesn't exist, it will be created automatically.

Each task includes:

- id: Unique identifier
- description: Task details
- status: todo, in-progress, or done
- createdAt: Timestamp when task was added
- updatedAt: Timestamp when task was last modified

## Error Handling

The CLI gracefully handles:

- Invalid task IDs
- Unsupported status values
- Missing arguments
- Empty task lists

## Example Workflow

```bash
task-cli add "Write documentation"
task-cli mark-in-progress 1
task-cli update 1 "Write detailed documentation"
task-cli mark-done 1
task-cli list done
```

## Notes

- Requires Node.js v14 or higher
- No external libraries used
- Designed for simplicity and extensibility
