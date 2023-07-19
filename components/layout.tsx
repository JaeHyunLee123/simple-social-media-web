import Link from "next/link";
import { useRouter } from "next/router";

interface LayoutProps {
  children: React.ReactNode;
  isLogedIn?: boolean;
}

const Layout = ({ children, isLogedIn = true }: LayoutProps) => {
  const router = useRouter();
  const onBackClick = () => {
    router.back();
  };

  const onLogoutClick = () => {
    fetch("/api/user/log-out", { method: "DELETE" }).finally(() => {
      router.replace("/log-in");
    });
  };

  return (
    <div>
      <nav>
        <button onClick={onBackClick}>{"<-"}</button>
        {isLogedIn ? <Link href="/">Home</Link> : null}
        {isLogedIn ? (
          <button onClick={onLogoutClick}>Log out</button>
        ) : (
          <div>
            <Link href="/create-account">Sign up</Link>
            <Link href="/log-in">Log in</Link>
          </div>
        )}
      </nav>
      <div>{children}</div>
    </div>
  );
};

export default Layout;
