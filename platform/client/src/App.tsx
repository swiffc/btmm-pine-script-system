import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/hooks/use-theme";
import NotFound from "@/pages/not-found";
import Editor from "@/pages/editor";
import Templates from "@/pages/templates";
import Documentation from "@/pages/documentation";
import DevelopmentTemplate from "@/pages/development-template";
import BTMMIntegration from "@/pages/btmm-integration";

function Router() {
  return (
    <Switch>
      <Route path="/" component={BTMMIntegration} />
      <Route path="/editor" component={Editor} />
      <Route path="/templates" component={Templates} />
      <Route path="/documentation" component={Documentation} />
      <Route path="/development" component={DevelopmentTemplate} />
      <Route path="/integration" component={BTMMIntegration} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="dark" storageKey="btmm-theme">
        <TooltipProvider>
          <div className="min-h-screen bg-dark-bg text-dark-text">
            <Toaster />
            <Router />
          </div>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
