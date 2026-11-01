"use client"

import Link from "next/link"

export default function RegisterPage() {
  return (
    <div className="auth-layout">
      <div className="auth-panel">
        <span className="eyebrow">Your community needs you</span>
        <h2>Turn care into action.</h2>
        <p>Create your account and discover all the ways you can show up for your neighborhood.</p>
      </div>
      <div className="auth-side">
        <div className="auth-card">
          <h1>Create your account</h1>
          <p>Start making a positive difference today.</p>
          <button className="google-btn">G&nbsp; Sign up with Google</button>
          <form onSubmit={(event) => event.preventDefault()}>
            <div className="form-group">
              <label>Full name</label>
              <input type="text" placeholder="Alex Morgan" />
            </div>
            <div className="form-group">
              <label>Email address</label>
              <input type="email" placeholder="you@example.com" />
            </div>
            <div className="form-group">
              <label>Profile photo URL</label>
              <input type="url" placeholder="https://..." />
            </div>
            <div className="form-group">
              <label>Password</label>
              <input type="password" placeholder="At least 6 characters" />
            </div>
            <div className="form-group">
              <label>Confirm password</label>
              <input type="password" placeholder="Repeat your password" />
            </div>
            <button className="submit" type="submit">Create Account</button>
          </form>
          <p className="auth-switch">Already have an account? <Link href="/login">Log in</Link></p>
        </div>
      </div>
    </div>
  )
}
