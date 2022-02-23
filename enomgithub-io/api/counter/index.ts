import type { APIHandler } from "https://deno.land/x/aleph@v0.3.0-beta.19/types.d.ts";

export const handler: APIHandler = ({ response }) => {
  const count = parseInt(localStorage.getItem("count") || "0");
  response.json({ count });
};
