interface Todo {
    id: number;
    uid: string;
    text: string;
    dueDate?: Date;
  }
  
  interface TodoAction {
    type: string;
    payload: Todo;
  }
  
  export type TodoState = Todo[];
  
  const todoReducer = (state: TodoState = [], action: TodoAction) => {
    switch (action.type) {
      case 'ADD_TODO':
        return Array.isArray(action.payload) ? action.payload : state;

    
    case 'REMOVE_TODO':
            return state.filter((todo) => todo.uid !== action.payload.uid);

      default:
        return state;
    }
  };
  
  export default todoReducer;
  