//Global variable(s)
var lists = [];
var currentListIndex = -1;
var currentList;
const redButton = document.querySelector('.remove-button');

//event listeners

//event listener to add clickable list selection functionality
document.querySelector('#lists').addEventListener('click', function(event) {
    if (event.target.tagName.toLowerCase() === 'li') {
        const eventId = event.target.id;
        selectList(eventId);
        render();
    }
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
        redButton.style.display = 'block';
        warningElement.textContent = '';
        let listsHTML = '<ul class="list-group">';
        // iterate through the lists to get their names
        lists.forEach((list) => {
            if (list.selected) {
                listsHTML += `<li id="${list.id}" class="list-group-item bg-success list-btn">
                ${list.name}</li>`;
                // var clickItem = document.querySelector('.list-btn');
                // clickItem.addEventListener('click', function(event) {
                //     event.preventDefault();
                //     alert('It worked!!');
                // });
            } else {
                listsHTML += `<li id="${list.id}" class="list-group-item">
                ${list.name}</li>`;
            }
        });
        listsHTML += '</ul>';
        //print out the lists

        document.getElementById('lists').innerHTML = listsHTML;
        //print out the name of the current list

        console.log(currentList);
        document.getElementById('current-list-name').innerHTML = currentList.name;
        //iterate over the todos in the current list

        let todosHTML = '<ul class="list-group">';
        currentList.todos.forEach((list, index) => {
            todosHTML += `<li class="list-group-item">
            <input id="${list.text}" type="checkbox" data-index=${index}>
            <label for="${list.text}">${list.text}</label>
            </li>`;
        });
        todosHTML += '</ul>';
        //print out the todos
        document.getElementById('todo-list').innerHTML = todosHTML;
    }

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

function addList() {
    //get the list name from the input text box
    const listName = document.getElementById('input-list-name').value;

    //push new list to lists variable
    if (listName) {
        lists.push(
            {
                id: currentListIndex + 1,
                name: listName,
                selected: checkIfFirst(),
                todos: []
        });
        //update what item currentList points to
        currentListIndex++;
        currentList = lists[currentListIndex];
        //print out data
        render();
        console.log(lists);
    }
}
function checkIfFirst() {
    if (lists.length > 0) {
        return false;
    } else {
        return true;
    }
}
function selectList(eventId) {
    //call function to change currently selected item
    const currentId = Number(eventId); 
    //change currently selected list to point to newly clicked list
    currentList = lists[currentId];
    //iterate through lists to turn currently selected switch off
    lists.forEach((list) => {
        if (list.selected) {
            list.selected = false;
        }
    });
    //turn on selected attribute of newly selected list
    currentList.selected = true;
}

function removeList() {

    currentList.splice(currentListIndex, 1);
    render();
}
