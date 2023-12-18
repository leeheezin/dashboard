"use client";
import { useDispatch, useSelector } from "react-redux";
import { decrement,increment } from "./actions";
import { RootState } from './reducers';
import { CounterState } from './reducers/counter'
import Link from "next/link";
import Login from "./login/page";

export default function Home() {
  return (
    <div>
      <h1>HOME</h1>
    </div>
  )
}
