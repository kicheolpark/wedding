import { getDb } from "../../../db";
import { rsvpSubmissions } from "../../../db/schema";

function clean(value: unknown, max: number) {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

export async function POST(request: Request) {
  try {
    const payload = (await request.json()) as Record<string, unknown>;
    const name = clean(payload.name, 30);
    const phone = clean(payload.phone, 30);
    const attendance = clean(payload.attendance, 20);
    const mealPreference = clean(payload.mealPreference, 20);
    const message = clean(payload.message, 1000);
    const guestCount = Math.min(
      20,
      Math.max(1, Number(payload.guestCount) || 1),
    );

    if (!name || !phone || !attendance || !mealPreference) {
      return Response.json(
        { error: "필수 항목을 확인해 주세요." },
        { status: 400 },
      );
    }

    const db = getDb();
    const [submission] = await db
      .insert(rsvpSubmissions)
      .values({
        name,
        phone,
        attendance,
        guestCount,
        mealPreference,
        message,
      })
      .returning({ id: rsvpSubmissions.id });

    return Response.json({ submission }, { status: 201 });
  } catch {
    return Response.json(
      { error: "참석 의사를 저장하지 못했습니다." },
      { status: 500 },
    );
  }
}
