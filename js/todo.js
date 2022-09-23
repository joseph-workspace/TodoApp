//Global variable(s)
var lists = [];


function render() {
//this will hold the html that will be displayed in the sidebar
let listHTML = '<ul class="list-group">';
// iterate through the lists to get their names
lists.forEach((list) => {
    listsHTML += `<li class="list-group-item">${list.name}</li>`;
});
listsHTML += '</ul>';
//print out the lists

}