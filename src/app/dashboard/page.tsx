import { getAuthenticatedUser } from '@/lib/auth'
import { Navigation } from '@/components/navigation'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export default async function DashboardPage() {
  const user = await getAuthenticatedUser(new Request('http://localhost:3000', { headers: { cookie: '' } }))
  if (!user) {
    return <div className="min-h-screen flex items-center justify-center">You must be signed in to view this page.</div>
  }

  // Optionally, fetch service usage and credits here

  return (
    <div>
      <Navigation user={user} />
      <main className="max-w-3xl mx-auto py-12 px-4">
        <Card>
          <CardHeader>
            <CardTitle>Welcome, {user.name || user.email}</CardTitle>
            <CardDescription>Your dashboard overview</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <span className="font-medium">Credits:</span> {user.credits}
            </div>
            <div className="mb-4">
              <span className="font-medium">Subscription:</span> {user.isSubscribed ? 'Active' : 'Not Subscribed'}
            </div>
            <Button asChild variant="default">
              <a href="/subscribe">Buy More Credits</a>
            </Button>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
