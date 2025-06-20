import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Bot, ArrowLeft, Home } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-neutral-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-14 sm:h-16 items-center">
            <Link to="/" className="flex items-center space-x-2">
              <Bot className="h-6 w-6 sm:h-8 sm:w-8 text-neutral-900" />
              <span className="text-lg sm:text-2xl font-semibold text-neutral-900">CompeteAI</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-neutral-100">
            <span className="text-2xl font-medium text-neutral-700">404</span>
          </div>
          
          <h1 className="font-display text-3xl sm:text-4xl font-medium text-neutral-900 mb-3">
            Page not found
          </h1>
          
          <p className="text-base sm:text-lg text-neutral-600 mb-8 max-w-md">
            Sorry, we couldn't find the page you're looking for. The page may have moved or been deleted.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/">
              <Button className="bg-neutral-900 hover:bg-neutral-800">
                <Home className="h-4 w-4 mr-2" />
                Go back home
              </Button>
            </Link>
            <Button 
              variant="outline" 
              onClick={() => window.history.back()}
              className="border-neutral-300 text-neutral-700 hover:bg-neutral-50"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Go back
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
