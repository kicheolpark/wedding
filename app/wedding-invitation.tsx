"use client";

import { useEffect, useRef, useState } from "react";

const WEDDING_DATE = new Date("2026-09-20T12:00:00+09:00");
const ASSET_BASE = import.meta.env.BASE_URL ?? "/";
const KAKAO_MAP_URL =
  "https://map.kakao.com/link/map/%EC%95%84%EB%B0%94%EB%8B%88%20%EC%84%BC%ED%8A%B8%EB%9F%B4%20%EB%B6%80%EC%82%B0,35.148750,129.065277";

function assetPath(filename: string) {
  const base = ASSET_BASE.endsWith("/") ? ASSET_BASE : `${ASSET_BASE}/`;
  return `${base}${filename}`;
}

const galleryFileNames = [
  "1.jpg",
  "2.jpg",
  "3.jpg",
  "4.jpg",
  "5.jpg",
  "6.jpg",
  "7.jpg",
  "8.jpg",
  "9.jpg",
];

const galleryImages = galleryFileNames.map((filename, index) => ({
  alt: `박기철 정송이 웨딩 갤러리 ${index + 1}`,
  sources: [assetPath(`gallery/${filename}`)],
}));

const accounts = {
  groom: [
    { role: "신랑", name: "박기철", bank: "경남은행", number: "0000-1212" },
  ],
  bride: [
    { role: "신부", name: "정송이", bank: "경남은행", number: "0000-0329" },
  ],
};

type Countdown = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  finished: boolean;
};

function getCountdown(): Countdown {
  const difference = WEDDING_DATE.getTime() - Date.now();
  if (difference <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, finished: true };
  }

  return {
    days: Math.floor(difference / 86_400_000),
    hours: Math.floor((difference / 3_600_000) % 24),
    minutes: Math.floor((difference / 60_000) % 60),
    seconds: Math.floor((difference / 1_000) % 60),
    finished: false,
  };
}

function SectionTitle({ eyebrow, title }: { eyebrow?: string; title: string }) {
  return (
    <div className="section-heading">
      {eyebrow && <p className="eyebrow">{eyebrow}</p>}
      <h2>{title}</h2>
    </div>
  );
}

function FlexibleImage({
  sources,
  alt,
  className,
  label,
  loading = "lazy",
}: {
  sources: string[];
  alt: string;
  className?: string;
  label: string;
  loading?: "eager" | "lazy";
}) {
  const [sourceIndex, setSourceIndex] = useState(0);
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <div className={`image-placeholder ${className ?? ""}`} role="img" aria-label={alt}>
        <span>{label}</span>
        <small>public 폴더에 이미지를 추가해 주세요</small>
      </div>
    );
  }

  return (
    <img
      src={sources[sourceIndex]}
      alt={alt}
      className={className}
      draggable={false}
      loading={loading}
      onError={() => {
        if (sourceIndex < sources.length - 1) {
          setSourceIndex((current) => current + 1);
        } else {
          setFailed(true);
        }
      }}
    />
  );
}

function Hero() {
  return (
    <section className="hero" aria-label="박기철 정송이 모바일 청첩장 표지">
      <FlexibleImage
        sources={[assetPath("hero.jpg")]}
        alt="박기철 정송이 결혼식 대표 사진"
        className="hero-image"
        label="hero.jpg"
        loading="eager"
      />
      <div className="hero-shade" />
      <div className="hero-copy">
        <p className="hero-kicker">WE ARE GETTING MARRIED</p>
        <h1><span>박기철</span><em>&amp;</em><span>정송이</span></h1>
        <p>2026년 9월 20일 일요일 낮 12시</p>
        <p>부산 아바니 호텔, 5층 아바니홀</p>
      </div>
      <a className="scroll-indicator" href="#invitation" aria-label="초대글로 스크롤">
        <span>SCROLL</span>
        <i aria-hidden="true" />
      </a>
    </section>
  );
}

