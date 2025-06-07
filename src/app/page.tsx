import { getAuthenticatedUser } from '@/lib/auth'
import { Navigation } from '@/components/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'
import { Building2, FileText, Car, Shield } from 'lucide-react'

export default async function HomePage() {
  const user = await getAuthenticatedUser(new Request('http://localhost:3000', {
    headers: { cookie: '' }
  }))

  return (
    <div>
      <Navigation user={user} />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
            Kenya Government Services
          </h1>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            Access NTSA, DCI, and Business Registration services through our secure MCP server platform.
            Fast, reliable, and authenticated access to government services.
          </p>
          
          {!user ? (
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Link href="/login">
                <Button size="lg">Get Started</Button>
              </Link>
              <Link href="#features" className="text-sm font-semibold leading-6 text-gray-900">
                Learn more <span aria-hidden="true">→</span>
              </Link>
            </div>
          ) : (
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Link href="/dashboard">
                <Button size="lg">Go to Dashboard</Button>
              </Link>
              <Link href="/subscribe">
                <Button variant="outline" size="lg">Buy Credits</Button>
              </Link>
            </div>
          )}
        </div>

        <div id="features" className="mt-20">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 text-center mb-12">
            Available Services
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="text-center">
              <CardHeader>
                <Car className="h-12 w-12 text-blue-600 mx-auto" />
                <CardTitle>NTSA Services</CardTitle>
                <CardDescription>
                  Driving license renewal, vehicle registration, logbook replacement
                </CardDescription>
              </CardHeader>
            </Card>
            
            <Card className="text-center">
              <CardHeader>
                <Shield className="h-12 w-12 text-green-600 mx-auto" />
                <CardTitle>DCI Services</CardTitle>
                <CardDescription>
                  Police clearance certificates for citizens and foreigners
                </CardDescription>
              </CardHeader>
            </Card>
            
            <Card className="text-center">
              <CardHeader>
                <Building2 className="h-12 w-12 text-purple-600 mx-auto" />
                <CardTitle>Business Registration</CardTitle>
                <CardDescription>
                  Business name search and company registration services
                </CardDescription>
              </CardHeader>
            </Card>
            
            <Card className="text-center">
              <CardHeader>
                <FileText className="h-12 w-12 text-gray-600 mx-auto" />
                <CardTitle>MCP Integration</CardTitle>
                <CardDescription>
                  Seamless integration with MCP clients and applications
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>

        <div className="mt-20 bg-blue-50 rounded-lg p-8">
          <div className="text-center">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              How It Works
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
              <div>
                <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center mx-auto mb-4">1</div>
                <h4 className="font-semibold text-gray-900">Sign Up & Subscribe</h4>
                <p className="text-gray-600 mt-2">Create an account and purchase credits to access premium services</p>
              </div>
              <div>
                <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center mx-auto mb-4">2</div>
                <h4 className="font-semibold text-gray-900">Connect MCP Client</h4>
                <p className="text-gray-600 mt-2">Use our MCP server with your favorite MCP-compatible application</p>
              </div>
              <div>
                <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center mx-auto mb-4">3</div>
                <h4 className="font-semibold text-gray-900">Access Services</h4>
                <p className="text-gray-600 mt-2">Submit applications and track progress through government portals</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}