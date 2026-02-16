export default function TaskList({ tasks, onToggle }) {
  if (tasks.length === 0) {
    return <p className="empty-state">No tasks planned for this day yet.</p>;
  }

  return (
    <ul className="task-list">
      {tasks.map((task) => (
        <li key={task.id} className={task.completed ? 'task completed' : 'task'}>
          <div>
            <p>{task.title}</p>
            <div className="badge-row">
              <span className={`badge ${task.priority.toLowerCase()}`}>{task.priority} priority</span>
              {task.carriedOver ? <span className="badge carried">Shifted from previous day</span> : null}
            </div>
          </div>
          <button type="button" onClick={() => onToggle(task.id)}>
            {task.completed ? 'Mark Active' : 'Mark Done'}
          </button>
        </li>
      ))}
    </ul>
  );
}
