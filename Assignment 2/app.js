const fs = require("fs").promises;
const readline = require("readline");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

async function getAllTasks() {
  try {
    const data = await fs.readFile("tasks.json", "utf8");
    return JSON.parse(data);
  } catch (error) {
    console.error("Error reading tasks:", error.message);
    return [];
  }
}

async function listTasks() {
  const tasks = await getAllTasks();
  if (tasks.length === 0) {
    console.log("No tasks found.");
    return;
  }

  console.log("Tasks:");
  tasks.forEach((task, index) => {
    console.log(`${index + 1}. ${task.title} - ${task.status}`);
  });
}

async function addTask(title, description) {
  const tasks = await getAllTasks();
  const newTask = {
    title,
    description,
    status: "not completed",
  };
  tasks.push(newTask);

  try {
    await fs.writeFile("tasks.json", JSON.stringify(tasks, null, 2));
    console.log("Task added successfully!");
  } catch (error) {
    console.error("Error writing tasks:", error.message);
  }
}

async function completeTask(title) {
  const tasks = await getAllTasks();
  const task = tasks.find((t) => t.title === title);

  if (task) {
    task.status = "completed";

    try {
      await fs.writeFile("tasks.json", JSON.stringify(tasks, null, 2));
      console.log(`Task "${title}" marked as completed!`);
    } catch (error) {
      console.error("Error writing tasks:", error.message);
    }
  } else {
    console.log(`Task "${title}" not found.`);
  }
}

async function showMenu() {
  console.log("\nChoose an action:");
  console.log("1. List all tasks");
  console.log("2. Add a new task");
  console.log("3. Mark a task as completed");
  console.log("4. Exit");

  rl.question("Enter your choice: ", async (choice) => {
    try {
      switch (choice) {
        case "1":
          await listTasks();
          showMenu();
          break;
        case "2":
          rl.question("Enter task title: ", (title) => {
            rl.question("Enter task description: ", async (description) => {
              await addTask(title, description);
              showMenu();
            });
          });
          break;
        case "3":
          rl.question("Enter task title to complete: ", async (title) => {
            await completeTask(title);
            showMenu();
          });
          break;
        case "4":
          console.log("Exiting...");
          rl.close();
          break;
        default:
          console.log("Invalid choice. Please try again.");
          showMenu();
          break;
      }
    } catch (error) {
      console.error("An error occurred:", error.message);
      showMenu();
    }
  });
}

showMenu();
