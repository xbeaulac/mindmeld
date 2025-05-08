import { logout } from "../actions/auth";

export default function LogoutButton() {
  return (
    <form action={logout}>
      <button
        type="submit"
        className="bg-red-500 text-white px-4 py-2 rounded-md"
      >
        Logout
      </button>
    </form>
  );
}
