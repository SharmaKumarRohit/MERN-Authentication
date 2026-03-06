import { ArrowRight, Zap } from "lucide-react";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthProvider";

const Hero = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  return (
    <div className="relative w-full md:h-175 h-dvh bg-neutral-50 font-inter overflow-hidden">
      <section className=" w-full py-12 md:py-24 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="flex flex-col items-center space-y-4 text-center">
            <h1 className="font-semibold text-2xl">
              Welcome {user?.user.username}
            </h1>
            <div className="space-y-2">
              <Badge
                variant="secondary"
                className="mb-4 text-neutral-800 border border-neutral-200"
              >
                <Zap className="mr-1" />
                New: AI-powered note organization
              </Badge>
              <h1 className="text-neutral-800 w-full md:w-5xl text-3xl font-bold tracking-tighter sm:text-4xl lg:text-5xl">
                Your thoughts, organized and accessible everywhere
              </h1>
              <p className="mx-auto max-w-175 text-muted-foreground md:text-lg">
                Capture ideas, organize thoughts, and collaborate seamlessly.
                The modern note-taking app that grows with you and keeps your
                ideas secure in the cloud.
              </p>
            </div>
            <div className="space-x-4">
              <Button
                onClick={() => navigate("/create-note")}
                size="lg"
                className="h-12 px-8"
              >
                Start Taking Notes
                <ArrowRight className="ml-2" />
              </Button>
              <Button variant="outline" size="lg" className="h-12 px-8">
                Watch Demo
              </Button>
            </div>
            <p className="text-sm text-neutral-800">
              Free forever • No credit card required • 2 minutes setup
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Hero;
