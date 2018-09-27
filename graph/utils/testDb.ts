// this class is for boilerplate demo purpose, it has to be removed

export class Db {
  constructor(public todos, public users) {}

  removeTodo(id) {
    const todo = this.todos.find(t => t.id === id);
    this.todos = this.todos.filter(t => t.id != id);
    return todo;
  }

  addTodo(todo) {
    const newTodo = { ...todo, id: Math.random(), done: false, date: Date.now() };
    this.todos.push(newTodo);
    return newTodo;
  }

  clearTodos() {
    this.todos = [];
  }

  toggleDone(id) {
    this.todos = this.todos.map(t => {
      if (t.id == id) return { ...t, done: !t.done };
      return t;
    });
    return this.todos.find(t => t.id == id);
  }

  removeUser(id) {
    this.users = this.users.filter(u => u.id != id);
  }

  addUser(user) {
    const newUser = { ...user, id: Math.random(), roles: ["client"] };
    this.users.push(newUser);
    return newUser;
  }
}

export const defaultTodo = [
  {
    id: 1,
    title: "Groceries",
    content: "Don't forget Bananas",
    date: Date.now()
  }
];

export const defaultUser = [
  {
    id: 1,
    username: "Thib",
    password: "test",
    roles: ["admin"]
  }
];
