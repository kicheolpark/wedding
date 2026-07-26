import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const root = new URL("../", import.meta.url);

test("contains the complete Korean mobile wedding invitation", async () => {
  const [page, layout, invitation, css, hosting] = await Promise.all([
    readFile(new URL("app/page.tsx", root), "utf8"),
    readFile(new URL("app/layout.tsx", root), "utf8"),
    readFile(new URL("app/wedding-invitation.tsx", root), "utf8"),
    readFile(new URL("app/globals.css", root), "utf8"),
    readFile(new URL(".openai/hosting.json", root), "utf8"),
  ]);

  assert.match(page, /WeddingInvitation/);
  assert.match(layout, /박기철 · 정송이, 결혼합니다/);
  assert.match(layout, /lang="ko"/);
  assert.match(layout, /og\.png/);
  assert.match(invitation, /오랜 시간 걸음 지키며/);
  assert.match(invitation, /2026-09-20T12:00:00\+09:00/);
  assert.doesNotMatch(invitation, /RSVP|참석 의사|방명록|guestbook|\/api\//i);
  assert.match(css, /max-width:\s*480px/);
  assert.match(css, /#d8e592/i);
  assert.match(css, /prefers-reduced-motion/);
  assert.equal(JSON.parse(hosting).d1, null);
  assert.match(JSON.parse(hosting).project_id, /^appgprj_/);
  assert.doesNotMatch(page + layout, /codex-preview|SkeletonPreview/);
});
