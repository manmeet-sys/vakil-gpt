
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { FileX } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <>
      <Header />
      <div className="min-h-screen flex items-center justify-center px-4 bg-legal-light dark:bg-legal-slate/5">
        <div className="text-center max-w-md mx-auto animate-fade-up">
          <div className="w-20 h-20 rounded-full bg-legal-accent/10 flex items-center justify-center mx-auto mb-6">
            <FileX className="w-10 h-10 text-legal-accent" />
          </div>
          <h1 className="text-5xl font-bold mb-4 text-legal-slate">404</h1>
          <p className="text-xl text-legal-muted mb-8">
            The page you are looking for doesn't exist or has been moved.
          </p>
          <Button className="bg-legal-accent hover:bg-legal-accent/90 text-white" asChild>
            <a href="/">Return to Home</a>
          </Button>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default NotFound;
