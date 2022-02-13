import React from 'https://esm.sh/react'

export default function Logo({ size = 75 }: { size?: number }) {
  return (
    <img src="/logo.svg" height={size} title="Aleph.js" />
  )
}
