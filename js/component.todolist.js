import { delegate, emptyElement, insertHTML } from './helpers.js';

export class TodoListComponent {
	constructor($root, Todos, filter) {
		this.$root = $root;
		this.Todos = Todos;
		this.filter = filter;
		this._bindEvents();
		this.render();
	}
	todoEvent (event, selector, handler) {
		delegate(this.$root, selector, event, e => {
			let $el = e.target.closest('[data-id]');
			handler(this.Todos.get($el.dataset.id), $el, e);
		});
	}
	_bindEvents () {
		this.todoEvent('click', '.destroy', (todo) => this.Todos.update(todo));
		this.todoEvent('click', '.toggle', (todo) => this.Todos.toggle(todo));
		this.todoEvent('dblclick', 'label', (_, $li) => {
			$li.classList.add('editing');
			$li.querySelector('.edit').focus();
		});
		this.todoEvent('keyup', '.edit', (todo, $li, e) => {
			let $input = $li.querySelector('.edit');
			if (e.key === 'Enter' && $input.value.length)
				this.Todos.update({ ...todo, title: $input.value })
			if (e.key === 'Escape') {
				$input.value = todo.title;
				this.Todos.revert();
			}
		});
		this.todoEvent('blur', '.edit', (todo, $li) => {
			const title = $li.querySelector('.edit').value;
			this.Todos.update({ ...todo, title });
		});
	}
	renderTodo(todo) {
		const li = document.createElement('li');
		li.dataset.id = todo.id;
		if (todo.completed) { li.classList.add('completed'); }
		insertHTML(li, `
			<div class="view">
				<input class="toggle" type="checkbox" ${todo.completed ? 'checked' : ''}>
				<label></label>
				<button class="destroy"></button>
			</div>
			<input class="edit">
		`);
		li.querySelector('label').textContent = todo.title;
		li.querySelector('.edit').value = todo.title;
		return li;
	}
	render ( filter ) {
		if (filter !== undefined) this.filter = filter;
		emptyElement(this.$root);
		this.Todos.all(this.filter).forEach(todo => {
			this.$root.appendChild( this.renderTodo(todo) );
		});
	}
}