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
          completed: false,
        },
      ];
    }
    // case TodoActions.ADD_TODO_FAILED: {
    //   return [
    //     ...state,
    //     {
    //       id: action._id,
    //       text: action.text,
    //       completed: false,
    //     },
    //   ];
    // }
    case TodoActions.POPULATE_TODOS: {
      return action.todos;
    }
    case TodoActions.TOGGLE_TODO: {
      return state.map(todo => {
        if (action._id === todo._id) {
          return {
            ...todo,
            completed: !todo.completed,
          };
        } else {
          return todo;
        }
      });
    }
    case TodoActions.DELETE_TODO: {
      return state.filter(todo => action._id !== todo._id);
    }
    case TodoActions.UPDATE_TODO: {
      return state.map(todo => {
        if (action._id === todo._id) {
          return {
            ...todo,
            text: action.title,
          };
        } else {
          return todo;
        }
      });
    }
    case TodoActions.CLEAR_COMPLETED_TODO: {
      return state.filter(todo => !todo.completed);
    }
    case TodoActions.COMPLETE_ALL_TODO: {
      const areAllMarked = state.every(todo => todo.completed);
      return state.map(todo => {
        return {
          ...todo,
          completed: !areAllMarked,
        };
      });
    }
    default: {
      return state;
    }
  }
}
