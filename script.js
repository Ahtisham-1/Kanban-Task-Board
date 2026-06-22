// STEP 1: GRAB HOOKS FROM HTML
// First, we find all the HTML elements we need to talk to and save them in variables.
const addTodoButton = document.getElementById("addTodoButton");
const todoDiv = document.getElementById("todoDiv");
const inProgressDiv = document.getElementById("inProgressDiv");
const doneDiv = document.getElementById("doneDiv");

const myDialog = document.getElementById("myDialog");
const myInput = document.getElementById("myInput");
const myDescriptionInput = document.getElementById("myDescriptionInput");
const myPriority = document.getElementById("myPriority");
const myDate = document.getElementById("myDate");

const saveButton = document.getElementById("saveButton");
const closeButton = document.getElementById("closeButton");

// STEP 2: DEFINE THE DATA LEDGER (STATE)
// Second, we set up our master list. Before doing anything else, we check
// if there are any saved tasks in the browser's storage from last time.
let tasks = JSON.parse(localStorage.getItem("todoTasks")) || [];

// STEP 3: REUSABLE HELPER FUNCTIONS
// Third, we write the helper tools that our app will use over and over again.

// Helper A: Save tasks to the browser's storage ---
function saveTasks() {
  localStorage.setItem("todoTasks", JSON.stringify(tasks));
}

// Helper B: The Card Factory (The Printer) ---
// Takes a task data object and turns it into a physical HTML card on the screen.
function createCards(task) {
  const parentDiv = document.createElement("div");
  parentDiv.id = task.id;
  parentDiv.draggable = "true";

  const childTitle = document.createElement("h3");
  childTitle.textContent = task.title;
  parentDiv.appendChild(childTitle);

  const childDescription = document.createElement("p");
  childDescription.textContent = task.description;
  parentDiv.appendChild(childDescription);

  const childPriority = document.createElement("span");
  childPriority.textContent = task.priority;
  parentDiv.appendChild(childPriority);

  if (task.priority === "high") {
    childPriority.style.backgroundColor = "var(--danger-accent)";
  } else if (task.priority === "medium") {
    childPriority.style.backgroundColor = "var(--primary-accent)";
  } else {
    childPriority.style.backgroundColor = "var(--secondary-accent)";
  }

  const childDate = document.createElement("p");
  childDate.textContent = task.date;
  parentDiv.appendChild(childDate);

  const deleteButton = document.createElement("button");
  deleteButton.textContent = "Delete";
  deleteButton.classList.add("delete-btn");
  parentDiv.appendChild(deleteButton);

  const targetColumn = document.getElementById(task.column);
  targetColumn.appendChild(parentDiv);

  parentDiv.addEventListener("dragstart", (e) => {
    e.dataTransfer.setData("todoElement", parentDiv.id);
  });
}

// STEP 4: STARTUP (DRAW SAVED CARDS)
// Fourth, right when the page loads, we run this loop to draw any
// saved tasks from Step 2 using the Factory in Step 3.
tasks.forEach((taskCards) => {
  createCards(taskCards);
});

// STEP 5: USER ACTIONS (EVENT LISTENERS)
// Finally, we set up all our watchers (event listeners) to wait for
// the user to click, type, drag, or drop things.

//  Action A: Open the Modal Dialog
addTodoButton.addEventListener("click", function () {
  myDialog.showModal();
});

//  Action B: Close the Modal Dialog
closeButton.addEventListener("click", function () {
  myDialog.close();
});

//  Action C: Click "Save" to Create a Task
saveButton.addEventListener("click", function () {
  if (myInput.value.trim() === "") {
    console.log("Invalid Task!");
    return;
  } else {
    const taskObject = {
      id: "task-" + Date.now(),
      title: myInput.value,
      description: myDescriptionInput.value,
      priority: myPriority.value,
      date: myDate.value,
      column: "todoDiv",
    };

    tasks.push(taskObject);
    saveTasks();
    createCards(taskObject);

    myInput.value = "";
    myDescriptionInput.value = "";
    myPriority.value = "";
    myDate.value = "";

    myDialog.close();
  }
});

//  Action D: Click "Delete" on any Card (Event Delegation)
document.querySelectorAll(".board-column").forEach((parentElement) => {
  parentElement.addEventListener("click", function (e) {
    if (e.target.classList.contains("delete-btn")) {
      e.target.parentElement.remove();
      tasks = tasks.filter(
        (allitem) => allitem.id !== e.target.parentElement.id,
      );
      saveTasks();
    }
  });
});

//  Action E: Drag and Drop Cards between Columns
document.querySelectorAll(".board-column").forEach((item) => {
  item.addEventListener("dragover", (e) => {
    e.preventDefault();
  });

  item.addEventListener("drop", (e) => {
    e.preventDefault();
    const elementId = e.dataTransfer.getData("todoElement");
    const draggedCard = document.getElementById(elementId);
    item.appendChild(draggedCard);

    const updatedTasks = tasks.find((taskItem) => taskItem.id === elementId);
    updatedTasks.column = item.id;
    saveTasks();
  });
});
