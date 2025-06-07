'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from './ui/button'
import { User } from 'lucide-react'

interface NavigationProps {
  user?: {
    email: string
    credits: number
    isSubscribed: boolean
  } | null
}

export function Navigation({ user }: NavigationProps) {
  const router = useRouter()

  const handleSignOut = async () => {
    try {
      const response = await fetch('/api/auth/signout', { method: 'POST' })
      if (response.ok) {
        router.push('/login')
      }
    } catch (error) {
      console.error('Sign out error:', error)
    }
  }

  return (
    <nav className="border-b border-gray-200 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="text-xl font-bold text-gray-900">
              Kenya Gov Services
            </Link>
          </div>
          
          {user ? (
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <User className="h-4 w-4 text-gray-500" />
                <span className="text-sm text-gray-700">{user.email}</span>
              </div>
              
              <div className="text-sm">
                <span className="text-gray-500">Credits: </span>
                <span className="font-medium text-gray-900">{user.credits}</span>
              </div>
              
              {user.isSubscribed && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  Subscribed
                </span>
              )}
              
              <Link href="/dashboard">
                <Button variant="outline" size="sm">Dashboard</Button>
              </Link>
              
              <Link href="/subscribe">
                <Button variant="default" size="sm">Buy Credits</Button>
              </Link>
              
              <Button variant="ghost" size="sm" onClick={handleSignOut}>
                Sign out
              </Button>
            </div>
          ) : (
            <div className="flex items-center">
              <Link href="/login">
                <Button>Sign in</Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}
