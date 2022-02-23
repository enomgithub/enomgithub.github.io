import React from "https://esm.sh/react@17.0.2";

export default function Logo({ size = 75 }: { size?: number }) {
  return <img src="/logo.svg" height={size} title="Aleph.js" />;
}
