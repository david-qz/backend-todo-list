const pool = require('../utils/pool');

class Todo {
  id;
  userId;
  task;
  completed;

  constructor(row) {
    this.id = row.id;
    this.userId = row.user_id;
    this.task = row.task;
    this.completed = row.completed;
  }

  static async getAll(userId) {
    const { rows } = await pool.query(
      'select * from todos where user_id = $1 order by created_at asc;',
      [userId]
    );
    return rows.map(row => new Todo(row));
  }

  static async getById(todoId) {
    const { rows } = await pool.query(
      'select * from todos where id = $1;',
      [todoId]
    );
    return new Todo(rows[0]);
  }

  static async insert({ userId, task, completed }) {
    const { rows } = await pool.query(
      `
      insert into todos (user_id, task, completed) values
      ($1, $2, $3)
      returning *;
      `,
      [userId, task, completed]
    );
    return new Todo(rows[0]);
  }

  static async update(todoId, data) {
    const todo = await Todo.getById(todoId);
    if (!todo) return null;
    const { task, completed } = { ...todo, ...data };

    const { rows } = await pool.query(
      `
        update todos
        set task = $2, completed = $3
        where id = $1
        returning *;
        `,
      [todoId, task, completed]
    );
    return new Todo(rows[0]);
  }
}

module.exports.Todo = Todo;
