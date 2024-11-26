document.addEventListener('DOMContentLoaded', () => {

	const container = document.querySelector('.container'),
			input = document.querySelector('.form__input'),
			btn = document.querySelector('.form__btn'),
			form = document.querySelector('.form');

	function createToDoList() {
		let list = document.createElement('ul');
		 list.classList.add('todo__list');
		 return list;
	}

	function createToDoItem(todo) {
		let item = document.createElement('li'),
			 buttonGroup = document.createElement('div'),
			 doneButton = document.createElement('button'),
		    deleteButton = document.createElement('button');
		
		item.classList.add('todo__item');
		item.textContent = todo.name;
		if (todo.done) {
			item.classList.add('done');
		}

		buttonGroup.classList.add('todo__item-btns');
		doneButton.classList.add('btn', 'btn-done');
		deleteButton.classList.add('btn', 'btn-delete');

		buttonGroup.append(doneButton);
		buttonGroup.append(deleteButton);
		item.append(buttonGroup);

		return {
			  item,
			  doneButton,
			  deleteButton,
		};
	}

	function loadTodos(key) {
		let todos = localStorage.getItem(key);
		try {
			 return todos ? JSON.parse(todos) : [];
		} catch (e) {
			 console.error('Error parsing JSON from localStorage', e);
			 return [];
		}
  }

  function saveTodos(key, todos) {
		localStorage.setItem(key, JSON.stringify(todos));
  }

  function addToDoItem(todoList, todoItem, todos, storageKey){
	todoItem.doneButton.addEventListener('click', () => {
		todoItem.item.classList.toggle('done');
		let todo = todos.find(t => t.name === todoItem.item.firstChild.textContent);
		if (todo) {
			todo.done = !todo.done;
			saveTodos(storageKey, todos);
		};
	});

	todoItem.deleteButton.addEventListener('click', () => {
		if (confirm('Are you sure?')) {
			todoItem.item.remove();
			let index = todos.findIndex(t => t.name === todoItem.item.firstChild.textContent);
			if (index !== -1) {
				todos.splice(index, 1);
				saveTodos(storageKey, todos);
			}
		}
	});

	todoList.append(todoItem.item);
  }

  let todos = loadTodos('todos'),
  		todoList = createToDoList();

	container.append(todoList);

	todos.forEach(todo => {
		let todoItem = createToDoItem(todo);
		addToDoItem(todoList, todoItem, todos, 'todos');
	});

	input.addEventListener('input', () => {
		btn.disabled = !input.value.trim();
	});

	form.addEventListener('submit', (e) => {
		e.preventDefault();

		if(!input.value){
			return;
		}

		let todo = {
			name: input.value,
			done: false
		}

		todos.push(todo);
		saveTodos('todos', todos);

		let todoItem = createToDoItem(todo);
		addToDoItem(todoList, todoItem, todos, 'todos');

		input.value = '';
		btn.disabled = 'true';
	});

	

})