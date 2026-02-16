import { useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addTask, setSelectedDate, shiftDayForward, toggleTask } from './store';
import TaskList from './components/TaskList';

const addDays = (dateText, amount) => {
  const date = new Date(`${dateText}T00:00:00`);
  date.setDate(date.getDate() + amount);
  return date.toISOString().split('T')[0];
};

export default function App() {
  const dispatch = useDispatch();
  const { days, selectedDate, currentDate, history } = useSelector((state) => state.tasks);
  const [title, setTitle] = useState('');
  const [priority, setPriority] = useState('Medium');

  const visibleTasks = days[selectedDate] || [];
  const isCurrentDay = selectedDate === currentDate;

  const stats = useMemo(() => {
    const completed = visibleTasks.filter((task) => task.completed).length;
    return {
      planned: visibleTasks.length,
      completed,
      remaining: visibleTasks.length - completed
    };
  }, [visibleTasks]);

  const handleSubmit = (event) => {
    event.preventDefault();
    const trimmed = title.trim();
    if (!trimmed) return;

    dispatch(addTask({ title: trimmed, priority, date: selectedDate }));
    setTitle('');
    setPriority('Medium');
  };

  return (
    <main className="page">
      <section className="card">
        <header className="hero">
          <div>
            <p className="eyebrow">Task Calendar Planner</p>
            <h1>Plan daily tasks and auto-shift pending work</h1>
            <p className="subtitle">
              Close today to move remaining tasks to tomorrow and keep a daily completion record.
            </p>
          </div>
          <div className="stats-grid">
            <Stat label="Planned" value={stats.planned} />
            <Stat label="Done" value={stats.completed} />
            <Stat label="Remaining" value={stats.remaining} />
          </div>
        </header>

        <section className="calendar-bar" aria-label="calendar controls">
          <button type="button" onClick={() => dispatch(setSelectedDate(addDays(selectedDate, -1)))}>
            Previous Day
          </button>
          <input
            type="date"
            value={selectedDate}
            onChange={(event) => dispatch(setSelectedDate(event.target.value))}
          />
          <button type="button" onClick={() => dispatch(setSelectedDate(addDays(selectedDate, 1)))}>
            Next Day
          </button>
          <button type="button" className="ghost" onClick={() => dispatch(setSelectedDate(currentDate))}>
            Jump to Current Day
          </button>
        </section>

        <form className="task-form" onSubmit={handleSubmit}>
          <label>
            Task
            <input
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder={`Plan a task for ${selectedDate}`}
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

        {isCurrentDay ? (
          <button type="button" className="shift-btn" onClick={() => dispatch(shiftDayForward())}>
            Close Current Day & Shift Remaining to Tomorrow
          </button>
        ) : (
          <p className="note">Viewing a previous/future date. Shift action is only available on current day.</p>
        )}

        <TaskList
          tasks={visibleTasks}
          onToggle={(taskId) => dispatch(toggleTask({ date: selectedDate, taskId }))}
        />

        <section className="history" aria-label="daily records">
          <h2>Daily Records</h2>
          {history.length === 0 ? (
            <p className="empty-state">No closed days yet. Close current day to log completion history.</p>
          ) : (
            <ul>
              {history.map((entry) => (
                <li key={entry.date}>
                  <div>
                    <strong>{entry.date}</strong>
                    <span>
                      Planned: {entry.plannedCount} | Completed: {entry.completedCount} | Shifted:{' '}
                      {entry.pendingShiftedCount}
                    </span>
                    {entry.completedTitles.length > 0 ? (
                      <p>Completed tasks: {entry.completedTitles.join(', ')}</p>
                    ) : (
                      <p>No tasks were completed on this day.</p>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
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
