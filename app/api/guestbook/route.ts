import { desc } from "drizzle-orm";
import { getDb } from "../../../db";
import { guestbookMessages } from "../../../db/schema";

function clean(value: unknown, max: number) {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

export async function GET() {
  try {
    const db = getDb();
    const messages = await db
      .select({
        id: guestbookMessages.id,
        author: guestbookMessages.author,
        content: guestbookMessages.content,
        colorIndex: guestbookMessages.colorIndex,
      })
      .from(guestbookMessages)
      .orderBy(desc(guestbookMessages.createdAt), desc(guestbookMessages.id))
      .limit(60);

    return Response.json({ messages });
  } catch {
    return Response.json({ messages: [] });
  }
}

export async function POST(request: Request) {
  try {
    const payload = (await request.json()) as Record<string, unknown>;
    const author = clean(payload.author, 20);
    const content = clean(payload.content, 180);
    const colorIndex = Math.min(
      5,
      Math.max(0, Number(payload.colorIndex) || 0),
    );

    if (!author || !content) {
      return Response.json(
        { error: "이름과 메시지를 입력해 주세요." },
        { status: 400 },
      );
    }

    const db = getDb();
    const [message] = await db
      .insert(guestbookMessages)
      .values({ author, content, colorIndex })
      .returning();

    return Response.json({ message }, { status: 201 });
  } catch {
    return Response.json(
      { error: "축하 메시지를 저장하지 못했습니다." },
      { status: 500 },
    );
  }
}
