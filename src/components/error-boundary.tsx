import * as React from "react";

import { Button } from "@/components/ui/button";
import { ErrorScreen } from "@/components/error-screen";

export type ErrorBoundaryProps = {
  children: React.ReactNode;
};

type ErrorBoundaryState = {
  error: Error | null;
};

/**
 * Last-resort catch for render errors outside the router tree (providers,
 * context, anything mounted alongside <App /> in main.tsx). Route-level
 * errors are handled by errorElement in route.tsx instead — that boundary
 * can keep the sidebar/topbar mounted, this one can't.
 */
class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { error: null };

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error("Uncaught render error:", error, info.componentStack);
  }

  render() {
    if (this.state.error) {
      return (
        <ErrorScreen
          title="Something went wrong"
          description="The app hit an unexpected error. Reloading usually fixes it."
          detail={import.meta.env.DEV ? this.state.error.stack ?? this.state.error.message : undefined}
          actions={
            <Button type="button" onClick={() => window.location.reload()}>
              Reload page
            </Button>
          }
        />
      );
    }

    return this.props.children;
  }
}

export { ErrorBoundary };
