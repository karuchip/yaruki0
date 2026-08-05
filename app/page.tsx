"use client"

import MemoEditor from "./memo/page"
import TodoDashboard from "./todo/page"

const Dashboard = () => {

  return(
    <>
      <TodoDashboard/>
      <MemoEditor/>
    </>
  )
}

export default Dashboard
