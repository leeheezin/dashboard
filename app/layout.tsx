"use client";

import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Provider } from 'react-redux'
import store from './store'
import Link from 'next/link';

const inter = Inter({ subsets: ['latin'] })

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Link href='/login'>로그인</Link>
        <Link href='/todo'>todo</Link>
        <Provider store={store}>{children}</Provider>
      </body>
    </html>
  )
}
