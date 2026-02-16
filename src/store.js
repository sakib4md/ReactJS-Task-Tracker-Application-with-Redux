import { configureStore, createSlice } from '@reduxjs/toolkit';

const STORAGE_KEY = 'task-planner-state-v1';

const formatDate = (date) => date.toISOString().split('T')[0];

const addDays = (dateText, amount) => {
  const date = new Date(`${dateText}T00:00:00`);
  date.setDate(date.getDate() + amount);
  return formatDate(date);
};

let nextTaskId = Date.now();
const createTask = (title, priority, carriedOver = false) => ({
  id: ++nextTaskId,
  title,
  priority,
  completed: false,
  carriedOver
});

const today = formatDate(new Date());

const fallbackState = {
  currentDate: today,
  selectedDate: today,
  days: {
    [today]: [
      { id: 1, title: 'Plan key goals for today', priority: 'High', completed: false, carriedOver: false },
      { id: 2, title: 'Review yesterday progress', priority: 'Medium', completed: true, carriedOver: false },
      { id: 3, title: 'Prepare tomorrow roadmap', priority: 'Low', completed: false, carriedOver: false }
    ]
  },
  history: []
};

const loadState = () => {
  if (typeof window === 'undefined') return fallbackState;

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return fallbackState;
    const parsed = JSON.parse(raw);

    if (!parsed || typeof parsed !== 'object') return fallbackState;

    const allTasks = Object.values(parsed.days || {}).flat();
    const maxId = allTasks.reduce((max, task) => (task?.id > max ? task.id : max), 0);
    if (maxId > nextTaskId) nextTaskId = maxId;

    return {
      ...fallbackState,
      ...parsed
    };
  } catch {
    return fallbackState;
  }
};

const taskSlice = createSlice({
  name: 'tasks',
  initialState: loadState(),
  reducers: {
    addTask: (state, action) => {
      const { title, priority, date } = action.payload;
      if (!state.days[date]) state.days[date] = [];
      state.days[date].unshift(createTask(title, priority));
    },
    toggleTask: (state, action) => {
      const { date, taskId } = action.payload;
      const task = (state.days[date] || []).find((item) => item.id === taskId);
      if (task) task.completed = !task.completed;
    },
    setSelectedDate: (state, action) => {
      state.selectedDate = action.payload;
    },
    shiftDayForward: (state) => {
      const dayTasks = state.days[state.currentDate] || [];
      const remainingTasks = dayTasks.filter((task) => !task.completed);
      const completedTasks = dayTasks.filter((task) => task.completed);

      const nextDate = addDays(state.currentDate, 1);
      const carried = remainingTasks.map((task) => createTask(task.title, task.priority, true));

      if (!state.days[nextDate]) state.days[nextDate] = [];
      state.days[nextDate] = [...carried, ...state.days[nextDate]];

      state.history.unshift({
        date: state.currentDate,
        plannedCount: dayTasks.length,
        completedCount: completedTasks.length,
        pendingShiftedCount: carried.length,
        completedTitles: completedTasks.map((task) => task.title)
      });

      state.currentDate = nextDate;
      state.selectedDate = nextDate;
    }
  }
});

export const { addTask, toggleTask, setSelectedDate, shiftDayForward } = taskSlice.actions;

export const store = configureStore({
  reducer: {
    tasks: taskSlice.reducer
  }
});

if (typeof window !== 'undefined') {
  store.subscribe(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(store.getState().tasks));
    } catch {
      // Ignore storage issues (private mode/quota) and keep app functional.
    }
  });
}
