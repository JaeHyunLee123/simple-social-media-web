import Link from "next/link";
import { useRouter } from "next/router";
import { cls } from "@lib/client/utils";
interface LayoutProps {
  children: React.ReactNode;
  isLogedIn?: boolean;
}

const Layout = ({ children, isLogedIn = true }: LayoutProps) => {
  const router = useRouter();

  const onLogoutClick = () => {
    fetch("/api/user/log-out", { method: "DELETE" }).finally(() => {
      router.replace("/log-in");
    });
  };
  const isHome = router.pathname === "/";
  const isProfile = router.pathname === "/profile";

  return (
    <div className="px-4 py-16 relative min-h-screen max-w-7xl mx-auto">
      <nav
        className={cls(
          "flex justify-between items-center fixed top-0 left-0 w-full px-4 pt-5 text-lg bg-slate-50",
          "dark:bg-gray-900"
        )}
      >
        <div className="flex space-x-2 items-center">
          <Link href="/">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className={cls(
                "w-8 aspect-square cursor-pointer",
                isHome ? "text-gray-50" : "text-gray-400"
              )}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
              />
            </svg>
          </Link>
          <Link href="/profile">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className={cls(
                "w-8 aspect-square cursor-pointer",
                isProfile ? "text-gray-50" : "text-gray-400"
              )}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
              />
            </svg>
          </Link>
        </div>
        {isLogedIn ? (
          <button onClick={onLogoutClick}>LogOut</button>
        ) : (
          <div className="flex justify-center space-x-2">
            <Link href="/create-account">Sign-up</Link>
            <Link href="/log-in">Log-in</Link>
          </div>
        )}
      </nav>
      <div>{children}</div>
    </div>
  );
};

export default Layout;
