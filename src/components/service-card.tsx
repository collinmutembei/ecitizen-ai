import { Card, CardHeader, CardTitle, CardDescription, CardContent } from './ui/card'
import { Button } from './ui/button'

interface ServiceCardProps {
  name: string
  description: string
  creditsRequired: number
  requiresSubscription: boolean
  available: boolean
  onRequest?: () => void
}

export function ServiceCard({ name, description, creditsRequired, requiresSubscription, available, onRequest }: ServiceCardProps) {
  return (
    <Card className="mb-4">
      <CardHeader>
        <CardTitle>{name}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div>
            <span className="text-sm text-gray-500">Credits: {creditsRequired}</span>
            {requiresSubscription && (
              <span className="ml-2 inline-block px-2 py-0.5 rounded bg-blue-100 text-blue-800 text-xs">Subscription Required</span>
            )}
          </div>
          <Button disabled={!available} onClick={onRequest} size="sm">
            {available ? 'Request' : 'Unavailable'}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
