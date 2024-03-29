import { UpdateDomainTaskModelType } from 'features/TodolistList/tasks-reducer'
import { TaskPriorities, TaskStatuses } from 'common/enum/enum'
import { ResponseType } from 'common/types/types'
import { instance } from 'common/api/base-api'

export const todolistsAPI = {
  getTodolists() {
    return instance.get<Array<TodolistType>>('todo-lists')
  },
  createTodolist(title: string) {
    return instance.post<ResponseType<{ item: TodolistType }>>('todo-lists', {
      title: title,
    })
  },
  deleteTodolist(todolistId: string) {
    return instance.delete<ResponseType>(`todo-lists/${todolistId}`)
  },
  updateTodolist(todolistId: string, title: string) {
    return instance.put<ResponseType>(`todo-lists/${todolistId}`, {
      title: title,
    })
  },

  getTasks(todolistId: string) {
    return instance.get<GetTaskResponse>(`todo-lists/${todolistId}/tasks`)
  },
  createTask(arg: AddTaskArgType) {
    return instance.post<ResponseType<{ item: TaskType }>>(`todo-lists/${arg.todolistId}/tasks`, { title: arg.title })
  },
  updateTask(todolistId: string, taskId: string, model: UpdateTaskModelType) {
    return instance.put<ResponseType>(`todo-lists/${todolistId}/tasks/${taskId}`, model)
  },
  deleteTask(todolistId: string, taskId: string) {
    return instance.delete<ResponseType>(`todo-lists/${todolistId}/tasks/${taskId}`)
  },
}

//types
export type TodolistType = {
  id: string
  title: string
  addedDate: string
  order: number
}
export type ArgUpdateTask = {
  todolistId: string
  taskId: string
  domainModel: UpdateDomainTaskModelType
}
export type ArgRemoveTaskType = {
  todolistId: string
  taskId: string
}

export type AddTaskArgType = {
  title: string
  todolistId: string
}
export type TaskType = {
  description: string
  title: string
  status: TaskStatuses
  priority: TaskPriorities
  startDate: string
  deadline: string
  id: string
  todoListId: string
  order: number
  addedDate: string
}

export type UpdateTaskModelType = {
  title: string
  description: string
  status: number
  priority: number
  startDate: string
  deadline: string
}
export type GetTaskResponse = {
  totalCount: number
  error: null | string
  items: TaskType[]
}
