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
      <div className="mx-auto min-h-[50vh] max-w-[1180px] px-6 py-12">
        <div className="mx-auto max-w-md rounded-2xl border border-dashed border-(--line) p-12 text-center">
          <h2>{loading ? "Checking your account..." : "Redirecting to login..."}</h2>
        </div>
      </div>
    )
  }

  return children
}
