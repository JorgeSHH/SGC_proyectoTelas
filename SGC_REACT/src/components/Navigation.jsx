import { Link } from "react-router-dom";

export function Navigation() {
  return (
    <div class="bg-black">
      <Link to="/tasks">
        <h1 class="text-white">TASK APP</h1>
      </Link>
      <Link to="/tasks-create">create task</Link>
    </div>
  );
}
