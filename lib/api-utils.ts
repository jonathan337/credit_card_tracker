import { NextResponse } from 'next/server'

// Move the error handling utility to lib folder for reuse
export async function handleRouteError(error: unknown) {
  console.error('API Error:', error)
  
  const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred'
  
  return NextResponse.json(
    { 
      success: false, 
      message: errorMessage 
    },
    { 
      status: 500 
    }
  )
}

