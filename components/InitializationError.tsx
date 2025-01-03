import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

interface InitializationErrorProps {
  error: Error
  onRetry: () => void
}

export function InitializationError({ error, onRetry }: InitializationErrorProps) {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Alert variant="destructive" className="max-w-md">
        <AlertTitle>Failed to initialize application</AlertTitle>
        <AlertDescription className="mt-4">
          <p className="mb-4">{error.message}</p>
          <Button onClick={onRetry} variant="outline">
            Try again
          </Button>
        </AlertDescription>
      </Alert>
    </div>
  )
}

