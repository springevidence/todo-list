import { v1 } from 'uuid'
import { TasksStateType, tasksReducers, tasksThunks } from '../tasksSlice'
import { todolistsThunks } from 'features/TodolistList/model/todolistsSlice'
import { TaskPriorities, TaskStatuses } from 'common/enum/enum'
import { TaskType } from 'features/TodolistList/api/todolistsApi'

let todolistID1: string
let todolistID2: string
let startState: TasksStateType
beforeEach(() => {
  todolistID1 = v1()
  todolistID2 = v1()

  startState = {
    todolistId1: [
      {
        id: '1',
        title: 'CSS',
        status: TaskStatuses.New,
        todoListId: 'todolistId1',
        description: '',
        startDate: '',
        deadline: '',
        addedDate: '',
        order: 0,
        priority: TaskPriorities.Low,
      },
      {
        id: '2',
        title: 'JS',
        status: TaskStatuses.Completed,
        todoListId: 'todolistId1',
        description: '',
        startDate: '',
        deadline: '',
        addedDate: '',
        order: 0,
        priority: TaskPriorities.Low,
      },
      {
        id: '3',
        title: 'React',
        status: TaskStatuses.New,
        todoListId: 'todolistId1',
        description: '',
        startDate: '',
        deadline: '',
        addedDate: '',
        order: 0,
        priority: TaskPriorities.Low,
      },
    ],
    todolistId2: [
      {
        id: '1',
        title: 'bread',
        status: TaskStatuses.New,
        todoListId: 'todolistId2',
        description: '',
        startDate: '',
        deadline: '',
        addedDate: '',
        order: 0,
        priority: TaskPriorities.Low,
      },
      {
        id: '2',
        title: 'milk',
        status: TaskStatuses.Completed,
        todoListId: 'todolistId2',
        description: '',
        startDate: '',
        deadline: '',
        addedDate: '',
        order: 0,
        priority: TaskPriorities.Low,
      },
      {
        id: '3',
        title: 'tea',
        status: TaskStatuses.New,
        todoListId: 'todolistId2',
        description: '',
        startDate: '',
        deadline: '',
        addedDate: '',
        order: 0,
        priority: TaskPriorities.Low,
      },
    ],
  }
})

test('correct task should be deleted from correct array', () => {
  const action = tasksThunks.removeTask.fulfilled({ todolistId: 'todolistId2', taskId: '2' }, 'requestId', {
    todolistId: 'todolistId2',
    taskId: '2',
  })

  const endState = tasksReducers(startState, action)

  expect(endState['todolistId1'].length).toBe(3)
  expect(endState['todolistId2'].length).toBe(2)
  expect(endState['todolistId2'].every((t) => t.id !== '2')).toBeTruthy()
})

test('correct task should be added to correct array', () => {
  //const action = addTaskAC("juce", "todolistId2");
  const action = tasksThunks.addTask.fulfilled(
    {
      task: {
        todoListId: 'todolistId2',
        title: 'juce',
        status: TaskStatuses.New,
        addedDate: '',
        deadline: '',
        description: '',
        order: 0,
        priority: 0,
        startDate: '',
        id: 'id exists',
      },
    },
    'requestId',
    { title: 'juce', todolistId: 'todolistId2' },
  )

  const endState = tasksReducers(startState, action)

  expect(endState['todolistId1'].length).toBe(3)
  expect(endState['todolistId2'].length).toBe(4)
  expect(endState['todolistId2'][0].id).toBeDefined()
  expect(endState['todolistId2'][0].title).toBe('juce')
  expect(endState['todolistId2'][0].status).toBe(TaskStatuses.New)
})

test('status of specified task should be changed', () => {
  const payload = {
    todolistId: 'todolistId2',
    taskId: '2',
    domainModel: { status: TaskStatuses.New },
  }
  const action = tasksThunks.updateTask.fulfilled(payload, 'requestId', payload)

  const endState = tasksReducers(startState, action)

  expect(endState['todolistId1'][1].status).toBe(TaskStatuses.Completed)
  expect(endState['todolistId2'][1].status).toBe(TaskStatuses.New)
})

test('title of specified task should be changed', () => {
  const payload = { taskId: '2', domainModel: { title: 'yogurt' }, todolistId: 'todolistId2' }

  const action = tasksThunks.updateTask.fulfilled(payload, 'requestId', payload)

  const endState = tasksReducers(startState, action)

  expect(endState['todolistId1'][1].title).toBe('JS')
  expect(endState['todolistId2'][1].title).toBe('yogurt')
  expect(endState['todolistId2'][0].title).toBe('bread')
})

test('new array should be added when new todolist is added', () => {
  const action = todolistsThunks.addTodolist.fulfilled(
    {
      todolist: {
        id: 'blabla',
        title: 'new todolist',
        order: 0,
        addedDate: '',
      },
    },
    'requestId',
    { title: 'new todolist' },
  )

  const endState = tasksReducers(startState, action)

  const keys = Object.keys(endState)
  const newKey = keys.find((k) => k !== 'todolistId1' && k !== 'todolistId2')
  if (!newKey) {
    throw Error('new key should be added')
  }

  expect(keys.length).toBe(3)
  expect(endState[newKey]).toEqual([])
})

test('propertry with todolistId should be deleted', () => {
  const action = todolistsThunks.removeTodolist.fulfilled({ todolistId: 'todolistId2' }, 'requestId', {
    todolistId: 'todolistId2',
  })

  const endState = tasksReducers(startState, action)

  const keys = Object.keys(endState)

  expect(keys.length).toBe(1)
  expect(endState['todolistId2']).not.toBeDefined()
})

test('empty arrays should be added when we set todolists', () => {
  const action = todolistsThunks.fetchTodolists.fulfilled(
    {
      todolists: [
        { id: '1', title: 'title 1', order: 0, addedDate: '' },
        { id: '2', title: 'title 2', order: 0, addedDate: '' },
      ],
    },
    'requestId',
  )

  const endState = tasksReducers({}, action)

  const keys = Object.keys(endState)

  expect(keys.length).toBe(2)
  expect(endState['1']).toBeDefined()
  expect(endState['2']).toBeDefined()
})

test('tasks should be added for todolist', () => {
  //1 variant
  // const action = tasksThunks.fetchTasks.fulfilled(
  //   { tasks: startState['todolistId1'], todolistId: 'todolistId1' },
  //   'requestId',
  //   'todolistId1',
  // )

  //2 variant
  type FetchTasksAction = {
    type: string
    payload: { tasks: TaskType[]; todolistId: string }
  }
  const action: FetchTasksAction = {
    type: tasksThunks.fetchTasks.fulfilled.type,
    payload: { tasks: startState['todolistId1'], todolistId: 'todolistId1' },
  }
  const endState = tasksReducers(
    {
      todolistId2: [],
      todolistId1: [],
    },
    action,
  )

  expect(endState['todolistId1'].length).toBe(3)
  expect(endState['todolistId2'].length).toBe(0)
})
