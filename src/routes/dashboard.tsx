import { createFileRoute, redirect } from '@tanstack/react-router'
import { useAuth } from '../lib/auth'


export const Route = createFileRoute('/dashboard')({
    component: DashboardPage,
    beforeLoad: ({ context }) => {
        // Log for debugging
        console.log('Checking context on index.tsx:', context) // Check if user is authenticated
        if (context.auth.isAuthenticated) {
          console.log('User authenticated, proceeding...')
          throw redirect({
            to: '/dashboard',
          })
        }
      },
    
})

function DashboardPage() {
  const { user } = useAuth()

  return (
    <section className="grid gap-2 p-2">
      <p>Hi {user?.displayName || user?.email || 'there'}!</p>
      <p>You are currently on the dashboard route.</p>
    </section>
  )
}