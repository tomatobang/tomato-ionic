import { Todo } from './todo.model';
import * as TodoActions from './todo.actions';

const initialState: Todo[] = [];

export function TodosReducer(
  state: Todo[] = initialState,
  action: TodoActions.TodoActionType
) {
  switch (action.type) {
    case TodoActions.ADD_TODO_SUCCEED: {
      return [
        ...state,
        {
          _id: action.payload._id,
          title: action.payload.title,
          type: action.payload.type,
          completed: false,
        },
      ];
    }

    case TodoActions.TOGGLE_TODO_SUCCEED: {
      return state.map(todo => {
        if (action._id === todo._id) {
          return {
            ...todo,
          };
        } else {
          return todo;
        }
      });
    }

    case TodoActions.UPDATE_TODO: {
      return state.map(todo => {
        if (action._id === todo._id) {
          return {
            ...todo,
            title: action.title,
          };
        } else {
          return todo;
        }
      });
    }

    case TodoActions.DELETE_TODO_SUCCEED: {
      return state.filter(todo => action._id !== todo._id);
    }

    case TodoActions.CLEAR_COMPLETED_TODO_SUCCEED: {
      return state.filter(todo => !todo.completed);
    }

    case TodoActions.TOGGLE_ALL_TODO_SUCCEED: {
      const areAllMarked = state.every(todo => todo.completed);
      return state.map(todo => {
        return {
          ...todo,
          completed: !areAllMarked,
        };
      });
    }

    case TodoActions.POPULATE_TODOS: {
      return action.todos;
    }
    default: {
      return state;
    }
  }
}
