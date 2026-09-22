import { revalidateTag } from "next/cache";

export async function POST(request: Request) {
  const secret = request.headers.get("x-revalidate-secret"); // admin sends the shared secret in a header

  if (!process.env.REVALIDATE_SECRET || secret !== process.env.REVALIDATE_SECRET) {
    return new Response("Unauthorised", { status: 401 }); // wrong or missing secret
  }

  revalidateTag("posts"); // drop every cached post list, so the next visit reads fresh data
  return Response.json({ revalidated: true });
}