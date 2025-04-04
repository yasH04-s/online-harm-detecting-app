import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ChevronRight, Shield, Activity, Eye, Shield as ShieldIcon, Upload } from "lucide-react";

const Home: React.FC = () => {
  return (
    <div className="flex flex-col items-center">
      <section className="w-full py-12 md:py-24 lg:py-32 flex justify-center items-center flex-col text-center">
        <div className="container px-4 md:px-6 space-y-10 md:space-y-14">
          <div className="space-y-3">
            <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl md:text-6xl">
              Safeguard Your Digital Content
            </h1>
            <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
              Advanced AI-powered content moderation for text, video, and audio submissions. 
              Keeping your platform safe has never been this simple.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/submit">
              <Button size="lg" className="animate-fade-in [animation-delay:200ms]">
                Submit Content <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link to="/dashboard">
              <Button size="lg" variant="outline" className="animate-fade-in [animation-delay:400ms]">
                View Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="w-full py-12 md:py-24 lg:py-32 bg-secondary">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">
                How It Works
              </h2>
              <p className="max-w-[700px] text-muted-foreground md:text-xl">
                Our AI-powered system analyzes and categorizes your content in real-time
              </p>
            </div>
          </div>
          <div className="mx-auto grid max-w-5xl grid-cols-1 gap-8 md:grid-cols-3 md:gap-12 lg:gap-16 mt-16">
            <div className="flex flex-col items-center space-y-4 animate-fade-in [animation-delay:200ms]">
              <div className="glass-panel p-3 rounded-full">
                <Upload className="h-10 w-10 text-primary" />
              </div>
              <h3 className="text-xl font-bold">Submit Content</h3>
              <p className="text-muted-foreground text-center">
                Upload text, video, or audio for analysis using our simple submission interface.
              </p>
            </div>
            <div className="flex flex-col items-center space-y-4 animate-fade-in [animation-delay:400ms]">
              <div className="glass-panel p-3 rounded-full">
                <Activity className="h-10 w-10 text-primary" />
              </div>
              <h3 className="text-xl font-bold">AI Analysis</h3>
              <p className="text-muted-foreground text-center">
                Our advanced AI analyzes content for harmful elements and categorizes it.
              </p>
            </div>
            <div className="flex flex-col items-center space-y-4 animate-fade-in [animation-delay:600ms]">
              <div className="glass-panel p-3 rounded-full">
                <Eye className="h-10 w-10 text-primary" />
              </div>
              <h3 className="text-xl font-bold">Review & Publish</h3>
              <p className="text-muted-foreground text-center">
                Safe content is automatically published, while suspicious content undergoes human review.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="w-full py-12 md:py-24 lg:py-32">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">
                Content Categories
              </h2>
              <p className="max-w-[700px] text-muted-foreground md:text-xl">
                Our system categorizes content into three distinct safety levels
              </p>
            </div>
          </div>
          <div className="mx-auto grid max-w-5xl grid-cols-1 gap-8 md:grid-cols-3 md:gap-12 lg:gap-16 mt-16">
            <div className="relative overflow-hidden rounded-lg border bg-background p-6 shadow-md transition-all hover:shadow-lg animate-fade-in [animation-delay:200ms]">
              <div className="flex flex-col items-center space-y-4">
                <ShieldIcon className="h-10 w-10 text-green-500" />
                <h3 className="text-xl font-bold">Safe</h3>
                <p className="text-muted-foreground text-center">
                  Content that poses no risk and is automatically approved and published.
                </p>
              </div>
            </div>
            <div className="relative overflow-hidden rounded-lg border bg-background p-6 shadow-md transition-all hover:shadow-lg animate-fade-in [animation-delay:400ms]">
              <div className="flex flex-col items-center space-y-4">
                <ShieldIcon className="h-10 w-10 text-amber-500" />
                <h3 className="text-xl font-bold">Suspicious</h3>
                <p className="text-muted-foreground text-center">
                  Content that requires manual review by our moderation team before publishing.
                </p>
              </div>
            </div>
            <div className="relative overflow-hidden rounded-lg border bg-background p-6 shadow-md transition-all hover:shadow-lg animate-fade-in [animation-delay:600ms]">
              <div className="flex flex-col items-center space-y-4">
                <ShieldIcon className="h-10 w-10 text-red-500" />
                <h3 className="text-xl font-bold">Harmful</h3>
                <p className="text-muted-foreground text-center">
                  Content that violates our guidelines and is automatically blocked from publishing.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="w-full py-12 md:py-24 lg:py-32 bg-secondary">
        <div className="container px-4 md:px-6">
          <div className="grid gap-10 lg:grid-cols-2 lg:gap-12 xl:gap-16">
            <div className="space-y-4">
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight lg:text-5xl/tight xl:text-6xl/tight">
                Ready to safeguard your content?
              </h2>
              <p className="max-w-[600px] text-muted-foreground md:text-xl">
                Join us in creating a safer digital environment through advanced
                content moderation.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/submit">
                  <Button size="lg">
                    Get Started <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
            <div className="flex items-center justify-center">
              <div className="glass-panel rounded-lg p-8 w-full max-w-md shadow-lg animate-float">
                <ShieldIcon className="h-16 w-16 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-bold text-center mb-2">Trusted Protection</h3>
                <p className="text-muted-foreground text-center">
                  Our AI-powered system processes your content with precision and care,
                  ensuring the highest level of protection while maintaining quick turnaround times.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
