import { getAuthenticatedUser } from '@/lib/auth'
import { Navigation } from '@/components/navigation'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useState } from 'react'

export default async function SubscribePage() {
  const user = await getAuthenticatedUser(new Request('http://localhost:3000', { headers: { cookie: '' } }))
  if (!user) {
    return <div className="min-h-screen flex items-center justify-center">You must be signed in to subscribe.</div>
  }

  // This will be replaced by client-side logic for payment
  return (
    <div>
      <Navigation user={user} />
      <main className="max-w-md mx-auto py-12 px-4">
        <Card>
          <CardHeader>
            <CardTitle>Buy Credits</CardTitle>
            <CardDescription>Purchase credits to access premium services.</CardDescription>
          </CardHeader>
          <CardContent>
            <form action="/api/payments/initiate" method="POST" className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Phone Number</label>
                <Input name="phoneNumber" placeholder="e.g. 2547XXXXXXXX" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Credits</label>
                <Input name="credits" type="number" min={1} required />
              </div>
              <Button type="submit" className="w-full">Pay with M-Pesa</Button>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
