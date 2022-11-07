//Global variable(s) 
//KEEP IN MIND THE LESS GLOBAL VARIABLES YOU HAVE TO KEEP TRACK OF THE BETTER!
//localStorage.clear();
var lists = localStorage.getItem('lists') ? JSON.parse(localStorage.getItem('lists')) : [];
console.log('stored lists variable has been retrieved: ', lists);
var currentListIndex = localStorage.getItem('currentListIndex') ? JSON.parse(localStorage.getItem('currentListIndex')): -1;
var currentList = localStorage.getItem('currentList') ? JSON.parse(localStorage.getItem('currentList')) : undefined;
console.log('stored currentList variable has been retrieved: ', currentList);
const redButton = document.querySelector('.remove-button');
const greenButton = document.querySelector('.complete-button');
const newListButton = document.querySelector('.list-btn');
const todoButton = document.querySelector('.add-todo');
const todoList = document.querySelector('#todo-list');

//render page so returning user's can see their saved to-do lists
render();

//event listeners
newListButton.addEventListener('click', function () {
    const inputs = document.querySelectorAll('#input-list-name, #input-a-todo');
    addList();
    inputs.forEach(input => {
        input.value = '';
    })
});
todoButton.addEventListener('click', function () {
    const inputs = document.querySelectorAll('#input-list-name, #input-a-todo');
    addTodo();
    inputs.forEach(input => {
        input.value = '';
    })
});

//event listener to add clickable list selection functionality
document.querySelector('#lists').addEventListener('click', function(event) {
    if (event.target.tagName.toLowerCase() === 'li') {
    const eventId = event.target.id;
        selectList(eventId);
        render();
        console.log('The current list structure is', lists);
    }
});
document.querySelector('#lists').addEventListener('click', function (event) {
    if (event.target.tagName.toLowerCase() === 'i') {
        const eventId = event.target.id;
        //update currentList global to newly selected todo (which will default to most
        //recently added todo)
        removeList(eventId);
        render();
    }
});
todoList.addEventListener('change', function(event) {
        //console.log('Before function updates lists variable', currentList);
        markTodoAsCompleted();
        //console.log('After function updates lists', currentList);
});


//functions
function render() {
//this will hold the html that will be displayed in the sidebar
const warningElement = document.getElementById('warning-message');
    if (currentListIndex === -1) {
        warningElement.innerHTML = `<span style="color: white;">
        Error: Please enter a to-do list before you enter
        a to-do!</span>`;


    } else {
        if (lists.length === 0) {
            currentListIndex = -1;
            currentList = null;
            // lists = [];
        }
        warningElement.textContent = '';
        let listsHTML = '<ul class="list-group">';
        // iterate through the lists to get their names
        lists.forEach((list) => {
            if (list.selected) {
                listsHTML += `<li id="${list.id}" class="list-group-item bg-success list-hov">
                ${list.name}<i id="${list.id}" class="fa-solid fa-trash-can trashcan"></i></li>`;
                // var clickItem = document.querySelector('.list-btn');
                // clickItem.addEventListener('click', function(event) {
                //     event.preventDefault();
                //     alert('It worked!!');
                // });
            } else {
                listsHTML += `<li id="${list.id}" class="list-group-item list-hov">
                ${list.name}<i id="${list.id}" class="fa-solid fa-trash-can trashcan"></i></li>`;
            }
        });
        listsHTML += '</ul>';
        //print out the lists

        document.getElementById('lists').innerHTML = listsHTML;
        //print out the name of the current list

        //console.log('in render fcn currently and currentListIndex is:', currentListIndex);
        //console.log('in render fcn currently and lists variable is:', lists);
        
        document.getElementById('current-list-name').innerHTML = lists.length === 0? 'To Do List':currentList.name;
        //iterate over the todos in the current list

        let todosHTML = '<ul class="list-group">';
        if (currentList !== null) {
            redButton.style.display = currentList.todos.length !== 0 ? 'block':'none';
            greenButton.style.display = currentList.todos.length !== 0 ? 'block':'none';
            currentList.todos.forEach((list, index) => {
            todosHTML += `<li class="list-group-item">
            <input id="${list.text}" type="checkbox" data-index=${index}>
            <label for="${list.text}">${list.text}</label>
            </li>`;
            console.log('in for loop of render fcn currently and index is', index);
        });
    }
        todosHTML += '</ul>';
        //print out the todos
        document.getElementById('todo-list').innerHTML = todosHTML;
        //reset app back to initial state if last todo list gets deleted
    }
    save();
}
function addTodo() {
    const todoValue = document.getElementById('input-a-todo').value;
        if (todoValue && (currentListIndex !== -1)) {
            // let tempIndex = currentListIndex;
            currentList.todos.push(
                {
                    text: todoValue,
                    completed: false,
            });
            render();
        } else if (currentListIndex === 0) {
            const removeElement = document.querySelector('.remove-button').style.display = block;
            render();
        } else {
            render();
        } 
}
    
