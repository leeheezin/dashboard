"use client";
import { useDispatch, useSelector } from "react-redux";
import { decrement,increment } from "./actions";
import { RootState } from './reducers';
import { CounterState } from './reducers/counter'
import Link from "next/link";

//빈칸 인풋창에 할일 입력, 날짜 지정(지정안하면 날짜없이 저장)
//추가 버튼 클릭시 투두아이템 추가
//삭제 버튼 클릭시 삭제
//전체 삭제
//체크기능, 로컬스토리지 데이터 불러오기,삭제,초기화
// TodoList 구현
// TodoList.tsx 컴포넌트를 만들어서 할 일 목록을 표시하고, 각 항목에 대한 조작을 처리합니다.

// TodoItem 구현
// TodoItem.tsx 컴포넌트를 만들어서 각 할 일 항목에 대한 표현과 완료 여부를 토글하는 등의 기능을 처리합니다.

export default function Page() {
  const co:CounterState = useSelector((state:RootState)=> state.counter);
  const dispatch = useDispatch()
  
  const plusCount = () => {
    dispatch(increment())
  }
  const minusCount = () => {
    dispatch(decrement())
  }
  return (
    <main>
      count : {co.count}
      <button onClick={plusCount}>+</button>
      <button onClick={minusCount}>-</button>
      <Link href="/todo">todo</Link>
    </main>
  )
}
