import assert from "node:assert/strict";
import { access, readFile, readdir } from "node:fs/promises";
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
  assert.match(invitation, /만남에 사랑이 스며들어/);
  assert.match(invitation, /2026-09-20T12:00:00\+09:00/);
  assert.doesNotMatch(invitation, /RSVP|참석 의사|방명록|guestbook|\/api\//i);
  assert.match(css, /width:\s*min\(100%,\s*480px\)/);
  assert.match(css, /#9d6f66/i);
  assert.match(css, /prefers-reduced-motion/);
  assert.equal(JSON.parse(hosting).d1, null);
  assert.match(JSON.parse(hosting).project_id, /^appgprj_/);
  assert.doesNotMatch(page + layout, /codex-preview|SkeletonPreview/);
  assert.doesNotMatch(invitation, /hero\.jpg를 추가해 주세요/);
});

test("builds a GitHub Pages site under the wedding project path", async () => {
  const [html, files] = await Promise.all([
    readFile(new URL("docs/index.html", root), "utf8"),
    readdir(new URL("docs/assets/", root)),
    access(new URL("docs/.nojekyll", root)),
    access(new URL("docs/hero.jpg", root)),
  ]);

  assert.match(html, /<html[^>]*lang="ko"/i);
  assert.match(html, /박기철 · 정송이, 결혼합니다/);
  assert.match(html, /\/wedding\/assets\//);
  assert.match(html, /\/wedding\/og\.png/);
  assert.match(html, /\/wedding\/hero\.jpg/);
  assert.ok(files.some((file) => file.endsWith(".js")));
  assert.ok(files.some((file) => file.endsWith(".css")));
});
