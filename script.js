// =========================================================================
// 🚀 KANBAN BOARD JAVASCRIPT: LINE-BY-LINE EXPLANATION
// =========================================================================

// --- SECTION 1: GRABBING ELEMENTS FROM HTML ---
// We find our HTML tags on the page by their IDs and save them as JavaScript variables.
// These variables act as handles so JS can listen to clicks or edit the page later.

// Find the "Create Task" button at the top of the page.
const addTodoButton = document.getElementById("addTodoButton");

// Find the empty Todo column div. This connects to targets where cards will land.
const todoDiv = document.getElementById("todoDiv");

// Find the empty In Progress column div.
const inProgressDiv = document.getElementById("inProgressDiv");

// Find the empty Done column div.
const doneDiv = document.getElementById("doneDiv");

// Find the modal box. We call .showModal() or .close() on this variable to toggle the pop-up.
const myDialog = document.getElementById("myDialog");

// Find the text input box where the user types the task title.
const myInput = document.getElementById("myInput");

// Find the textarea box where the user types the task description.
const myDescriptionInput = document.getElementById("myDescriptionInput");

// Find the dropdown select box where the user picks Low, Medium, or High priority.
const myPriority = document.getElementById("myPriority");

// Find the date input box where the user picks a due date.
const myDate = document.getElementById("myDate");

// Find the "Save" button inside the modal. When clicked, it reads the inputs above.
const saveButton = document.getElementById("saveButton");

// Find the "Close" button inside the modal. When clicked, it hides the modal.
const closeButton = document.getElementById("closeButton");

// --- SECTION 2: SETTING UP DATA STORAGE (THE MASTER LEDGER) ---
// This is the most important part: the "State". We don't want tasks to disappear on refresh,
// so we load them from the browser's disk (localStorage) right when the page opens.

// Look inside the browser storage for a key named "todoTasks".
// - JSON.parse() converts the saved text string back into a real JavaScript list of objects.
// - If nothing is saved (first time using the app), the "|| []" defaults it to a blank list so it doesn't crash.
let tasks = JSON.parse(localStorage.getItem("todoTasks")) || [];

// --- SECTION 3: POP-UP MODAL CONTROLLER ---
// Simple listeners to open and close the modal.

// Watch the "Close" button inside the modal. When clicked, run myDialog.close() to hide the pop-up.
closeButton.addEventListener("click", function () {
  myDialog.close();
});

// Watch the "Create Task" button on the main page. When clicked, open the modal as a focused pop-up.
addTodoButton.addEventListener("click", function () {
  myDialog.showModal();
});

// --- SECTION 4: THE CARD FACTORY (THE PRINTER) ---
// This function is like a template. It receives a single task data object (e.g. {title: "Buy Milk", ...}),
// builds the HTML card elements step-by-step, and puts it in the correct column on the screen.
// By using this function, we can draw cards both when we click "Save" AND when the page loads.

function createCards(task) {
  // 1. Create a blank <div> in JavaScript to act as the task card container.
  const parentDiv = document.createElement("div");

  // 2. Set the card's ID to the unique ID of our task (e.g. task-17189000). This connects the DOM card to our data array!
  parentDiv.id = task.id;

  // 3. Set the HTML attribute 'draggable' to true. This tells the browser: "The user is allowed to drag this div."
  parentDiv.draggable = "true";

  // 4. Create an empty <h3> element to act as the heading.
  const childTitle = document.createElement("h3");
  // 5. Read the title from the task object (task.title) and set it as the text inside our new heading.
  childTitle.textContent = task.title;
  // 6. Put the <h3> heading inside our task card container (parentDiv).
  parentDiv.appendChild(childTitle);

  // 7. Create an empty <p> element to hold the task description.
  const childDescription = document.createElement("p");
  // 8. Read the description from the task object (task.description) and put it inside the paragraph.
  childDescription.textContent = task.description;
  // 9. Put the paragraph inside our task card container.
  parentDiv.appendChild(childDescription);

  // 10. Create an empty <span> element to act as the priority tag.
  const childPriority = document.createElement("span");
  // 11. Read the priority text (low, medium, high) from the task object and set it inside the span.
  childPriority.textContent = task.priority;
  // 12. Put the span badge inside our task card container.
  parentDiv.appendChild(childPriority);

  // 13. Color-coding: Check the task's priority level and set the background color using our CSS variables.
  // This connects the task's data to its visual priority color.
  if (task.priority === "high") {
    childPriority.style.backgroundColor = "var(--danger-accent)"; // Set to red if priority is high
  } else if (task.priority === "medium") {
    childPriority.style.backgroundColor = "var(--primary-accent)"; // Set to yellow if priority is medium
  } else {
    childPriority.style.backgroundColor = "var(--secondary-accent)"; // Set to green if priority is low
  }

  // 14. Create an empty <p> element to hold the due date.
  const childDate = document.createElement("p");
  // 15. Read the date from the task object (task.date) and put it inside the paragraph.
  childDate.textContent = task.date;
  // 16. Put the date paragraph inside our task card container.
  parentDiv.appendChild(childDate);

  // 17. Create an empty <button> element to act as the delete button.
  const deleteButton = document.createElement("button");
  // 18. Put the text "Delete" inside the button.
  deleteButton.textContent = "Delete";
  // 19. Add the class name "delete-btn" to the button. This connects to our Event Delegation listener at the bottom!
  deleteButton.classList.add("delete-btn");
  // 20. Put the delete button inside our task card container.
  parentDiv.appendChild(deleteButton);

  // 21. Find the correct column (Todo, Progress, or Done) by searching the page for the saved column ID (task.column).
  const targetColumn = document.getElementById(task.column);
  // 22. Append (insert) the finished card div inside that specific column so the user can see it.
  targetColumn.appendChild(parentDiv);

  // 23. Add a listener to watch when the user starts dragging this card.
  parentDiv.addEventListener("dragstart", (e) => {
    // Pack the card's unique ID into the drag-and-drop transfer object under the label "todoElement".
    // This connects the card being dragged to the drop event listener later!
    e.dataTransfer.setData("todoElement", parentDiv.id);
  });
}

