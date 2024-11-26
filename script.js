document.addEventListener('DOMContentLoaded', () => {

	const container = document.querySelector('.container'),
			input = document.querySelector('.form__input'),
			btn = document.querySelector('.form__btn'),
			form = document.querySelector('.form'),
			done = document.querySelector('.progress__done'),
			progress = document.querySelector('.progress__on');

	let doneCounter = 0,
		 progressCounter = 0;

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
	function loadData() {
		let todos = localStorage.getItem('todos');
		let progressData = localStorage.getItem('progress');

		todos = todos ? JSON.parse(todos) : [];
		
		progressData = progressData ? JSON.parse(progressData) : { doneCounter: 0, progressCounter: 0 };

		return { todos, progressData };
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
		progressRefresh();
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
		progressRefresh();
		
	});

	todoList.append(todoItem.item);
  }

  function progressRefresh() {
	const totalTodos = todos.length;
	const doneTodos = todos.filter(todo => todo.done).length;
	const onProgressTodos = totalTodos - doneTodos;

	const donePercentage = totalTodos > 0 ? (doneTodos / totalTodos) * 100 : 0;
	const onProgressPercentage = totalTodos > 0 ? (onProgressTodos / totalTodos) * 100 : 0;

	done.textContent = `Todo Done: ${donePercentage.toFixed(2)}%`;
	progress.textContent = `Todo On Progress: ${onProgressPercentage.toFixed(2)}%`;

	progressData.doneCounter = doneTodos;
	progressData.progressCounter = onProgressTodos;
	saveData(todos, progressData);
  }

  let { todos, progressData } = loadData(),
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
		progressRefresh();
	});

	progressRefresh();

})