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

addTodoButton.addEventListener("click", function () {
  myDialog.showModal();

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

      const childParagraph = document.createElement("p");
      childParagraph.textContent = myInput.value;
      parentDiv.appendChild(childParagraph);

      const deleteButton = document.createElement("button");
      deleteButton.textContent = "Delete";
      parentDiv.appendChild(deleteButton);

      deleteButton.addEventListener("click", function () {
        parentDiv.remove();
      });

      todoDiv.appendChild(parentDiv);
      myInput.value = "";

      //Makes the elements dragable it only fires up in the start
      parentDiv.addEventListener("dragstart", (e) => {
        e.dataTransfer.setData("todoElement", parentDiv.id);
      });
    }
  });
  // // If my input is empty or user only enters some backspace (thats why we use trim on input value) if statement for that
  // if (myInput.value.trim() === "") {
  //   console.log("Invalid");
  //   return;
  // } else {
  //   //Parent div to which we will append all the children elements we will create and gave it a unique id  and set its draggable = true
  //   const parentDiv = document.createElement("div");
  //   parentDiv.id = "task-" + Date.now();
  //   parentDiv.draggable = "true";

  //   const childParagraph = document.createElement("p");
  //   childParagraph.textContent = myInput.value;
  //   parentDiv.appendChild(childParagraph);

  //   const deleteButton = document.createElement("button");
  //   deleteButton.textContent = "Delete";
  //   parentDiv.appendChild(deleteButton);

  //   deleteButton.addEventListener("click", function () {
  //     parentDiv.remove();
  //   });

  //   todoDiv.appendChild(parentDiv);
  //   myInput.value = "";

  //   //Makes the elements dragable it only fires up in the start
  //   parentDiv.addEventListener("dragstart", (e) => {
  //     e.dataTransfer.setData("todoElement", parentDiv.id);
  //   });
  // }
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
  });
});