// --- SECTION 5: SAVING A NEW TASK ---

// Watch the "Save" button inside the modal. When clicked, run this code to bundle the inputs and save.
saveButton.addEventListener("click", function () {
  // 1. Read the title input, trim any empty spaces, and check if it is blank.
  if (myInput.value.trim() === "") {
    // 2. If it is blank, log a warning and stop the function immediately (exit early).
    console.log("Invalid Task!");
    return;
  } else {
    // 3. Create a clean JavaScript object to hold all the user's inputs. This is our task's data structure.
    const taskObject = {
      // Create a unique ID using the prefix "task-" and the current millisecond time.
      id: "task-" + Date.now(),
      title: myInput.value, // Read the text typed in the title box.
      description: myDescriptionInput.value, // Read the text typed in the description box.
      priority: myPriority.value, // Read the selected priority from the dropdown.
      date: myDate.value, // Read the selected date.
      column: "todoDiv", // New tasks always start in the "Todo" column by default.
    };

    // 4. Push (add) our new task data object to our global master tasks array.
    tasks.push(taskObject);
    // 5. Save the updated tasks array to the browser storage.
    saveTasks();
    // 6. Call the factory function (createCards) and pass our taskObject to draw the card on the screen.
    createCards(taskObject);

    // 7. Clear all the input fields in the modal so they are empty for the next task creation.
    myInput.value = "";
    myDescriptionInput.value = "";
    myPriority.value = "";
    myDate.value = "";

    // 8. Close the modal dialog pop-up.
    myDialog.close();
  }
});

// --- SECTION 6: LOCALSTORAGE PERSISTENCE HELPER ---

// A reusable function to save our master tasks list to browser storage.
function saveTasks() {
  // Convert our JavaScript array of objects into a single text string using JSON.stringify,
  // and store it under the key name "todoTasks" inside the browser's localStorage.
  localStorage.setItem("todoTasks", JSON.stringify(tasks));
}

// --- SECTION 7: LOAD ON INITIAL PAGE LOAD ---

// When the page first opens, loop through each task object we loaded from localStorage
// and call our createCards factory function to draw them. This is what prevents tasks from disappearing!
tasks.forEach((taskCards) => {
  createCards(taskCards);
});

// --- SECTION 8: EVENT DELEGATION (DELETIONS) ---
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

// --- SECTION 9: DRAG AND DROP COLUMNS API ---
// Loops through the columns and configures them as drop targets.

// Find all column elements and loop through them.
document.querySelectorAll(".board-column").forEach((item) => {
  // While a card is hovering above a column, run this repeatedly:
  item.addEventListener("dragover", (e) => {
    // Hold the door open (override the browser's default behavior which blocks dropping).
    e.preventDefault();
  });

  // When the card is released (dropped) inside a column, run this:
  item.addEventListener("drop", (e) => {
    // Prevent browser default actions
    e.preventDefault();
    // Retrieve the unique ID of the card that was dragged (packed in Section 4).
    const elementId = e.dataTransfer.getData("todoElement");
    // Find the physical HTML card on the screen using its ID.
    const draggedCard = document.getElementById(elementId);
    // Physically move the card inside this column container (item) visually.
    item.appendChild(draggedCard);

    // Find the task object inside our master tasks array in memory that matches the card's ID.
    const updatedTasks = tasks.find((taskItem) => taskItem.id === elementId);
    // Update the task's column property to match the new column's ID (item.id).
    // This connects the physical screen drag to our permanent data record!
    updatedTasks.column = item.id;
    // Save the updated list to localStorage so the move survives a page refresh.
    saveTasks();
  });
});
