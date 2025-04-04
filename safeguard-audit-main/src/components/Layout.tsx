
import React from "react";
import { Outlet, Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Shield, Upload, Home, LayoutDashboard, ShieldAlert } from "lucide-react";

const Layout: React.FC = () => {
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const navItems = [
    { name: "Home", path: "/", icon: Home },
    { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
    { name: "Submit Content", path: "/submit", icon: Upload },
    { name: "Moderator", path: "/moderator", icon: ShieldAlert },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center">
          <div className="mr-4 flex">
            <Link to="/" className="flex items-center space-x-2">
              <Shield className="h-6 w-6 text-primary" />
              <span className="font-semibold text-lg">SafeGuard</span>
            </Link>
          </div>
          <nav className="flex items-center space-x-6 text-sm font-medium flex-1 justify-center">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "flex items-center transition-colors hover:text-primary underline-animation",
                  isActive(item.path)
                    ? "text-primary font-semibold"
                    : "text-muted-foreground"
                )}
              >
                <item.icon className="h-4 w-4 mr-1" />
                {item.name}
              </Link>
            ))}
          </nav>
        </div>
      </header>
      <main className="flex-1 container py-6 md:py-10">
        <Outlet />
      </main>
      <footer className="py-6 md:px-8 md:py-0 border-t">
        <div className="container flex flex-col items-center justify-between gap-4 md:h-16 md:flex-row">
          <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
            Built with precision and care for a safer digital environment.
          </p>
          <p className="text-center text-sm text-muted-foreground md:text-left">
            © {new Date().getFullYear()} SafeGuard. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
