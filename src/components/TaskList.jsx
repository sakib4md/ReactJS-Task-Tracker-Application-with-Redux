export default function TaskList({ tasks, onToggle }) {
  if (tasks.length === 0) {
    return <p className="empty-state">No tasks in this view yet.</p>;
  }

  return (
    <ul className="task-list">
      {tasks.map((task) => (
        <li key={task.id} className={task.completed ? 'task completed' : 'task'}>
          <div>
            <p>{task.title}</p>
            <span className={`badge ${task.priority.toLowerCase()}`}>{task.priority} priority</span>
          </div>
          <button type="button" onClick={() => onToggle(task.id)}>
            {task.completed ? 'Mark Active' : 'Mark Done'}
          </button>
        </li>
      ))}
    </ul>
  );
}
