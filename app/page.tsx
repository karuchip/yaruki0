"use client"

import MemoEditor from "./memo/page"
import { PomodoroTimer } from "./timer/page"
import TodoDashboard from "./todo/page"

const Dashboard = () => {

  return(
    <>
      <TodoDashboard/>
      <MemoEditor/>
      <PomodoroTimer/>
    </>
  )
}

export default Dashboard
