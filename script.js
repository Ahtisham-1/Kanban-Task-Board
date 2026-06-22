// =========================================================================
// 🚀 KANBAN BOARD JAVASCRIPT: LOGICAL STEP-BY-STEP FLOW (FULL COMMENTS)
// =========================================================================

// ==========================================
// 🔗 STEP 1: GRAB HOOKS FROM HTML
// ==========================================
// We find our HTML tags on the page by their IDs and save them as JavaScript variables.
// These variables act as handles so JS can listen to clicks or edit the page later.

// Find the "Create Task" button on the screen and store it
const addTodoButton = document.getElementById("addTodoButton");

// Find the three column containers where the task cards will live
const todoDiv = document.getElementById("todoDiv");
const inProgressDiv = document.getElementById("inProgressDiv");
const doneDiv = document.getElementById("doneDiv");

// Find the pop-up modal dialog element
const myDialog = document.getElementById("myDialog");

// Find the input boxes inside the pop-up modal
const myInput = document.getElementById("myInput");
const myDescriptionInput = document.getElementById("myDescriptionInput");
const myPriority = document.getElementById("myPriority");
const myDate = document.getElementById("myDate");

// Find the Save and Close buttons inside the pop-up modal
const saveButton = document.getElementById("saveButton");
const closeButton = document.getElementById("closeButton");

// ==========================================
// 📊 STEP 2: DEFINE THE DATA LEDGER (STATE)
// ==========================================
// This is the most important part: the "State". We don't want tasks to disappear on refresh,
// so we load them from the browser's disk (localStorage) right when the page opens.

// Load saved tasks from the browser's storage. If nothing is saved yet, start with a blank list []
let tasks = JSON.parse(localStorage.getItem("todoTasks")) || [];

// ==========================================
// 🛠️ STEP 3: REUSABLE HELPER FUNCTIONS
// ==========================================
// Third, we write the helper tools that our app will use over and over again.

// --- Helper A: Save tasks to the browser's storage ---
// A reusable function to save our master tasks list array to browser storage
function saveTasks() {
  // Convert our tasks array into a plain string and save it under the key "todoTasks"
  localStorage.setItem("todoTasks", JSON.stringify(tasks));
}

// --- Helper B: The Card Factory (The Printer) ---
// A template function that takes a task data object and draws the physical card on the screen
// By using this function, we can draw cards both when we click "Save" AND when the page loads.
function createCards(task) {
  // Create a new blank <div> container to act as the task card
  const parentDiv = document.createElement("div");
  // Set the card's HTML id attribute to its saved unique ID
  parentDiv.id = task.id;
  // Tell the browser this card is allowed to be dragged
  parentDiv.draggable = "true";

  // Create an <h3> heading element for the task title
  const childTitle = document.createElement("h3");
  // Put the task's title text inside the heading element
  childTitle.textContent = task.title;
  // Put the heading inside the task card container
  parentDiv.appendChild(childTitle);

  // Create a <p> paragraph element for the description
  const childDescription = document.createElement("p");
  // Put the task's description text inside the paragraph
  childDescription.textContent = task.description;
  // Put the paragraph inside the task card container
  parentDiv.appendChild(childDescription);

  // Create a <span> tag to act as the priority badge
  const childPriority = document.createElement("span");
  // Put the priority level text (low, medium, high) inside the badge
  childPriority.textContent = task.priority;
  // Put the badge inside the task card container
  parentDiv.appendChild(childPriority);

  // If the priority is "high", color the badge background red
  if (task.priority === "high") {
    childPriority.style.backgroundColor = "var(--danger-accent)";
    // If the priority is "medium", color the badge background yellow
  } else if (task.priority === "medium") {
    childPriority.style.backgroundColor = "var(--primary-accent)";
    // If the priority is "low", color the badge background green
  } else {
    childPriority.style.backgroundColor = "var(--secondary-accent)";
  }

  // Create a <p> paragraph element to hold the due date
  const childDate = document.createElement("p");
  // Put the saved date string inside the paragraph
  childDate.textContent = task.date;
  // Put the date paragraph inside the task card container
  parentDiv.appendChild(childDate);

  // Create a <button> element to act as the delete button
  const deleteButton = document.createElement("button");
  // Put the text "Delete" inside the button
  deleteButton.textContent = "Delete";
  deleteButton.classList.add("delete-btn");
  // Put the delete button inside the task card container
  parentDiv.appendChild(deleteButton);

  // Find the correct column (Todo, Progress, or Done) using the saved column name
  const targetColumn = document.getElementById(task.column);
  // Put the finished task card inside that column
  targetColumn.appendChild(parentDiv);

  // When the user starts dragging this card, run this code:
  parentDiv.addEventListener("dragstart", (e) => {
    // Pack the card's ID into the drag-and-drop transfer object
    e.dataTransfer.setData("todoElement", parentDiv.id);
  });
}

