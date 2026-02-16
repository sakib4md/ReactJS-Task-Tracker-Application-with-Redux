import { useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addTask, setFilter, toggleTask } from './store';
import TaskList from './components/TaskList';

const FILTERS = ['all', 'active', 'completed'];

export default function App() {
  const dispatch = useDispatch();
  const { items, filter } = useSelector((state) => state.tasks);
  const [title, setTitle] = useState('');
  const [priority, setPriority] = useState('Medium');

  const stats = useMemo(() => {
    const completed = items.filter((task) => task.completed).length;
    return {
      total: items.length,
      completed,
      active: items.length - completed
    };
  }, [items]);

  const visibleTasks = useMemo(() => {
    if (filter === 'active') return items.filter((task) => !task.completed);
    if (filter === 'completed') return items.filter((task) => task.completed);
    return items;
  }, [items, filter]);

  const handleSubmit = (event) => {
    event.preventDefault();
    const trimmed = title.trim();
    if (!trimmed) return;

    dispatch(addTask({ title: trimmed, priority }));
    setTitle('');
    setPriority('Medium');
  };

  return (
    <main className="page">
      <section className="card">
        <header className="hero">
          <div>
            <p className="eyebrow">Task Tracker</p>
            <h1>Plan your day with clarity</h1>
            <p className="subtitle">A refreshed Redux-powered UI with quick filters and live progress.</p>
          </div>
          <div className="stats-grid">
            <Stat label="Total" value={stats.total} />
            <Stat label="Active" value={stats.active} />
            <Stat label="Done" value={stats.completed} />
          </div>
        </header>

        <form className="task-form" onSubmit={handleSubmit}>
          <label>
            Task
            <input
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="What needs to be done?"
            />
          </label>
          <label>
            Priority
            <select value={priority} onChange={(event) => setPriority(event.target.value)}>
              <option>High</option>
              <option>Medium</option>
              <option>Low</option>
            </select>
          </label>
          <button type="submit">Add Task</button>
        </form>

        <div className="filters" role="tablist" aria-label="Task filters">
          {FILTERS.map((filterOption) => (
            <button
              key={filterOption}
              type="button"
              className={filter === filterOption ? 'active' : ''}
              onClick={() => dispatch(setFilter(filterOption))}
            >
              {filterOption}
            </button>
          ))}
        </div>

        <TaskList tasks={visibleTasks} onToggle={(taskId) => dispatch(toggleTask(taskId))} />
      </section>
    </main>
  );
}

function Stat({ label, value }) {
  return (
    <article className="stat">
      <span>{label}</span>
      <strong>{value}</strong>
    </article>
  );
}