function Invitation() {
  return (
    <section id="invitation" className="section invitation fade-up">
      <SectionTitle title="INVITATION" />
      <div className="invitation-copy">
        <p>
          만남에 사랑이 스며들어<br />
          저희 두 사람 이제는 하나가 되어<br />
          두 손 꼭 잡고 한 길을 걷고자 합니다.
        </p>
        <p>
          그 새로운 시작의 순간, 귀한 걸음하시어<br />
          따뜻하게 격려해주시면 큰 힘이 되겠습니다.
        </p>
      </div>
      <div className="family-lines">
        <p><span>박종섭</span><i>·</i><span>전지현</span><small>의 장남</small><strong>박기철</strong></p>
        <p><span>정권회</span><i>·</i><span>김미양</span><small>의 장녀</small><strong>정송이</strong></p>
      </div>
    </section>
  );
}

function WeddingVideo() {
  const [playing, setPlaying] = useState(false);

  return (
    <section className="video-section fade-up" aria-label="웨딩 영상">
      <SectionTitle eyebrow="OUR STORY" title="WEDDING FILM" />
      <div className="video-frame">
        {playing ? (
          <iframe
            src="https://www.youtube-nocookie.com/embed/_9KvnBxxWls?autoplay=1&playsinline=1&rel=0"
            title="박기철 정송이 웨딩 영상"
            allow="autoplay; encrypted-media; picture-in-picture"
            allowFullScreen
          />
        ) : (
          <button type="button" className="video-cover" onClick={() => setPlaying(true)} aria-label="웨딩 영상 재생">
            <img
              src="https://img.youtube.com/vi/_9KvnBxxWls/maxresdefault.jpg"
              alt="웨딩 영상 미리보기"
            />
            <span aria-hidden="true">▶</span>
          </button>
        )}
      </div>
    </section>
  );
}

function Gallery() {
  const [selected, setSelected] = useState(0);
  const startX = useRef<number | null>(null);
  const thumbnailsRef = useRef<HTMLDivElement | null>(null);
  const thumbnailRefs = useRef<Array<HTMLButtonElement | null>>([]);

  useEffect(() => {
    const thumbnails = thumbnailsRef.current;
    const thumbnail = thumbnailRefs.current[selected];
    if (!thumbnails || !thumbnail) return;

    thumbnails.scrollTo({
      left: thumbnail.offsetLeft - (thumbnails.clientWidth - thumbnail.clientWidth) / 2,
      behavior: "smooth",
    });
  }, [selected]);

  const move = (direction: number) => {
    setSelected((current) => (current + direction + galleryImages.length) % galleryImages.length);
  };

  return (
    <section className="section gallery fade-up">
      <SectionTitle title="GALLERY" />
      <div
        className="gallery-stage"
        onTouchStart={(event) => { startX.current = event.touches[0]?.clientX ?? null; }}
        onTouchEnd={(event) => {
          if (startX.current === null) return;
          const distance = (event.changedTouches[0]?.clientX ?? startX.current) - startX.current;
          if (Math.abs(distance) > 45) move(distance > 0 ? -1 : 1);
          startX.current = null;
        }}
      >
        <FlexibleImage
          key={selected}
          sources={galleryImages[selected].sources}
          alt={galleryImages[selected].alt}
          className="gallery-main"
          label={`갤러리 ${selected + 1}`}
          loading="eager"
        />
        <span className="gallery-count">
          {String(selected + 1).padStart(2, "0")} / {String(galleryImages.length).padStart(2, "0")}
        </span>
      </div>
      <div className="gallery-rail">
        <button type="button" onClick={() => move(-1)} aria-label="이전 이미지">〈</button>
        <div className="gallery-thumbnails" ref={thumbnailsRef}>
          {galleryImages.map((image, index) => (
            <button
              key={image.alt}
              type="button"
              className={selected === index ? "active" : ""}
              onClick={() => setSelected(index)}
              ref={(element) => { thumbnailRefs.current[index] = element; }}
              aria-label={`갤러리 ${index + 1} 보기`}
              aria-pressed={selected === index}
            >
              <FlexibleImage sources={image.sources} alt={image.alt} label={`${index + 1}`} />
            </button>
          ))}
        </div>
        <button type="button" onClick={() => move(1)} aria-label="다음 이미지">〉</button>
      </div>
    </section>
  );
}

