"use client";

import {
  KeyboardEvent,
  MouseEvent,
  useEffect,
  useRef,
  useState,
} from "react";

const WEDDING_DATE = new Date("2026-09-20T12:00:00+09:00");
const WEDDING_DATE_LABEL = "2026년 9월 20일 일요일 낮 12시";
const VENUE_ADDRESS = "식장 주소를 입력해 주세요";
const ASSET_BASE = import.meta.env.BASE_URL ?? "/";

function assetPath(filename: string) {
  const base = ASSET_BASE.endsWith("/") ? ASSET_BASE : `${ASSET_BASE}/`;
  return `${base}${filename}`;
}

const contactGroups = [
  {
    side: "신랑측",
    people: [
      { relation: "신랑", name: "박기철", phone: "010-0000-0000" },
      { relation: "신랑 아버지", name: "박종섭", phone: "010-0000-0000" },
      { relation: "신랑 어머니", name: "전지현", phone: "010-0000-0000" },
    ],
  },
  {
    side: "신부측",
    people: [
      { relation: "신부", name: "정송이", phone: "010-0000-0000" },
      { relation: "신부 아버지", name: "정권회", phone: "010-0000-0000" },
      { relation: "신부 어머니", name: "김미향", phone: "010-0000-0000" },
    ],
  },
];

const galleryImages = [
  { src: assetPath("갤러리 1.jpg"), label: "gallery 01" },
  { src: assetPath("갤러리 2.jpg"), label: "gallery 02" },
  { src: assetPath("갤러리 3.jpg"), label: "gallery 03" },
];

const venueCards = [
  {
    src: assetPath("안내1.jpg"),
    eyebrow: "안내 01",
    title: "예식장 안내",
    body: "안내1 내용을 입력해 주세요.",
  },
  {
    src: assetPath("안내2.jpg"),
    eyebrow: "안내 02",
    title: "피로연 안내",
    body: "안내2 내용을 입력해 주세요.",
  },
  {
    src: assetPath("안내3.jpg"),
    eyebrow: "안내 03",
    title: "기타 안내",
    body: "안내3 내용을 입력해 주세요.",
  },
];

const accounts = [
  {
    side: "신랑측",
    entries: [
      { name: "신랑 박기철", bank: "○○은행", number: "000-0000-0000" },
      { name: "아버지 박종섭", bank: "○○은행", number: "000-0000-0000" },
      { name: "어머니 전지현", bank: "○○은행", number: "000-0000-0000" },
    ],
  },
  {
    side: "신부측",
    entries: [
      { name: "신부 정송이", bank: "○○은행", number: "000-0000-0000" },
      { name: "아버지 정권회", bank: "○○은행", number: "000-0000-0000" },
      { name: "어머니 김미향", bank: "○○은행", number: "000-0000-0000" },
    ],
  },
];

type Countdown = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
};

function getCountdown(): Countdown {
  const gap = Math.max(0, WEDDING_DATE.getTime() - Date.now());
  return {
    days: Math.floor(gap / 86_400_000),
    hours: Math.floor((gap / 3_600_000) % 24),
    minutes: Math.floor((gap / 60_000) % 60),
    seconds: Math.floor((gap / 1_000) % 60),
  };
}

function StarDivider() {
  return (
    <div className="star-divider" aria-hidden="true">
      <span />
      <b>✦</b>
      <span />
    </div>
  );
}

function SectionHeading({
  eyebrow,
  title,
  intro,
}: {
  eyebrow: string;
  title: string;
  intro?: string;
}) {
  return (
    <div className="section-heading fade-up">
      <span>{eyebrow}</span>
      <h2>{title}</h2>
      {intro ? <p>{intro}</p> : null}
    </div>
  );
}

