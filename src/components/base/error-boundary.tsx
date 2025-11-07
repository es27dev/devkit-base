// React Core
import { Component, type ReactNode } from "react";

// Base Components
import { Card, CardContent, CardHeader, CardTitle } from "@/components/base/card";
import { Button } from "@/components/base/button";

// Types
interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log error to console in development
    console.error("Error caught by boundary:", error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      // Use custom fallback if provided
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default error UI
      return (
        <div className="flex items-center justify-center min-h-[400px] p-4">
          <Card className="max-w-lg w-full">
            <CardHeader>
              <CardTitle className="text-destructive">Ein Fehler ist aufgetreten</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                Es tut uns leid, aber etwas ist schief gelaufen. Bitte versuchen Sie es erneut.
              </p>
              {process.env.NODE_ENV === "development" && this.state.error && (
                <details className="text-sm">
                  <summary className="cursor-pointer text-muted-foreground hover:text-foreground">
                    Fehlerdetails anzeigen
                  </summary>
                  <pre className="mt-2 p-2 bg-muted rounded text-xs overflow-auto">
                    {this.state.error.toString()}
                  </pre>
                </details>
              )}
              <div className="flex gap-2">
                <Button onClick={this.handleReset}>
                  Erneut versuchen
                </Button>
                <Button variant="outline" onClick={() => window.location.href = "/"}>
                  Zur Startseite
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}
