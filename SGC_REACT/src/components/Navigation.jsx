import { Link } from "react-router-dom";

export function Navigation() {
  return (
    <div>
        <Link to="/tasks">
        <h1>TASK APP</h1>
        </Link>
        <Link to="/tasks-create">create task</Link>
    </div>
  )
}
