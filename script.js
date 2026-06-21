//Grabbing all the elements and storing them in variables.
// const myInput = document.getElementById("myInput");
const addTodoButton = document.getElementById("addTodoButton");
const todoDiv = document.getElementById("todoDiv");
const inProgressDiv = document.getElementById("inProgressDiv");
const doneDiv = document.getElementById("doneDiv");

//Dropbox modal elements
const myDialog = document.getElementById("myDialog");

//inside dropbox modal elements
const myInput = document.getElementById("myInput");
const myDescriptionInput = document.getElementById("myDescriptionInput");
const myPriority = document.getElementById("myPriority");
const myDate = document.getElementById("myDate");
const saveButton = document.getElementById("saveButton");
const closeButton = document.getElementById("closeButton");

//Local storage tasks array
let tasks = [];

//Modal close button
closeButton.addEventListener("click", function () {
  myDialog.close();
});


saveButton.addEventListener("click", function () {
  if (myInput.value.trim() === "") {
    console.log("Invalid Task!");
    return;
  } else {
    //Parent div to which we will append all the children elements we will create and gave it a unique id  and set its draggable = true
    const parentDiv = document.createElement("div");
    parentDiv.id = "task-" + Date.now();
    parentDiv.draggable = "true";

    //Title of todo
    const childTitle = document.createElement("h3");
    childTitle.textContent = myInput.value;
    parentDiv.appendChild(childTitle);

    //description of todo
    const childDescription = document.createElement("p");
    childDescription.textContent = myDescriptionInput.value;
    parentDiv.appendChild(childDescription);

    //prority of todo
    const childPriority = document.createElement("span");
    childPriority.textContent = myPriority.value;
    parentDiv.appendChild(childPriority);

    //if else statement for coloring in priority nothing else
    if (myPriority.value === "high") {
      childPriority.style.backgroundColor = "var(--danger-accent)";
    } else if (myPriority.value === "medium") {
      childPriority.style.backgroundColor = "var(--primary-accent)";
    } else {
      childPriority.style.backgroundColor = "var(--secondary-accent)";
    }

    //date of todo
    const childDate = document.createElement("p");
    childDate.textContent = myDate.value;
    parentDiv.appendChild(childDate);

    //delete button of todo
    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete";
    parentDiv.appendChild(deleteButton);

    // why did we create another task object because we have to store data in our local storage if we didnt do this otherwise we had to told the js to push each element one by one rather than that we made an object and pushed that into our global array
    const taskObject = {
      id: parentDiv.id,
      title: myInput.value,
      description: myDescriptionInput.value,
      priority: myPriority.value,
      date: myDate.value,
      column: "todoDiv",
    };

    tasks.push(taskObject);

    //delete button that removes the parent div not the todo div when we click on delete
    deleteButton.addEventListener("click", function () {
      parentDiv.remove();
      tasks = tasks.filter((item) => item.id !== parentDiv.id);
      saveTasks();
    });

    //Appending our parent div to main html todo div also clearing the input value after that
    todoDiv.appendChild(parentDiv);
    myInput.value = "";
    myDescriptionInput.value = "";
    myPriority.value = "";
    myDate.value = "";

    //Makes the elements dragable it only fires up in the start
    parentDiv.addEventListener("dragstart", (e) => {
      e.dataTransfer.setData("todoElement", parentDiv.id);
    });

    //when we save the task the modal dialog should also close
    saveTasks();
    myDialog.close();
  }
});

function saveTasks() {
  localStorage.setItem("todoTasks", JSON.stringify(tasks));
}

//Add todo button when clicked it opens the dialog box nothing else
addTodoButton.addEventListener("click", function () {
  myDialog.showModal();
});

//Drag and drop API Important
document.querySelectorAll(".board-column").forEach((item) => {
  item.addEventListener("dragover", (e) => {
    e.preventDefault();
  });

  item.addEventListener("drop", (e) => {
    e.preventDefault();
    const elementId = e.dataTransfer.getData("todoElement");
    const draggedCard = document.getElementById(elementId);
    item.appendChild(draggedCard);

    //We need to tell javascript where when we dragged the card make sure to save it there so another time we refresh the page the cards should show exactly where we left them without this the cards would pop back to todo div when we refresh the page everythime
    const updatedTasks = tasks.find((taskItem) => taskItem.id === elementId);
    updatedTasks.column = item.id;
    saveTasks();
  });
});