// ==========================================
// 🔄 STEP 4: STARTUP (DRAW SAVED CARDS)
// ==========================================
// Fourth, right when the page loads, we run this loop to draw any
// saved tasks from Step 2 using the Factory in Step 3.

// Loop through each task object we loaded from localStorage and hand it to the factory to draw it
tasks.forEach((taskCards) => {
  createCards(taskCards);
});

// ==========================================
// 🖱️ STEP 5: USER ACTIONS (EVENT LISTENERS)
// ==========================================
// Finally, we set up all our watchers (event listeners) to wait for
// the user to click, type, drag, or drop things.

// --- Action A: Open the Modal Dialog ---
// When the user clicks the "Create Task" button on the main page, pop up the modal dialog
addTodoButton.addEventListener("click", function () {
  myDialog.showModal();
});

// --- Action B: Close the Modal Dialog ---
// When the user clicks the "Close" button inside the modal, hide the modal dialog
closeButton.addEventListener("click", function () {
  myDialog.close();
});

// --- Action C: Click "Save" to Create a Task ---
// When the user clicks the "Save" button inside the modal, run this code:
saveButton.addEventListener("click", function () {
  // If the title input is empty or only has spaces, do nothing and exit early
  if (myInput.value.trim() === "") {
    console.log("Invalid Task!");
    return;
  } else {
    // Bundle all the modal form details into a single JavaScript object
    const taskObject = {
      id: "task-" + Date.now(), // Generate a unique ID using the current millisecond time
      title: myInput.value, // Get the title from the input box
      description: myDescriptionInput.value, // Get the description
      priority: myPriority.value, // Get the priority from the dropdown
      date: myDate.value, // Get the due date
      column: "todoDiv", // Set the starting column to "Todo" by default
    };

    // Add the new task object to our master tasks list array
    tasks.push(taskObject);
    // Save the updated master list to browser storage
    saveTasks();
    // Call the factory function to build and draw the card on the screen
    createCards(taskObject);

    // Reset all the modal form inputs to blank so they are ready for the next task
    myInput.value = "";
    myDescriptionInput.value = "";
    myPriority.value = "";
    myDate.value = "";

    // Close the modal dialog
    myDialog.close();
  }
});

// --- Action D: Click "Delete" on any Card (Event Delegation) ---
// Instead of adding a listener to every card's delete button, we add one listener to the columns.
// This is more efficient and automatically works for any new cards added in the future!

// Find all columns and loop through them.
document.querySelectorAll(".board-column").forEach((parentElement) => {
  // Attach one click listener to each column (Todo, Progress, Done).
  parentElement.addEventListener("click", function (e) {
    // Check if the actual element clicked (e.target) has the class name "delete-btn".
    if (e.target.classList.contains("delete-btn")) {
      // Find the button's parent (the card div) and remove it visually from the screen (DOM).
      e.target.parentElement.remove();
      // Filter out the task object from our tasks list whose ID matches the deleted card's ID.
      tasks = tasks.filter(
        (allitem) => allitem.id !== e.target.parentElement.id,
      );
      // Save the updated, smaller list to localStorage (overwriting the old list).
      saveTasks();
    }
  });
});

// --- Action E: Drag and Drop Cards between Columns ---
// Find all elements with the class "board-column" and loop over them
document.querySelectorAll(".board-column").forEach((item) => {
  // While an item is being dragged over a column, run this repeatedly:
  item.addEventListener("dragover", (e) => {
    // Hold the door open (override browser's default behavior that rejects drops)
    e.preventDefault();
  });

  // When the dragged card is released (dropped) inside a column, run this:
  item.addEventListener("drop", (e) => {
    // Prevent browser default actions
    e.preventDefault();
    // Grab the ID of the card that was dragged
    const elementId = e.dataTransfer.getData("todoElement");
    // Find the physical HTML card on the screen using its ID
    const draggedCard = document.getElementById(elementId);
    // Move the card inside this column visually
    item.appendChild(draggedCard);

    // Find the task object inside our master memory array that matches the dragged card's ID
    const updatedTasks = tasks.find((taskItem) => taskItem.id === elementId);
    // Update the task's column property in memory to match the new column's ID (item.id)
    updatedTasks.column = item.id;
    // Save the updated master list to storage so the move is remembered
    saveTasks();
  });
});