function WeddingDay() {
  const [countdown, setCountdown] = useState<Countdown | null>(null);

  useEffect(() => {
    const update = () => setCountdown(getCountdown());
    update();
    const timer = window.setInterval(update, 1000);
    return () => window.clearInterval(timer);
  }, []);

  const firstDay = new Date(Date.UTC(2026, 8, 1)).getUTCDay();
  const cells = [...Array(firstDay).fill(null), ...Array.from({ length: 30 }, (_, index) => index + 1)];
  const dayCount = countdown?.days;

  return (
    <section className="section wedding-day fade-up">
      <SectionTitle title="WEDDING DAY" />
      <p className="wedding-date">2026년 9월 20일 일요일 낮 12시</p>
      <div className="calendar" aria-label="2026년 9월 달력, 20일 결혼식">
        <div className="calendar-top"><strong>09</strong></div>
        <div className="weekdays">
          {['일', '월', '화', '수', '목', '금', '토'].map((day) => <span key={day}>{day}</span>)}
        </div>
        <div className="calendar-grid">
          {cells.map((day, index) => {
            const className = [
              day === 20 ? "wedding-date-cell" : "",
              day !== null && [24, 25, 26].includes(day) ? "holiday" : "",
            ].filter(Boolean).join(" ");

            return (
              <span key={`${day ?? 'empty'}-${index}`} className={className}>
                {day}
                {day === 25 && <small>추석</small>}
              </span>
            );
          })}
        </div>
      </div>
      <p className="d-day-copy">
        결혼식이 {countdown?.finished ? <strong>오늘입니다</strong> : <><strong>{dayCount ?? "—"}일</strong> 남았습니다.</>}
      </p>
      <div className="countdown" aria-label="결혼식까지 남은 시간">
        {[
          [countdown?.days, "DAYS"],
          [countdown?.hours, "HOURS"],
          [countdown?.minutes, "MIN"],
          [countdown?.seconds, "SEC"],
        ].map(([value, label]) => (
          <div key={String(label)}>
            <strong>{String(value ?? 0).padStart(2, "0")}</strong>
            <span>{label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

function Location() {
  return (
    <section className="section location fade-up">
      <SectionTitle title="LOCATION" />
      <h3>아바니 센트럴 부산</h3>
      <p className="hall">5층 아바니홀</p>
      <p className="address">부산 남구 전포대로 133</p>
      <div className="map-frame">
        <iframe src={KAKAO_MAP_URL} title="아바니 센트럴 부산 카카오맵" loading="lazy" />
        <a href={KAKAO_MAP_URL} target="_blank" rel="noreferrer" aria-label="카카오맵에서 크게 보기">
          <span className="map-pin" aria-hidden="true">♥</span>
          <strong>아바니 센트럴 부산</strong>
          <small>카카오맵에서 크게 보기 ↗</small>
        </a>
      </div>
      <div className="transport-list">
        <div><span>주차</span><p>호텔 주차장 입구 왼쪽 진입 B2~B4 이용</p></div>
        <div><span>지하철</span><p>2호선 국제금융센터역 3번 출구 (도보 2분)<br />1호선 범내골역 4번 출구 (도보 10분)</p></div>
        <div><span>버스</span><p>24, 138-1, 583 문전교차로 하차</p></div>
      </div>
      <div className="map-links">
        <a href="https://map.naver.com/p/search/%EC%95%84%EB%B0%94%EB%8B%88%20%EC%84%BC%ED%8A%B8%EB%9F%B4%20%EB%B6%80%EC%82%B0" target="_blank" rel="noreferrer"><b>N</b>네이버 지도</a>
        <a href={KAKAO_MAP_URL} target="_blank" rel="noreferrer"><b>K</b>카카오맵</a>
        <a href="https://www.tmap.co.kr/tmap2/mobile/route.jsp?name=%EC%95%84%EB%B0%94%EB%8B%88%20%EC%84%BC%ED%8A%B8%EB%9F%B4%20%EB%B6%80%EC%82%B0&lon=129.065277&lat=35.148750" target="_blank" rel="noreferrer"><b>T</b>티맵</a>
      </div>
      <div className="meal-information">
        <span aria-hidden="true">🍽</span>
        <div>
          <h3>식사 안내</h3>
          <p>4층 더큐브에서 뷔페로 준비되어 있습니다.<br />식권은 5층 축의대에서 수령해주세요.</p>
        </div>
      </div>
    </section>
  );
}

type Account = { role: string; name: string; bank: string; number: string };

function AccountGroup({ title, list, onCopy }: { title: string; list: Account[]; onCopy: (value: string) => void }) {
  const [open, setOpen] = useState(true);

  return (
    <div className={`account-group ${open ? "open" : ""}`}>
      <button type="button" className="account-toggle" onClick={() => setOpen((value) => !value)} aria-expanded={open}>
        <span>{title}</span><span>{open ? "접기 ︿" : "펼치기 ﹀"}</span>
      </button>
      {open && (
        <div className="account-list">
          {list.map((account) => (
            <div className="account-row" key={`${account.role}-${account.name}`}>
              <p><small>{account.role}</small><strong>{account.name}</strong></p>
              <p><span>{account.bank}</span><b>{account.number}</b></p>
              <button type="button" onClick={() => onCopy(`${account.bank} ${account.number}`)}>복사</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function Accounts() {
  const [toast, setToast] = useState("");
  const copy = async (value: string) => {
    try {
      await navigator.clipboard.writeText(value);
      setToast("계좌번호를 복사했습니다");
    } catch {
      setToast("복사하지 못했습니다. 길게 눌러 복사해 주세요");
    }
    window.setTimeout(() => setToast(""), 2000);
  };

  return (
    <section className="section accounts fade-up">
      <SectionTitle title="마음 전하실 곳" />
      <p className="account-intro">참석이 어려우신 분들을 위해 기재했습니다.<br />너그러운 마음으로 양해 부탁드립니다.</p>
      <AccountGroup title="신랑측 계좌번호" list={accounts.groom} onCopy={copy} />
      <AccountGroup title="신부측 계좌번호" list={accounts.bride} onCopy={copy} />
      {toast && <div className="copy-toast" role="status">{toast}</div>}
    </section>
  );
}

function Footer() {
  const [toast, setToast] = useState("");

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setToast("청첩장 링크를 복사했습니다");
    } catch {
      setToast("링크를 복사하지 못했습니다");
    }
    window.setTimeout(() => setToast(""), 2000);
  };

  const kakaoShare = async () => {
    const shareData = {
      title: "박기철 ♥ 정송이 결혼식에 초대합니다",
      text: "2026년 9월 20일 낮 12시, 부산 아바니 호텔 5층 아바니홀",
      url: window.location.href,
    };
    if (navigator.share) {
      try {
        await navigator.share(shareData);
        return;
      } catch {
        return;
      }
    }
    await copyLink();
  };

  return (
    <footer>
      <p className="footer-script">Ki Cheol <i>&amp;</i> Song I</p>
      <p>소중한 날, 함께해 주세요.</p>
      <div className="share-buttons">
        <button type="button" className="kakao-share" onClick={kakaoShare}><span>●</span> 카카오톡 공유</button>
        <button type="button" onClick={copyLink}><span>↗</span> 링크 복사</button>
      </div>
      <small>© 2026 Kicheol &amp; Songi. All rights reserved.</small>
      {toast && <div className="copy-toast" role="status">{toast}</div>}
    </footer>
  );
}

export function WeddingInvitation() {
  useEffect(() => {
    const elements = document.querySelectorAll<HTMLElement>(".fade-up");
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((entry) => entry.isIntersecting && entry.target.classList.add("visible")),
      { threshold: 0.12 },
    );
    elements.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, []);

  return (
    <main className="page-shell">
      <Hero />
      <Invitation />
      <WeddingVideo />
      <Gallery />
      <WeddingDay />
      <Location />
      <Accounts />
      <Footer />
    </main>
  );
}
