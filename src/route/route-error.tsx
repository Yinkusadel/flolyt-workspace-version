import { Link, isRouteErrorResponse, useRouteError } from "react-router";

import { Button } from "@/components/ui/button";
import { ErrorScreen } from "@/components/error-screen";

/**
 * errorElement for the data router — catches loader/action throws, render
 * errors inside a route, and unmatched paths (react-router falls back to
 * the nearest ancestor errorElement when nothing matches a "*" route).
 */
export function RouteError() {
  const error = useRouteError();

  if (import.meta.env.DEV) console.error(error);

  if (isRouteErrorResponse(error) && error.status === 404) {
    return (
      <ErrorScreen
        title="Page not found"
        description="The page you're looking for doesn't exist or may have moved."
        actions={
          <Button asChild>
            <Link to="/">Go home</Link>
          </Button>
        }
      />
    );
  }

  const detail = isRouteErrorResponse(error)
    ? `${error.status} ${error.statusText}`
    : error instanceof Error
      ? (error.stack ?? error.message)
      : String(error);

  return (
    <ErrorScreen
      title="Something went wrong"
      description="This page hit an unexpected error. Try again, or head back home."
      detail={import.meta.env.DEV ? detail : undefined}
      actions={
        <>
          <Button type="button" variant="outline" onClick={() => window.location.reload()}>
            Try again
          </Button>
          <Button asChild>
            <Link to="/">Go home</Link>
          </Button>
        </>
      }
    />
  );
}
