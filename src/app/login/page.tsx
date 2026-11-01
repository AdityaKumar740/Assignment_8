"use client"

import Link from "next/link"

export default function LoginPage() {
  return (
    <div className="auth-layout">
      <div className="auth-panel">
        <span className="eyebrow">Good things happen together</span>
        <h2>Make a difference where you live.</h2>
        <p>Sign in to join events, organize neighbors, and keep track of the positive change you are creating.</p>
      </div>
      <div className="auth-side">
        <div className="auth-card">
          <h1>Welcome back</h1>
          <p>Sign in to your Community Connect account.</p>
          <button className="google-btn">G&nbsp; Continue with Google</button>
          <form onSubmit={(event) => event.preventDefault()}>
            <div className="form-group">
              <label>Email address</label>
              <input type="email" placeholder="you@example.com" />
            </div>
            <div className="form-group">
              <label>Password</label>
              <input type="password" placeholder="Enter your password" />
            </div>
            <button className="submit" type="submit">Log In</button>
          </form>
          <p className="auth-switch">New to Community Connect? <Link href="/register">Create an account</Link></p>
        </div>
      </div>
    </div>
  )
}
