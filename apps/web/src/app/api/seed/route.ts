import { seed } from "@repo/db/seed"; // Prisma seed, shared with the Playwright tests
import { revalidateTag } from "next/cache"; // the cached queries hold the old data
import { NextResponse } from "next/server";

export async function GET() {
  if (!process.env.E2E) {
    return new Response("Not Available", { status: 501 }); // only ever available during tests
  }

  await seed();
  revalidateTag("posts"); // drop the cache so the next page render reads the fresh rows

  return NextResponse.json({ message: "Seeded" }, { status: 200 });
}