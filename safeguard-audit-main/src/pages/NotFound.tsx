
import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { FileSearch, Home } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background animate-fade-in">
      <div className="text-center max-w-md px-6">
        <div className="mb-8 flex justify-center">
          <div className="rounded-full p-4 bg-secondary">
            <FileSearch className="h-12 w-12 text-primary" />
          </div>
        </div>
        <h1 className="text-4xl font-bold mb-4">404</h1>
        <p className="text-xl text-muted-foreground mb-8">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Link to="/">
          <Button className="animate-scale-in">
            <Home className="mr-2 h-4 w-4" />
            Return Home
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
