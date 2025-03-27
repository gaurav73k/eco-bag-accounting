
import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-background p-4">
      <div className="max-w-md text-center space-y-6">
        <div className="space-y-2">
          <h1 className="text-7xl font-bold tracking-tighter animate-slide-in">404</h1>
          <h2 className="text-3xl font-medium animate-slide-in [animation-delay:100ms]">Page not found</h2>
          <p className="text-muted-foreground animate-slide-in [animation-delay:200ms]">
            The page you're looking for doesn't exist or has been moved.
          </p>
        </div>
        
        <div className="pt-4 animate-slide-in [animation-delay:300ms]">
          <Link to="/">
            <Button>
              <Home className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
