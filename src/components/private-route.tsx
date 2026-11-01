"use client"

import { useEffect } from "react"
import { usePathname, useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-provider"

export function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    if (!loading && !user) {
      router.replace(`/login?callbackUrl=${encodeURIComponent(pathname)}`)
    }
  }, [loading, user, router, pathname])

  if (loading || !user) {
    return (
      <div className="page-shell min-h-[50vh]">
        <div className="empty-state mx-auto max-w-md text-center">
          <h2>{loading ? "Checking your account..." : "Redirecting to login..."}</h2>
        </div>
      </div>
    )
  }

  return children
}