function removeTodo() {
    //use array method filter, which only keeps true items
    currentList.todos = currentList.todos.filter((element, index) => {
        const checkedValue = document.querySelector(`[data-index="${index}"]`);

        return !checkedValue.checked;
    });
    render();
}
function markTodoAsCompleted() {
    //function that marks todos inside of list as completed after they are checked
    //for loop loops through every todo inside selected todo list to find all
    //checked boxes and update 'lists' global variable.
    currentList.todos.forEach((todo, index) => {
        const checkmarkBox = document.querySelector(`[data-index="${index}"]`);
        if (checkmarkBox.checked === true) {
            currentList.todos[index].completed = true;
        } else {
            currentList.todos[index].completed = false;
        }
    });
}
function removeAllTodosCompleted() {
    //will be run within a button event handler
    console.log('Before function updates currentList.todos', currentList);

    for (let i = currentList.todos.length - 1; i >= 0; i--){
        if (currentList.todos[i].completed === true) {
            currentList.todos.splice(i, 1);
        }
    }
    console.log('After function updates currentList.todos', currentList);
    render();
}
function addList() {
    //get the list name from the input text box
    const listName = document.getElementById('input-list-name').value;

    //push new list to lists variable
    if (listName) {
        lists.push(
            {
                id: currentListIndex + 1,
                name: listName,
                todos: []
        });
        //update what item currentList points to
        currentListIndex++;
        currentList = lists[currentListIndex];
        //change 'selected' list attribute to be true only for the last element
        selectLastList();
        //print out data
        render();
    }
}
function selectList(targetId) {
    //call function to change currently selected item
    const currentId = Number(targetId); 
    //change currently selected list to point to newly clicked list
    currentList = lists[targetId];
    // currentListIndex = targetId;
    //iterate through lists to turn currently selected switch off
    lists.forEach((list) => {
        if (list.selected) {
            list.selected = false;
        }
    });
    //turn on selected attribute of newly selected list
    currentList.selected = true;
}

function removeList(targetId) {
    //variables
    const currentId = Number(targetId);
    //currentList = lists[currentId];
    //remove selected list
    lists.splice(currentId, 1);
    //update object indexes to match list indexes after list has been deleted
    lists.forEach((list, index) => {
        list.id = index;
    });
    //reset currentListIndex to same initialized state
    //this avoids errors when re-rendering
    
    //update new last list item to be the new selected one
    selectLastList();
}
function selectLastList() {
    lists.forEach(list => {
        if (list.id === (lists.length - 1)) {
            list.selected = true;
            //update currentList so when rendered it prints selected todo
            currentList = lists[list.id];
            //update currentListIndex for addList() fcn to work properly after elements get deleted
            currentListIndex = list.id;
        } else {
            list.selected = false;
        }
    });
}
function save() {
    localStorage.setItem('currentList', JSON.stringify(currentList));
    localStorage.setItem('lists', JSON.stringify(lists));
    localStorage.setItem('currentListIndex', JSON.stringify(currentListIndex));
}
//after deletion of middle list(s) the object ids get
//thrown off. This function removes updates them before
//they are removed 

    