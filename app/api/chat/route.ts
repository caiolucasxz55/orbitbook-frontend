// Chat moved to FastAPI backend — POST /ai/chat
// This route is no longer used.
import { NextResponse } from "next/server"

export async function POST() {
  return NextResponse.json(
    { error: "Este endpoint foi removido. O chat agora é gerenciado pelo backend em /ai/chat." },
    { status: 410 }
  )
}