function Modal({
  title,
  open,
  onClose,
  children,
  className = "",
}: {
  title: string;
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  className?: string;
}) {
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.setTimeout(() => closeButtonRef.current?.focus(), 80);

    const handleEscape = (event: globalThis.KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEscape);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleEscape);
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="modal-backdrop"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <section
        className={`bottom-sheet ${className}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby={`modal-${title}`}
      >
        <div className="sheet-handle" aria-hidden="true" />
        <div className="modal-dots dots-one" aria-hidden="true" />
        <div className="modal-dots dots-two" aria-hidden="true" />
        <header className="sheet-header">
          <div>
            <small>CONTACT</small>
            <h2 id={`modal-${title}`}>{title}</h2>
          </div>
          <button
            type="button"
            className="close-button"
            onClick={onClose}
            aria-label={`${title} 닫기`}
            ref={closeButtonRef}
          >
            ×
          </button>
        </header>
        <div className="sheet-body">{children}</div>
      </section>
    </div>
  );
}

function ImageBlock({
  src,
  alt,
  label,
  className = "",
}: {
  src: string;
  alt: string;
  label: string;
  className?: string;
}) {
  const [failed, setFailed] = useState(false);

  return (
    <div className={`image-block ${className} ${failed ? "image-missing" : ""}`}>
      {!failed ? (
        // Native images keep Korean filenames easy to replace in /public.
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src} alt={alt} onError={() => setFailed(true)} />
      ) : null}
      <div className="image-placeholder" aria-hidden={!failed}>
        <span>✦</span>
        <p>{label}</p>
        <small>{src.replace("/", "")}</small>
      </div>
    </div>
  );
}

function Calendar() {
  const days = Array.from({ length: 30 }, (_, index) => index + 1);
  const blanks = Array.from({ length: 2 }, (_, index) => index);

  return (
    <div className="calendar fade-up">
      <div className="calendar-head">
        <p>SEPTEMBER</p>
        <strong>2026. 09</strong>
      </div>
      <div className="calendar-week" aria-hidden="true">
        {["일", "월", "화", "수", "목", "금", "토"].map((day) => (
          <span key={day}>{day}</span>
        ))}
      </div>
      <div className="calendar-grid">
        {blanks.map((blank) => (
          <span key={`blank-${blank}`} />
        ))}
        {days.map((day) => (
          <span
            key={day}
            className={day === 20 ? "wedding-day" : undefined}
            aria-label={day === 20 ? "결혼식 날짜, 9월 20일" : `9월 ${day}일`}
          >
            {day === 20 ? <b>{day}</b> : day}
          </span>
        ))}
      </div>
    </div>
  );
}

export function WeddingInvitation() {
  const [contactOpen, setContactOpen] = useState(false);
  const [countdown, setCountdown] = useState<Countdown>(getCountdown());
  const [expandedAccount, setExpandedAccount] = useState<string | null>(null);
  const [copyState, setCopyState] = useState("");
  const [notice, setNotice] = useState("");
  const galleryRef = useRef<HTMLDivElement>(null);

  const dDay =
    countdown.days +
    (countdown.hours + countdown.minutes + countdown.seconds > 0 ? 1 : 0);

  useEffect(() => {
    const timer = window.setInterval(() => setCountdown(getCountdown()), 1000);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    const elements = document.querySelectorAll(".fade-up");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add("is-visible");
        });
      },
      { threshold: 0.12 },
    );
    elements.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, []);

  const copyText = async (text: string, key: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopyState(key);
      setNotice("복사되었습니다");
      window.setTimeout(() => {
        setCopyState("");
        setNotice("");
      }, 1800);
    } catch {
      setNotice("길게 눌러 복사해 주세요");
    }
  };

  const handleShare = async () => {
    const shareData = {
      title: "박기철 · 정송이, 결혼합니다",
      text: `${WEDDING_DATE_LABEL} 소중한 시작에 초대합니다.`,
      url: window.location.href,
    };
    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await copyText(window.location.href, "footer");
      }
    } catch {
      // Closing the native share sheet is not an error for the guest.
    }
  };

  const onGalleryKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
    event.preventDefault();
    galleryRef.current?.scrollBy({
      left: event.key === "ArrowRight" ? 290 : -290,
      behavior: "smooth",
    });
  };

  const stopButtonBubble = (event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
  };

  return (
    <main className="invitation-shell">
      <section className="hero" id="top">
        <div
          className="hero-photo"
          aria-label="신랑 신부 대표 사진"
          style={
            {
              "--hero-image": `url("${assetPath("hero.jpg")}")`,
            } as React.CSSProperties
          }
        >
          <div className="hero-fallback">
            <span>OUR WEDDING DAY</span>
            <h1>
              기철 <i>&amp;</i> 송이
            </h1>
            <p>2026 · 09 · 20 · SUN</p>
            <small>hero.jpg를 추가해 주세요</small>
          </div>
        </div>
        <a className="scroll-indicator" href="#invitation" aria-label="초대글로 이동">
          <span>SCROLL</span>
          <b>⌄</b>
        </a>
      </section>

      <section className="section invitation-card" id="invitation">
        <div className="monogram fade-up">
          <span>G</span>
          <b>✦</b>
          <span>B</span>
        </div>
        <p className="family-line fade-up">
          <b>박종섭 · 전지현</b>의 장남 <strong>박기철</strong>
          <br />
          <b>정권회 · 김미향</b>의 장녀 <strong>정송이</strong>
        </p>
        <div className="invitation-copy fade-up">
          <p>
            오랜 시간 걸음 지키며
            <br />
            서로의 하루가 되어주었습니다.
          </p>
          <p>
            이제 부부라는 이름으로
            <br />
            같은 방향을 걸어가려 합니다.
          </p>
          <p>
            이 뜻깊은 시작의 자리에
            <br />
            소중한 분들을 정중히 초대합니다.
          </p>
        </div>
        <p className="signature fade-up">
          박기철 <i>·</i> 정송이 <span>드림</span>
        </p>
      </section>

      <StarDivider />

      <section className="section contact-section">
        <SectionHeading
          eyebrow="CONTACT"
          title="마음을 전하는 곳"
          intro="두 사람과 양가 부모님께 연락하실 수 있습니다."
        />
        <button
          className="primary-button fade-up"
          type="button"
          onClick={() => setContactOpen(true)}
        >
          연락하기 <span>↗</span>
        </button>
      </section>

      <StarDivider />

      <section className="section gallery-section">
        <SectionHeading
          eyebrow="GALLERY"
          title="우리의 빛나는 순간"
          intro="사진을 옆으로 넘겨 보세요."
        />
        <div
          className="gallery-track fade-up"
          ref={galleryRef}
          tabIndex={0}
          role="region"
          aria-label="웨딩 사진 갤러리"
          onKeyDown={onGalleryKeyDown}
        >
          {galleryImages.map((image, index) => (
            <div className="gallery-item" key={image.src}>
              <ImageBlock
                src={image.src}
                alt={`박기철과 정송이의 웨딩 사진 ${index + 1}`}
                label={image.label}
              />
              <span>0{index + 1}</span>
            </div>
          ))}
        </div>
        <div className="swipe-hint fade-up" aria-hidden="true">
          <span />
          SWIPE
        </div>
      </section>

      <StarDivider />

      <section className="section date-section">
        <SectionHeading
          eyebrow="THE DAY"
          title="2026년 9월 20일"
          intro="일요일 낮 12시"
        />
        <Calendar />
        <div className="countdown-wrap fade-up">
          <p>
            박기철 <span>♥</span> 정송이의 결혼식이
            <br />
            <strong>{dDay}일</strong> 남았습니다
          </p>
          <div className="countdown" aria-label="결혼식까지 남은 시간">
            {[
              ["DAYS", countdown.days],
              ["HOURS", countdown.hours],
              ["MIN", countdown.minutes],
              ["SEC", countdown.seconds],
            ].map(([label, value]) => (
              <div key={label}>
                <b>{String(value).padStart(2, "0")}</b>
                <small>{label}</small>
              </div>
            ))}
          </div>
        </div>
      </section>

      <StarDivider />

      <section className="section location-section">
        <SectionHeading
          eyebrow="LOCATION"
          title="오시는 길"
          intro="귀한 걸음, 편안히 오실 수 있도록 안내드립니다."
        />
        <div className="map-card fade-up">
          <div className="map-grid" aria-label="예식장 지도">
            <span className="road road-a" />
            <span className="road road-b" />
            <span className="road road-c" />
            <span className="map-dot">♥</span>
            <div>
              <b>KAKAO MAP</b>
              <small>식장 주소 입력 후 지도가 연결됩니다</small>
            </div>
          </div>
          <div className="address">
            <small>ADDRESS</small>
            <strong>{VENUE_ADDRESS}</strong>
          </div>
          <div className="map-buttons">
            <a
              href={`https://map.naver.com/p/search/${encodeURIComponent(VENUE_ADDRESS)}`}
              target="_blank"
              rel="noreferrer"
            >
              네이버 지도
            </a>
            <a
              className="accent"
              href={`https://map.kakao.com/link/search/${encodeURIComponent(VENUE_ADDRESS)}`}
              target="_blank"
              rel="noreferrer"
            >
              카카오 길찾기
            </a>
          </div>
        </div>
        <div className="transport-list fade-up">
          <div>
            <span>01</span>
            <p>
              <b>주차 안내</b>
              예식장 주차 안내를 입력해 주세요.
            </p>
          </div>
          <div>
            <span>02</span>
            <p>
              <b>대중교통</b>
              지하철 및 버스 이용 안내를 입력해 주세요.
            </p>
          </div>
        </div>
      </section>

      <StarDivider />

      <section className="section venue-section">
        <SectionHeading
          eyebrow="INFORMATION"
          title="예식장 안내"
          intro="방문 전 확인해 주세요."
        />
        <div className="venue-cards">
          {venueCards.map((card) => (
            <article className="venue-card fade-up" key={card.src}>
              <ImageBlock src={card.src} alt={card.title} label={card.eyebrow} />
              <div>
                <small>{card.eyebrow}</small>
                <h3>{card.title}</h3>
                <p>{card.body}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <StarDivider />

      <section className="section account-section">
        <SectionHeading
          eyebrow="FOR YOUR HEART"
          title="마음 전하실 곳"
          intro="축하의 마음을 전해주시는 모든 분께 감사드립니다."
        />
        <div className="account-accordions fade-up">
          {accounts.map((group) => {
            const expanded = expandedAccount === group.side;
            return (
              <div className="account-group" key={group.side}>
                <button
                  type="button"
                  aria-expanded={expanded}
                  onClick={() =>
                    setExpandedAccount(expanded ? null : group.side)
                  }
                >
                  <span>{group.side} 계좌번호</span>
                  <b>{expanded ? "−" : "+"}</b>
                </button>
                <div className={`account-content ${expanded ? "open" : ""}`}>
                  {group.entries.map((entry) => {
                    const key = `${group.side}-${entry.name}`;
                    return (
                      <div className="account-row" key={key}>
                        <p>
                          <small>{entry.name}</small>
                          <span>
                            {entry.bank} {entry.number}
                          </span>
                        </p>
                        <button
                          type="button"
                          onClick={(event) => {
                            stopButtonBubble(event);
                            void copyText(
                              `${entry.bank} ${entry.number}`,
                              key,
                            );
                          }}
                        >
                          {copyState === key ? "완료" : "복사"}
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <footer>
        <div className="footer-mark" aria-hidden="true">
          K <span>✦</span> S
        </div>
        <p>
          저희 두 사람의 새로운 시작을
          <br />
          함께 축복해 주셔서 감사합니다.
        </p>
        <div className="footer-actions">
          <button type="button" onClick={handleShare}>
            <i>●</i> 카카오톡 공유
          </button>
          <button
            type="button"
            onClick={() => copyText(window.location.href, "footer")}
          >
            <i>↗</i> {copyState === "footer" ? "복사 완료" : "링크 복사"}
          </button>
        </div>
        <small>© 2026 KICHEOL &amp; SONGI</small>
      </footer>

      <Modal
        title="연락하기"
        open={contactOpen}
        onClose={() => setContactOpen(false)}
        className="contact-sheet"
      >
        <p className="sheet-intro">
          아래 버튼을 누르면 전화 또는 문자로 연결됩니다.
        </p>
        <div className="contact-columns">
          {contactGroups.map((group) => (
            <div key={group.side}>
              <h3>{group.side}</h3>
              {group.people.map((person) => (
                <article key={person.relation}>
                  <p>
                    <small>{person.relation}</small>
                    <strong>{person.name}</strong>
                  </p>
                  <div>
                    <a href={`tel:${person.phone}`} aria-label={`${person.name}에게 전화`}>
                      ☎
                    </a>
                    <a href={`sms:${person.phone}`} aria-label={`${person.name}에게 문자`}>
                      ✉
                    </a>
                  </div>
                </article>
              ))}
            </div>
          ))}
        </div>
      </Modal>

      {notice ? (
        <div className="toast" role="status">
          <span>✓</span> {notice}
        </div>
      ) : null}
    </main>
  );
}
