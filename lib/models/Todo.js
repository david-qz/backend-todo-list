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
      'select * from todos where user_id = $1 order by created_at desc',
      [userId]
    );
    return rows.map(row => new Todo(row));
  }
}

module.exports.Todo = Todo;
