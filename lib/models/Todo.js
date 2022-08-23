const pool = require('../utils/pool');

class Todo {
  task;
  completed;

  constructor(row) {
    this.task = row.task;
    this.completed = row.completed;
  }

  static async getAll(userId) {
    const { rows } = await pool.query(
      'select * from todos where user_id = $1 order by created_at asc',
      [userId]
    );
    return rows.map(row => new Todo(row));
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
}

module.exports.Todo = Todo;
