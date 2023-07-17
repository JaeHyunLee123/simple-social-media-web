import Link from "next/link";
import { useRouter } from "next/router";

interface LayoutProps {
  children: React.ReactNode;
  title?: string;
  canGoBack?: boolean;
  hasTabBar?: boolean;
}

const Layout = ({
  title,
  canGoBack = true,
  hasTabBar = true,
  children,
}: LayoutProps) => {
  const router = useRouter();
  const onClick = () => {
    router.back();
  };

  return (
    <div>
      <header>
        {canGoBack ? <button onClick={onClick}>{"<-"}</button> : <div />}
        {title ? <span>{title}</span> : <div />}
        <div></div>
      </header>
      <div>{children}</div>

      {hasTabBar ? (
        <nav>
          <Link href="/">Home</Link>
          <Link href="/create-account">Sign up</Link>
          <Link href="/log-in">Log in</Link>
        </nav>
      ) : null}
    </div>
  );
};

export default Layout;
