import React from 'react'
import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div style={{padding:24}}>
      <h2>Page Not Found</h2>
      <p>
        Go back <Link to="/">home</Link>.
      </p>
    </div>
  )
}

