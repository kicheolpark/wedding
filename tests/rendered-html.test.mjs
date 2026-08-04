import assert from "node:assert/strict";
import { access, readFile, readdir } from "node:fs/promises";
import test from "node:test";

const root = new URL("../", import.meta.url);

test("contains the complete Korean mobile wedding invitation", async () => {
  const [page, layout, invitation, css, hosting, envExample, productionEnv, viteConfig] = await Promise.all([
    readFile(new URL("app/page.tsx", root), "utf8"),
    readFile(new URL("app/layout.tsx", root), "utf8"),
    readFile(new URL("app/wedding-invitation.tsx", root), "utf8"),
    readFile(new URL("app/globals.css", root), "utf8"),
    readFile(new URL(".openai/hosting.json", root), "utf8"),
    readFile(new URL(".env.example", root), "utf8"),
    readFile(new URL(".env.production", root), "utf8"),
    readFile(new URL("vite.pages.config.ts", root), "utf8"),
  ]);

  assert.match(page, /WeddingInvitation/);
  assert.match(layout, /박기철 & 정송이 결혼식에 초대합니다/);
  assert.match(layout, /lang="ko"/);
  assert.match(layout, /og\.jpg/);
  assert.match(invitation, /박기철 & 정송이 결혼식에 초대합니다/);
  assert.match(invitation, /만남에 사랑이 스며들어/);
  assert.match(invitation, /2026-09-20T12:00:00\+09:00/);
  assert.match(invitation, /2026년 9월 20일 일요일 낮 12시/);
  assert.match(invitation, /className="hero-date">2026년 9월 20일 일요일 낮 12시/);
  assert.match(invitation, /className="hero-venue"/);
  assert.match(invitation, /<span>부산 아바니 호텔<\/span>/);
  assert.match(invitation, /<span>5층 아바니홀<\/span>/);
  assert.match(invitation, /bXye66yjiNk/);
  assert.doesNotMatch(invitation, /reczF8eMLtQ|2LTmgyRS47E|_9KvnBxxWls/);
  assert.match(invitation, /className="section-heading video-heading"/);
  assert.match(invitation, /<h2>WEDDING FILM<\/h2>/);
  assert.match(invitation, /<p className="eyebrow">OUR STORY<\/p>/);
  assert.match(invitation, /\['일', '월', '화', '수', '목', '금', '토'\]/);
  assert.match(invitation, /\[24, 25, 26\]/);
  assert.match(invitation, /추석/);
  assert.match(invitation, /결혼식이/);
  assert.match(invitation, /meal-information/);
  assert.match(invitation, /VITE_KAKAO_MAP_JAVASCRIPT_KEY/);
  assert.match(invitation, /dapi\.kakao\.com\/v2\/maps\/sdk\.js\?appkey=/);
  assert.match(invitation, /autoload=false/);
  assert.match(invitation, /maps\.load/);
  assert.match(invitation, /new maps\.Map/);
  assert.match(invitation, /new maps\.Marker/);
  assert.match(invitation, /new maps\.InfoWindow/);
  assert.match(invitation, /new maps\.ZoomControl/);
  assert.match(invitation, /maps\.ControlPosition\.RIGHT/);
  assert.match(invitation, /아바니 센트럴 부산 카카오 지도/);
  assert.match(invitation, /https:\/\/naver\.me\/GRDxjnLj/);
  assert.match(invitation, /https:\/\/kko\.to\/5B-1ybgWQa/);
  assert.match(invitation, /https:\/\/tmap\.life\/2df2cfe9/);
  assert.doesNotMatch(invitation, /loadNaverMaps|oapi\.map\.naver\.com|VITE_NAVER_MAP_NCP_KEY_ID/);
  assert.doesNotMatch(invitation, /오후 12시/);
  assert.doesNotMatch(invitation, /September|function Information|<SectionTitle title="INFORMATION"/);
  assert.ok(invitation.indexOf('className="map-links"') < invitation.indexOf('className="meal-information"'));
  assert.match(invitation, /경남은행/);
  assert.match(invitation, /0000-1212/);
  assert.match(invitation, /0000-0329/);
  assert.match(invitation, /thumbnails\.scrollTo/);
  assert.doesNotMatch(invitation, /scrollIntoView/);
  assert.doesNotMatch(invitation, /✦|MusicPlayer|bgm\.mp3|music-button|music-notice/);
  assert.doesNotMatch(invitation, /RSVP|참석 의사|방명록|guestbook|\/api\//i);
  assert.doesNotMatch(invitation, /Ki Cheol|Song I|소중한 날, 함께해 주세요|All rights reserved/);
  assert.doesNotMatch(invitation, /text:\s*"2026년 9월 20일 낮 12시, 부산 아바니 호텔 5층 아바니홀"/);
  assert.match(invitation, /className="protected-image"/);
  assert.match(invitation, /onContextMenu=\{\(event\) => event\.preventDefault\(\)\}/);
  assert.match(invitation, /function isInsideKakaoMap/);
  assert.match(invitation, /function areAllTouchesInsideKakaoMap/);
  assert.match(invitation, /document\.elementFromPoint/);
  assert.match(invitation, /gesturestart/);
  assert.match(invitation, /event\.touches\.length > 1/);
  assert.match(invitation, /handleTouchEnd/);
  assert.match(invitation, /activeTouchPointers/);
  assert.match(invitation, /pointermove/);
  assert.match(invitation, /preventWheelZoom/);
  assert.match(invitation, /preventKeyboardZoom/);
  assert.doesNotMatch(invitation, /<iframe src=\{KAKAO_MAP_URL\}/);
  assert.match(css, /width:\s*min\(100%,\s*480px\)/);
  assert.match(css, /\.hero-copy[^}]*bottom:\s*85px/);
  assert.match(css, /\.hero-kicker[^}]*margin:\s*0 0 2px\s*!important/);
  assert.match(css, /\.hero-copy h1[^}]*font-size:\s*30px/);
  assert.match(css, /\.hero-copy h1 em[^}]*font-size:\s*22px/);
  assert.match(css, /\.hero-copy p[^}]*font-size:\s*11px/);
  assert.match(css, /\.hero-copy p[^}]*letter-spacing:\s*\.17em/);
  assert.match(css, /\.hero-copy \.hero-date[^}]*font-size:\s*14px/);
  assert.match(css, /\.hero-copy \.hero-venue[^}]*flex-direction:\s*column/);
  assert.match(css, /#9d6f66/i);
  assert.match(css, /\.account-intro[^}]*font-size:\s*15px/);
  assert.match(css, /\.calendar-grid \.wedding-date-cell[^}]*background:\s*var\(--accent\)/);
  assert.match(css, /\.calendar-grid \.wedding-date-cell[^}]*color:\s*#fff\s*!important/);
  assert.match(css, /prefers-reduced-motion/);
  assert.match(css, /\.kakao-map-canvas/);
  assert.match(css, /\.kakao-map-canvas[^}]*touch-action:\s*none/);
  assert.match(css, /html[^}]*touch-action:\s*pan-y/);
  assert.match(css, /body[^}]*touch-action:\s*pan-y/);
  assert.match(css, /\.page-shell[^}]*touch-action:\s*pan-y/);
  assert.match(css, /-webkit-text-size-adjust:\s*100%/);
  assert.match(css, /\.page-shell > :not\(\.location\)[^{]*\{[^}]*touch-action:\s*pan-y/);
  assert.match(css, /\.location > :not\(\.map-frame\)[^{]*\{[^}]*touch-action:\s*pan-y/);
  assert.match(css, /\.kakao-map-state/);
  assert.match(css, /\.protected-image[^}]*-webkit-touch-callout:\s*none/);
  assert.match(css, /\.protected-image[^}]*pointer-events:\s*none/);
  assert.match(css, /\.calendar-grid span small[^}]*top:\s*27px/);
  assert.match(css, /\.calendar-grid span small[^}]*font-size:\s*8px/);
  assert.match(css, /\.accounts[^}]*background:\s*#f7f4ee/);
  assert.doesNotMatch(css, /\.naver-map-/);
  assert.match(envExample, /VITE_KAKAO_MAP_JAVASCRIPT_KEY=your_kakao_map_javascript_key/);
  assert.match(productionEnv, /^VITE_KAKAO_MAP_JAVASCRIPT_KEY=.+$/m);
  assert.match(viteConfig, /envDir:/);
  assert.match(layout, /minimumScale:\s*1/);
  assert.match(layout, /maximumScale:\s*1/);
  assert.match(layout, /userScalable:\s*false/);
  assert.equal(JSON.parse(hosting).d1, null);
  assert.match(JSON.parse(hosting).project_id, /^appgprj_/);
  assert.doesNotMatch(page + layout, /codex-preview|SkeletonPreview/);
  assert.doesNotMatch(invitation, /hero\.jpg를 추가해 주세요/);
});

test("builds a GitHub Pages site under the wedding project path", async () => {
  const [html, files, galleryFiles] = await Promise.all([
    readFile(new URL("docs/index.html", root), "utf8"),
    readdir(new URL("docs/assets/", root)),
    readdir(new URL("docs/gallery/", root)),
    access(new URL("docs/.nojekyll", root)),
    access(new URL("docs/hero.jpg", root)),
    access(new URL("docs/og.jpg", root)),
  ]);

  assert.match(html, /<html[^>]*lang="ko"/i);
  assert.match(html, /minimum-scale=1\.0/);
  assert.match(html, /maximum-scale=1\.0/);
  assert.match(html, /user-scalable=no/);
  assert.match(html, /박기철 &amp; 정송이 결혼식에 초대합니다/);
  assert.match(html, /\/wedding\/assets\//);
  assert.match(html, /\/wedding\/og\.jpg/);
  assert.match(html, /\/wedding\/hero\.jpg/);
  assert.ok(files.some((file) => file.endsWith(".js")));
  assert.ok(files.some((file) => file.endsWith(".css")));
  assert.equal(galleryFiles.filter((file) => /\.jpe?g$/i.test(file)).length, 9);
});
