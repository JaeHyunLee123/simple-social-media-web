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

  return (
    <div className="px-4 py-16 relative min-h-screen">
      <nav
        className={cls(
          "flex justify-end items-center fixed top-0 left-0 w-full px-4 pt-5 text-lg bg-slate-50",
          "dark:bg-gray-900"
        )}
      >
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
      {isHome || !isLogedIn ? null : (
        <nav className="flex justify-center fixed bottom-0 left-0 w-full pb-5">
          <Link href="/">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-8 aspect-square"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
              />
            </svg>
          </Link>
        </nav>
      )}
    </div>
  );
};

export default Layout;
