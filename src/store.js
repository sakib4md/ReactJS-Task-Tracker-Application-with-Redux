import { configureStore, createSlice } from '@reduxjs/toolkit';

const taskSlice = createSlice({
  name: 'tasks',
  initialState: {
    items: [
      { id: 1, title: 'Design updated dashboard UI', priority: 'High', completed: false },
      { id: 2, title: 'Connect Redux actions to task form', priority: 'Medium', completed: true },
      { id: 3, title: 'Polish responsive layout', priority: 'Low', completed: false }
    ],
    filter: 'all'
  },
  reducers: {
    addTask: (state, action) => {
      state.items.unshift({
        id: Date.now(),
        title: action.payload.title,
        priority: action.payload.priority,
        completed: false
      });
    },
    toggleTask: (state, action) => {
      const task = state.items.find((item) => item.id === action.payload);
      if (task) task.completed = !task.completed;
    },
    setFilter: (state, action) => {
      state.filter = action.payload;
    }
  }
});

export const { addTask, toggleTask, setFilter } = taskSlice.actions;

export const store = configureStore({
  reducer: {
    tasks: taskSlice.reducer
  }
});
