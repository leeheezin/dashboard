import { combineReducers } from 'redux';
import counterReducer, { CounterState } from './counter';
import todoReducer, { TodoState } from './todo';

export interface RootState {
    counter: CounterState;
    todo: TodoState;
}

const rootReducer = combineReducers({
    counter: counterReducer,
    todo: todoReducer,
});

export default rootReducer;
