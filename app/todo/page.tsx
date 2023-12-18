'use client';

import { useEffect, useState } from 'react';
import styles from '../page.module.css';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { ko } from 'date-fns/esm/locale'; 
import { useDispatch, useSelector } from 'react-redux';
import { addTodo, removeTodo } from '../actions';
import { TodoState } from '../reducers/todo';
import { getDocs, query, where, collection, DocumentSnapshot, addDoc, serverTimestamp, QuerySnapshot, deleteDoc, doc, QueryDocumentSnapshot } from 'firebase/firestore';
import 'firebase/compat/firestore';
import { db } from '../lib/firebase';
import { usePathname, useRouter } from 'next/navigation';
import { AiFillCalendar } from "react-icons/ai";
import { RiDeleteBin6Line } from "react-icons/ri";
import { FaCheck } from "react-icons/fa";
import firebase from 'firebase/compat/app';
import Link from 'next/link';

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
const pathname = usePathname();
console.log('Todos:', todos);



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

        dispatch({ type: 'ADD_TODO', payload: loadedTodos });

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
        dueDate: date,
        uid: user?.uid,
        createdAt: serverTimestamp(),
        });

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
    await deleteDoc(doc(db, 'todos', uid));
    dispatch(removeTodo(uid));
    console.log('Removing todo with UID:', uid);
    } catch (error) {
    console.error('Error removing todo: ', error);
    }
};
const deleteCollection = async (collectionPath: string) => {
    console.log('삭제버튼')
    const q = query(collection(db, collectionPath));
    const querySnapshot = await getDocs(q);
  
    querySnapshot.forEach(async (docSnapshot: QueryDocumentSnapshot) => {
        const docRef = doc(db, collectionPath, docSnapshot.id);
        await deleteDoc(docRef);
      });
      fetchTodos();
  };
  const collectionPath = 'todos';

  useEffect(() => {
    const checkAndFetch = async () => {
      try {
        if (!user) {
        //   if (pathname !== '/login') {
        //     router.push('/login');
        //   }
        } else {
            setUser(user);
            await fetchTodos();
        }
      } catch (error) {
        console.error('Error during checkAndFetch:', error);
        // 에러 처리 로직 추가
      }
    };

    checkAndFetch();
  }, [dispatch, user, setUser, router]);



return (
    <main className={styles.main}>
    <h1>Todo List</h1>
    <div>
        <AiFillCalendar />
        <DatePicker placeholderText='날짜' selected={date} onChange={dateChange} dateFormat="yyyy년 MM월 dd일" locale={ko}
        />
        <input onChange={inputValue} value={value} type="text" />
        <button onClick={todoAdd}><FaCheck/></button>
    </div>
    <ul>
    {todos &&
        todos.map((todo) => {
            console.log(todo.dueDate); 
            const dt = new Date(Date.now())
            const dueDate =
                todo.dueDate instanceof firebase.firestore.Timestamp
                ? new Date(todo.dueDate.seconds * 1000 + todo.dueDate.nanoseconds / 1e6)
                : null;

            // 날짜를 지정하지 않은 경우 또는 변환에 실패한 경우에는 '날짜 지정 안됨'을 표시
            const formatDate = dueDate
                ? dueDate.toLocaleDateString('ko-KR')
                : dt.toLocaleDateString('ko-KR');
            return (
                <>
                    <li key={todo.id}>
                    {formatDate}-
                    {todo.text} 
                    </li>
                    <button onClick={() => handleRemoveTodo(todo.uid)}><RiDeleteBin6Line/></button>
                </>
                
            );
            
    })}
    </ul>
    <button onClick={()=>deleteCollection(collectionPath)}>전체삭제</button>
    </main>
    );
};

export default Todo;