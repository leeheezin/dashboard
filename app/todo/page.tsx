'use client';

import { useEffect, useState } from 'react';
import styles from '../page.module.css';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import ko from 'date-fns/locale/ko';
import { useDispatch, useSelector } from 'react-redux';
import { addTodo, removeTodo } from '../actions';
import { TodoState } from '../reducers/todo';
import { getDocs, query, where, collection, DocumentSnapshot, addDoc, serverTimestamp, QuerySnapshot, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useRouter } from 'next/navigation';

interface RootState {
    todo: TodoState
}
type Todo = {
    id: number;
    uid: string;
    text: string;
    dueDate?: Date;
}
interface TodoProps {
    user: any;
    setUser: (user: any) => void;
}
const Todo: React.FC<TodoProps> = ({ user, setUser }) => {
const [value, setValue] = useState<string>('');
const [date, setDate] = useState<Date | null>(null);
const [forceRender, setForceRender] = useState<boolean>(false);
const todos: TodoState = useSelector((state: RootState) => state.todo);
const dispatch = useDispatch();
const router = useRouter()
console.log('Todos:', todos);

useEffect(() => {
if (!setUser || !user) {
    console.log('404 Not Found');
    router.push('/not-found')
} else {
    setUser(user);
}
}, [user]);

const inputValue = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
};

const dateChange = (selectedDate: Date | null) => {
    setDate(selectedDate);
};
const fetchTodos = async () => {
    console.log('Fetching todos for user:', user);

    if (user) {
    try {
        // Firestore에서 해당 사용자의 투두 리스트 불러오기
        const todosCollection = collection(db, 'todos');
        const q = query(todosCollection, where('uid', '==', user.uid));
        const querySnapshot: QuerySnapshot = await getDocs(q);

        const loadedTodos: Todo[] = [];
        querySnapshot.forEach((doc: DocumentSnapshot) => {
        const todoData = doc.data() as Todo;
        loadedTodos.push({ ...todoData, uid: doc.id });
        });

        // TODO: 기존의 투두를 모두 제거하고 새로운 투두로 업데이트
        dispatch({ type: 'ADD_TODO', payload: loadedTodos });

        // 강제 렌더링을 위한 상태 변경
        setForceRender(prev => !prev);
    } catch (error) {
        console.error('Error fetching todos: ', error);
    }
    }
};
const todoAdd = async () => {
    if (value !== '' && user) {
    try {
        // Firestore에 새로운 투두 추가
        const todoDocRef = await addDoc(collection(db, 'todos'), {
        text: value,
        dueDate: date || null,
        uid: user?.uid,
        createdAt: serverTimestamp(),
        });

        // TODO: 투두 추가 후의 추가 작업 수행
        console.log('Todo added with ID: ', todoDocRef.id);

        setValue('');
        setDate(null);

        fetchTodos();

    } catch (error) {
        console.error('Error adding todo: ', error);
    }
    }
};

const handleRemoveTodo = async (uid: string) => {
try {
// 파이어스토어에서 투두 삭제
await deleteDoc(doc(db, 'todos', uid));

// 투두 삭제 후의 Redux 작업 수행
dispatch(removeTodo(uid));
console.log('Removing todo with UID:', uid);
} catch (error) {
console.error('Error removing todo: ', error);
}
};


useEffect(() => {
    fetchTodos();
}, [dispatch, user]);



return (
    <main className={styles.main}>
    <h1>Todo List</h1>
    <div>
        <DatePicker
        placeholderText="날짜"
        selected={date}
        onChange={dateChange}
        dateFormat="yyyy년 MM월 dd일"
        locale={ko}
        />
        <input onChange={inputValue} value={value} type="text" />
        <button onClick={todoAdd}>추가</button>
    </div>
    <ul>
    {todos &&
        todos.map((todo) => {
            console.log(todo.dueDate); 
            return (
            <div key={todo.id}>
                <li>
                {/* {todo.dueDate ? todo.dueDate.toLocaleDateString('ko-KR') : ''} */}- 
                {todo.text} 
                </li>
                <button onClick={() => handleRemoveTodo(todo.uid)}>삭제</button>
            </div>
            );
    })}

    </ul>
    </main>
    );
};

export default Todo;