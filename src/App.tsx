import { useEffect, useState } from 'react'
import './App.css'

type Task = {
  id: number
  title: string
  done: boolean
}
type Habit = {
  id: number
  title: string
  done: boolean
}
type CalendarEvent = {
  id: number
  title: string
  date: string
}
const pages = ['Dashboard', 'Tasks', 'Calendar', 'Habits', 'Notes']

function App() {
  const [page, setPage] = useState('Dashboard')
  const [habits, setHabits] = useState<Habit[]>(() => { 
    try {
      const todayKey = new Date().toLocaleDateString('en-CA')
      const savedHabits = localStorage.getItem(`mono-habits-${todayKey}`)
  
      return savedHabits
        ? JSON.parse(savedHabits)
        : [
            { id: 1, title: 'Read every day', done: false },
            { id: 2, title: 'Drink enough water', done: false },
            { id: 3, title: 'Learn something new', done: false },
          ]
    } catch {
      return [
        { id: 1, title: 'Read every day', done: false },
        { id: 2, title: 'Drink enough water', done: false },
        { id: 3, title: 'Learn something new', done: false },
      ]
    }
  })
const today = new Date()
const currentHour = today.getHours()

const greeting =
  currentHour < 12
    ? 'Good morning.'
    : currentHour < 18
      ? 'Good afternoon.'
      : 'Good evening.'
const formattedDate = today.toLocaleDateString('en-US', {
  month: 'short',
  day: 'numeric',
  year: 'numeric',
}).toUpperCase()
const currentMonth = today.getMonth()
const currentYear = today.getFullYear()

const monthName = today.toLocaleString('en-US', {
  month: 'long'
}).toUpperCase()

const firstDayOffset =
  (new Date(currentYear, currentMonth, 1).getDay() + 6) % 7

const daysInMonth =
  new Date(currentYear, currentMonth + 1, 0).getDate()
const [tasks, setTasks] = useState<Task[]>(() => {
  try {
    const savedTasks = localStorage.getItem('mono-tasks')

    return savedTasks
      ? JSON.parse(savedTasks) as Task[]
      : [
          { id: 1, title: 'Plan the week', done: true },
          { id: 2, title: 'Read 20 pages', done: false },
          { id: 3, title: 'Work on personal project', done: false },
        ]
  } catch {
    return [
      { id: 1, title: 'Plan the week', done: true },
      { id: 2, title: 'Read 20 pages', done: false },
      { id: 3, title: 'Work on personal project', done: false },
    ]
  }
})

  const [newTask, setNewTask] = useState('')
  const [events, setEvents] = useState<CalendarEvent[]>(() => {
    try {
      const savedEvents = localStorage.getItem('mono-events')
      return savedEvents ? JSON.parse(savedEvents) as CalendarEvent[] : []
    } catch {
      return []
    }
  })
  
  const [newEvent, setNewEvent] = useState('')
  const [eventDate, setEventDate] = useState(
    new Date().toLocaleDateString('en-CA')
  )
  const [selectedDate, setSelectedDate] = useState(
    new Date().toLocaleDateString('en-CA')
  )
  const [editingTask, setEditingTask] = useState<Task | null>(null)
const [editedTitle, setEditedTitle] = useState('')
const [note, setNote] = useState(() => {
  return localStorage.getItem('mono-note') || ''
})
const completedHabits = habits.filter(habit => habit.done).length

function toggleHabit(id: number) {
  setHabits(current =>
    current.map(habit =>
      habit.id === id
        ? { ...habit, done: !habit.done }
        : habit
    )
  )
}

  
useEffect(() => {
  localStorage.setItem('mono-tasks', JSON.stringify(tasks))
}, [tasks])

useEffect(() => {
  localStorage.setItem('mono-note', note)
}, [note])
useEffect(() => {
  localStorage.setItem('mono-events', JSON.stringify(events))
}, [events])
useEffect(() => {
  const todayKey = new Date().toLocaleDateString('en-CA')
  localStorage.setItem(`mono-habits-${todayKey}`, JSON.stringify(habits))
}, [habits])
const completed = tasks.filter(task => task.done).length

const progress = tasks.length ? Math.round((completed / tasks.length) * 100) : 0
  function addTask() {
    if (!newTask.trim()) return
    setTasks([...tasks, { id: Date.now(), title: newTask, done: false }])
    setNewTask('')
  }

  function toggleTask(id: number) {
    setTasks(tasks.map(task =>
      task.id === id ? { ...task, done: !task.done } : task
    ))
  }
  function deleteTask(id: number) {
    setTasks(current =>
      current.filter(task => task.id !== id)
    )
  }
  function addEvent() {
    if (!newEvent.trim() || !eventDate) return
  
    const event: CalendarEvent = {
      id: Date.now(),
      title: newEvent.trim(),
      date: eventDate,
    }
  
    setEvents(current => [...current, event])
    setNewEvent('')
  }
  function deleteEvent(id: number) {
    setEvents(current =>
      current.filter(event => event.id !== id)
    )
  }
  function editTask(id: number) {
    const task = tasks.find(task => task.id === id)
  
    if (!task) return
  
    setEditingTask(task)
    setEditedTitle(task.title)
  }
  
  function saveEditedTask() {
    if (!editingTask || !editedTitle.trim()) return
  
    setTasks(current =>
      current.map(task =>
        task.id === editingTask.id
          ? { ...task, title: editedTitle.trim() }
          : task
      )
    )
  
    setEditingTask(null)
    setEditedTitle('')
  }
  function renderTasks() {
    return (
      <div className="tasks-card">
        {tasks.map(task => (
          <label className="task" key={task.id}>
            <input type="checkbox" checked={task.done} onChange={() => toggleTask(task.id)} />
            <span className={task.done ? 'task-done' : ''}>{task.title}</span>
            <span className="task-status">{task.done ? 'Completed' : 'To do'}</span><button
  className="edit-task"
  onClick={(e) => {
    e.preventDefault()
    editTask(task.id)
  }}
>
  ✎
</button><button
  className="delete-task"
  onClick={(e) => {
    e.preventDefault()
    deleteTask(task.id)
  }}
>
  ×
</button>
          </label>
        ))}
        <div className="add-task">
          <input value={newTask} onChange={e => setNewTask(e.target.value)} onKeyDown={e => e.key === 'Enter' && addTask()} placeholder="Add a new task..." />
          <button onClick={addTask}>Add task +</button>
        </div>
      </div>
    )
  }
  function renderEditModal() {
    if (!editingTask) return null
  
    return (
      <div className="modal-overlay">
        <div className="edit-modal">
          <p className="eyebrow">TASK SETTINGS</p>
          <h2>Edit task</h2>
          <p className="muted">Change the name of your task.</p>
  
          <input
            className="edit-modal-input"
            value={editedTitle}
            onChange={e => setEditedTitle(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && saveEditedTask()}
            autoFocus
          />
  
          <div className="modal-actions">
            <button
              className="cancel-button"
              onClick={() => setEditingTask(null)}
            >
              Cancel
            </button>
  
            <button
              className="save-button"
              onClick={saveEditedTask}
            >
              Save changes
            </button>
          </div>
        </div>
      </div>
    )
  }
  function renderPage() {
    switch (page) {
      case 'Dashboard':
        return (
          <>
            <div className="welcome">
              <div><p className="eyebrow">YOUR PERSONAL WORKSPACE</p><h1>{greeting}</h1><p className="muted">Make today count. One step at a time.</p></div>
              <div className="date">{formattedDate}</div>
            </div>
            <div className="section-heading"><h2>Overview</h2><span className="muted">Your daily snapshot</span></div>
            <div className="stats">
              <div className="stat-card"><p className="card-label">DAILY PROGRESS</p><div className="stat-number">{progress}<small>%</small></div><div className="progress-track"><div style={{ width: `${progress}%` }} /></div><p className="muted">{completed} of {tasks.length} tasks completed</p></div>
              <div className="stat-card"><p className="card-label">TASKS COMPLETED</p><div className="stat-number">{completed}<small>/{tasks.length}</small></div><p className="muted">Keep your momentum going</p></div>
              <div className="stat-card"><p className="card-label">ACTIVE HABITS</p><div className="stat-number">{completedHabits.toString().padStart(2, '0')}</div><p className="muted">Consistency is everything</p></div>
            </div>
            <div className="section-heading"><h2>Today's tasks</h2><span className="muted">{tasks.length} items</span></div>
            {renderTasks()}<div className="section-heading">
  <h2>Upcoming events</h2>
  <span className="muted">
    {events.filter(event => event.date >= today.toLocaleDateString('en-CA')).length} events
  </span>
</div>

<div className="tasks-card">
  {events.filter(event => event.date >= today.toLocaleDateString('en-CA')).length === 0 ? (
    <p className="muted">No upcoming events. Your schedule is clear.</p>
  ) : (
    events
      .filter(event => event.date >= today.toLocaleDateString('en-CA'))
      .sort((a, b) => a.date.localeCompare(b.date))
      .slice(0, 3)
      .map(event => (
        <div className="task" key={event.id}>
          <span>{event.title}</span>
          <span className="task-status">
  {new Date(event.date + 'T12:00:00').toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  }).toUpperCase()}
</span>
        </div>
      ))
  )}
</div>
            <div className="section-heading"><h2>Focus for today</h2></div>
            <div className="focus-card"><div><span className="focus-icon">✦</span><div><strong>Small steps, big progress.</strong><p className="muted">Build your day with intention. Stay focused on what matters.</p></div></div><span className="focus-tag">DAILY REMINDER</span></div>
          </>
        )

      case 'Tasks':
        return (
          <>
            <div className="welcome"><div><p className="eyebrow">STAY ORGANIZED</p><h1>Tasks.</h1><p className="muted">Everything you need to get done.</p></div></div>
            <div className="section-heading"><h2>All tasks</h2><span className="muted">{completed} completed · {tasks.length - completed} remaining</span></div>
            {renderTasks()}
          </>
        )

      case 'Calendar':
        return (
          <>
            <div className="welcome"><div><p className="eyebrow">YOUR SCHEDULE</p><h1>Calendar.</h1><p className="muted">A little structure goes a long way.</p></div></div>
           
            
            <div className="stat-card event-form"><p className="card-label">CREATE NEW EVENT</p>

            <input
  className="event-input"
  type="text"
  value={newEvent}
  onChange={e => setNewEvent(e.target.value)}
  onKeyDown={e => e.key === 'Enter' && addEvent()}
  placeholder="Event name..."
/>

<input
  className="event-input"
  type="date"
  value={eventDate}
  onChange={e => setEventDate(e.target.value)}
/>

<button className="event-add-button" onClick={addEvent}>
  Add event +
</button>
</div><div className="stat-card calendar-card">
  <p className="card-label">
    {monthName} {currentYear}
  </p>

  <div className="calendar-grid">
    {['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'].map(day => (
      <strong key={day}>{day}</strong>
    ))}

    {Array.from({ length: firstDayOffset }, (_, i) => (
      <span className="calendar-empty" key={`empty-${i}`} />
    ))}

{Array.from({ length: daysInMonth }, (_, i) => {
  const day = i + 1
  const dateKey = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`

  return (
    <span
      className={[
        dateKey === selectedDate ? 'selected-day' : '',
        dateKey === today.toLocaleDateString('en-CA') ? 'today' : ''
      ].join(' ')}
      key={day}
      onClick={() => setSelectedDate(dateKey)}
    >
      {day}
  
      {events.some(event => event.date === dateKey) && (
        <span className="event-dot" />
      )}
    </span>
  )
})}
  </div>
</div>
<div className="section-heading">
  <h2>
    Events for {selectedDate}
  </h2>
  <span className="muted">
    {events.filter(event => event.date === selectedDate).length} events
  </span>
</div>

<div className="tasks-card">
{events.filter(event => event.date === selectedDate).length === 0 ? (
  <p className="muted">No events for this day. Add an event above.</p>
) : (
  events
    .filter(event => event.date === selectedDate)
    .map(event => (
      <div className="task" key={event.id}>
        <span>{event.title}</span>
        <span className="task-status">{event.date}</span>
        <button
          className="delete-task"
          onClick={() => deleteEvent(event.id)}
        >
          ×
        </button>
      </div>
    ))
)}
</div>
          </>
        )

      
        case 'Habits':
          return (
            <>
              <div className="welcome">
                <div>
                  <p className="eyebrow">BUILD CONSISTENCY</p>
                  <h1>Habits.</h1>
                  <p className="muted">Small actions create meaningful change.</p>
                </div>
              </div>
  
              <div className="section-heading">
                <h2>Daily habits</h2>
                <span className="muted">
                  {completedHabits} of {habits.length} completed
                </span>
              </div>
  
              <div className="stat-card">
                <p className="card-label">DAILY PROGRESS</p>
                <div className="stat-number">
                  {habits.length
                    ? Math.round((completedHabits / habits.length) * 100)
                    : 0}
                  <small>%</small>                </div>
  

                <div className="progress-track">
                  <div
                    style={{
                      width: `${habits.length ? (completedHabits / habits.length) * 100 : 0}%`
                    }}
                  />
                </div>
              </div>
  
              <div className="tasks-card">
                {habits.map(habit => (
                  <label className="task" key={habit.id}>
                    <input
                      type="checkbox"
                      checked={habit.done}
                      onChange={() => toggleHabit(habit.id)}
                    />
                    <span className={habit.done ? 'task-done' : ''}>
                      {habit.title}
                    </span>
                    <span className="task-status">
                      {habit.done ? 'Completed' : 'Daily'}
                    </span>
                  </label>
                ))}
              </div>
            </>
          )
  

      case 'Notes':
        return (
          <>
            <div className="welcome"><div><p className="eyebrow">YOUR IDEAS, IN ONE PLACE</p><h1>Notes.</h1><p className="muted">A quiet space for your thoughts.</p></div></div>
            <div className="stat-card notes-card"><p className="card-label">QUICK NOTE</p><textarea value={note} onChange={e => setNote(e.target.value)} placeholder="Start writing your thoughts..." /></div>
          </>
        )

      default:
        return null
    }
  }

  return (
    <div className="app">
      <aside className="sidebar">
        <div className="logo">MONO<span>.</span></div>
        <p className="menu-label">WORKSPACE</p>
        <nav>
          {pages.map(item => (
            <a key={item} className={`nav-item ${page === item ? 'active' : ''}`} onClick={() => setPage(item)}>
              <span className="nav-icon">{item === 'Dashboard' ? '◈' : item === 'Tasks' ? '▤' : item === 'Calendar' ? '▦' : item === 'Habits' ? '◇' : '▧'}</span>
              <span>{item}</span>
            </a>
          ))}
        </nav>
        <div className="sidebar-bottom">
          <a className="nav-item"><span className="nav-icon">⚙</span><span>Settings</span></a>
          <div className="profile"><div className="avatar">M</div><div><strong>My Workspace</strong><small>Personal account</small></div></div>
        </div>
      </aside>

      <main className="main">
        <header className="topbar"><span>Workspace / {page}</span><div className="top-right"><span>⌕ Search</span><span>◉</span></div></header>
        <section className="content">
  <div key={page} className="page-transition">
    {renderPage()}{renderEditModal()}
  </div>
  <footer>MONO © 2026 <span>Designed for clarity.</span></footer>
</section>
      </main>
    </div>
  )
}

export default App