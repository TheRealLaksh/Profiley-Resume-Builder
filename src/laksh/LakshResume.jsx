import React, { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import {
  Download, Mail, Linkedin, Github, Sun, Moon, ArrowUpRight, MapPin, FileText, Briefcase, Layers,
  Wrench, GraduationCap, Trophy, BadgeCheck, HeartHandshake, History, Check, TriangleAlert, Info,
  Gauge, Sparkles, Copy,
} from 'lucide-react';
import Logo from '../components/UI/Logo';
import { readPaper, runChecks } from '../ats/analyze';
import {
  LENSES, PERSON, HEADLINE, SUMMARY, STATS, EXPERIENCE, PROJECTS, SERVICES, SKILLS, EDUCATION,
  ACHIEVEMENTS, CERTS, VOLUNTEER, CHANGELOG, ORDER, SECTION_LABEL, sheetSections, forLens,
} from './content';
import { useReveal, useCountUp, magnet, tilt, useLiveStatus, useActiveSection, useScrollProgress, safeStorage } from './hooks';
import Sheet from './Sheet';
import ViewSwitch from './ViewSwitch';
import './switch.css';
import './laksh.css';

const ICONS = {
  summary: FileText, services: Sparkles, projects: Layers, experience: Briefcase, skills: Wrench,
  education: GraduationCap, achievements: Trophy, certs: BadgeCheck, volunteer: HeartHandshake, changelog: History,
};
// Headings as they print on the A4 sheet; the ATS check reads those, not the screen titles.
const PRINT_TITLE = { ...SECTION_LABEL, services: 'Freelance Work and Services' };
const TINT = {
  summary: 'sage', services: 'peach', projects: 'sky', experience: 'sand', skills: 'mint',
  education: 'lilac', achievements: 'butter', certs: 'sky', volunteer: 'rose', changelog: 'mint',
};

/** Entrance wrapper: fades and lifts once when scrolled into view; --i staggers siblings. */
const R = ({ as: Tag = 'div', i = 0, className = '', style, children, ...rest }) => {
  const ref = useReveal();
  return (
    <Tag ref={ref} className={`lk-r ${className}`} style={{ '--i': i, ...style }} {...rest}>
      {children}
    </Tag>
  );
};

const Sec = ({ id, n, children }) => {
  const Icon = ICONS[id];
  return (
    <section id={`s-${id}`} className="lk-sec" data-tint={TINT[id]}>
      <R as="header" className="lk-sec-head">
        <span className="lk-sec-ico"><Icon size={16} strokeWidth={1.8} /></span>
        <h2>{SECTION_LABEL[id]}</h2>
        <span className="lk-sec-n tabular">{String(n).padStart(2, '0')}</span>
      </R>
      {children}
    </section>
  );
};

const Stat = ({ value, label, i }) => {
  const [ref, n] = useCountUp(value);
  return (
    <R i={i} className="lk-stat">
      <b ref={ref} className="tabular">{n}</b>
      <span>{label}</span>
    </R>
  );
};

const StatusPill = ({ s }) => {
  if (!s) return <span className="lk-status" data-s="wait"><i />checking</span>;
  if (s.state === 'up') return <span className="lk-status" data-s="up"><i />live · {s.ms} ms</span>;
  return <span className="lk-status" data-s="down"><i />unreachable</span>;
};

const Dial = ({ score }) => {
  const C = 2 * Math.PI * 34;
  return (
    <svg viewBox="0 0 80 80" className="lk-dial" role="img" aria-label={`ATS score ${score} out of 100`}>
      <circle cx="40" cy="40" r="34" className="lk-dial-bg" />
      <circle cx="40" cy="40" r="34" className="lk-dial-fg" strokeDasharray={C} strokeDashoffset={C * (1 - score / 100)} transform="rotate(-90 40 40)" />
    </svg>
  );
};

// ---- ATS --------------------------------------------------------------------------------------------------------
const WEIGHT = { fail: 20, warn: 8, info: 2, pass: 0 };

const scoreSheet = (paper, lens) => {
  const reading = readPaper(paper);
  if (!reading) return null;
  const experience = forLens(EXPERIENCE, lens).map((e) => ({ year: e.dates, details: e.bullets.map((b) => `- ${b.t}`).join('\n') }));
  const result = runChecks({
    data: {
      personal: {
        name: PERSON.name, email: PERSON.email, phone: '', summary: SUMMARY[lens],
        linkedin: PERSON.linkedin, portfolio: PERSON.portfolio, photoUrl: PERSON.photo,
      },
      experience,
      skills: SKILLS.flatMap((g) => g.items),
      custom: {},
    },
    config: { layoutType: 'single', skillStyle: 'tags', showPhoto: true },
    sectionOrder: sheetSections(lens).map((id) => ({ id, label: PRINT_TITLE[id], visible: true })),
    reading,
  });
  // Two checks do not apply to a hand-built public page: the PDF tip is about the editor's image export, and the
  // phone number is left off on purpose. Both are shown as notes instead of faults.
  const checks = result.checks
    .filter((c) => c.id !== 'pdf')
    .map((c) => (c.id === 'contact' && c.status !== 'pass'
      ? { ...c, status: 'info', title: 'Phone number left off on purpose', detail: 'This page is public, so only the email and links are listed.' }
      : c));
  const score = Math.max(0, 100 - checks.reduce((sum, c) => sum + WEIGHT[c.status], 0));
  const label = score >= 90 ? 'Excellent' : score >= 75 ? 'Good' : score >= 55 ? 'Needs work' : 'At risk';
  return { score, label, checks, pages: reading.pages, words: reading.smart.join(' ').split(/\s+/).length };
};

const CheckIcon = ({ s }) => {
  if (s === 'pass') return <Check size={14} />;
  if (s === 'info') return <Info size={14} />;
  return <TriangleAlert size={14} />;
};

const AtsCard = ({ ats }) => {
  const [open, setOpen] = useState(false);
  const [shown, setShown] = useState(0);
  const ref = useReveal();
  useEffect(() => {
    if (!ats) return undefined;
    const t = setTimeout(() => setShown(ats.score), 120);
    return () => clearTimeout(t);
  }, [ats]);
  return (
    <div ref={ref} className="lk-r lk-ats" data-tint="sage">
      <div className="lk-ats-top">
        <div className="lk-dial-wrap">
          <Dial score={shown} />
          <b className="tabular">{ats ? shown : '--'}</b>
        </div>
        <div>
          <p className="lk-eyebrow"><Gauge size={13} /> ATS check, live</p>
          <p className="lk-ats-label">{ats ? ats.label : 'Reading...'}</p>
          <p className="lk-ats-sub">{ats ? `${ats.pages} page${ats.pages > 1 ? 's' : ''} printed` : ''}</p>
        </div>
      </div>
      <p className="lk-ats-note">Profiley's own ATS reader, run in your browser on the printable version of this page.</p>
      <button type="button" className="lk-link" onClick={() => setOpen((o) => !o)} aria-expanded={open}>
        {open ? 'Hide the checks' : 'Show the checks'}
      </button>
      <div className="lk-fold" data-open={open}>
        <ul>
          {ats?.checks.map((c) => (
            <li key={c.id} data-s={c.status}>
              <span className="lk-ck"><CheckIcon s={c.status} /></span>
              <div><b>{c.title}</b><span>{c.detail}</span></div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

// ---- Sections ---------------------------------------------------------------------------------------------------
const Summary = ({ lens }) => (
  <>
    <R as="p" i={1} className="lk-lead" key={lens}>{SUMMARY[lens]}</R>
    <div className="lk-stats">
      {STATS.map((s, i) => <Stat key={s.label} {...s} i={i + 2} />)}
    </div>
  </>
);

const Services = () => (
  <>
    <div className="lk-cards">
      {SERVICES.map((s, i) => (
        <R key={s.name} i={i + 1} className="lk-card lk-tilt" {...tilt(4)}>
          <p className="lk-price">from <b>{s.price}</b></p>
          <h3>{s.name}</h3>
          <p>{s.text}</p>
        </R>
      ))}
    </div>
    <R i={4} as="p" className="lk-fine">
      Starting prices. Send a short brief and I will reply with a scope and a quote.{' '}
      <a className="lk-ul" href={`mailto:${PERSON.email}?subject=Project%20brief`}>Email a brief</a>
    </R>
  </>
);

const Projects = ({ lens, status }) => (
  <div className="lk-cards lk-cards-2">
    {forLens(PROJECTS, lens).map((p, i) => {
      const body = (
        <>
          <div className="lk-card-top">
            <span className="lk-kind">{p.kind}</span>
            {p.url ? <StatusPill s={status[p.id]} /> : null}
          </div>
          <h3>{p.name}{p.url ? <ArrowUpRight size={16} className="lk-go" /> : null}</h3>
          <p>{p.text}</p>
          <p className="lk-proof">{p.proof}</p>
          <div className="lk-tags">{p.tags.map((t) => <span key={t}>{t}</span>)}</div>
        </>
      );
      return p.url ? (
        <R as="a" key={p.id} i={i + 1} className="lk-card lk-tilt lk-proj" href={p.url} target="_blank" rel="noreferrer" {...tilt(4)}>{body}</R>
      ) : (
        <R key={p.id} i={i + 1} className="lk-card lk-tilt lk-proj" {...tilt(4)}>{body}</R>
      );
    })}
  </div>
);

const Experience = ({ lens }) => {
  const list = forLens(EXPERIENCE, lens);
  const ref = useReveal(0.05);
  return (
    <div className="lk-tl" ref={ref}>
      <span className="lk-tl-line" />
      {list.map((e, i) => (
        <R key={e.id} i={i + 1} as="article" className="lk-tl-item">
          <span className="lk-tl-dot" />
          <div className="lk-tl-head">
            <h3>{e.role}</h3>
            <span className="lk-mono">{e.dates}</span>
          </div>
          <p className="lk-org">{e.org} <span>{e.place}</span></p>
          <ul>{e.bullets.map((b) => <li key={b.t}>{b.t}</li>)}</ul>
          <div className="lk-tags">{e.tags.map((t) => <span key={t}>{t}</span>)}</div>
        </R>
      ))}
    </div>
  );
};

const Skills = () => (
  <div className="lk-skills">
    {SKILLS.map((g, gi) => (
      <R key={g.group} i={gi + 1} className="lk-skill-group">
        <h3>{g.group}</h3>
        <div className="lk-tags lk-tags-lg">
          {g.items.map((t, ti) => <span key={t} style={{ '--t': ti }}>{t}</span>)}
        </div>
      </R>
    ))}
  </div>
);

const Education = () => (
  <div className="lk-rows">
    {EDUCATION.map((e, i) => (
      <R key={e.school} i={i + 1} className="lk-row">
        <div>
          <h3>{e.what}</h3>
          <p className="lk-org">{e.school}</p>
          <p className="lk-small">{e.text}</p>
        </div>
        <span className="lk-mono">{e.dates}</span>
      </R>
    ))}
  </div>
);

const Achievements = () => (
  <ul className="lk-list">
    {ACHIEVEMENTS.map((a, i) => (
      <R key={a.t} as="li" i={i + 1}>
        <span className="lk-pill lk-mono">{a.year || 'Ongoing'}</span>
        <span>{a.t}</span>
      </R>
    ))}
  </ul>
);

const Certs = () => (
  <ul className="lk-list">
    {CERTS.map((c, i) => (
      <R key={c.t} as="li" i={i + 1}>
        <span className="lk-pill lk-mono">{c.when}</span>
        <span><b>{c.t}</b>, {c.by}</span>
      </R>
    ))}
  </ul>
);

const Volunteer = () => (
  <ul className="lk-list">
    {VOLUNTEER.map((v, i) => (
      <R key={v.t} as="li" i={i + 1}>
        <span className="lk-pill lk-mono">{v.when || 'Also'}</span>
        <span>{v.t}</span>
      </R>
    ))}
  </ul>
);

const Changelog = () => {
  const [open, setOpen] = useState(0);
  return (
    <>
      <R as="p" className="lk-fine">A git log for this resume, newest first. Open an entry to see what changed.</R>
      <ol className="lk-log">
        {CHANGELOG.map((c, i) => (
          <R key={c.when} as="li" i={i + 1} className="lk-log-item" data-open={open === i}>
            <button type="button" className="lk-log-btn" onClick={() => setOpen(open === i ? -1 : i)} aria-expanded={open === i}>
              <span className="lk-log-dot" />
              <span className="lk-mono lk-log-when">{c.when}</span>
              <b>{c.title}</b>
              <span className="lk-log-stat lk-mono">+{c.add.length} -{c.del.length}</span>
            </button>
            <div className="lk-fold" data-open={open === i}>
              <div className="lk-diff">
                {c.del.map((l) => <p key={l} className="lk-del"><i>-</i>{l}</p>)}
                {c.add.map((l) => <p key={l} className="lk-add"><i>+</i>{l}</p>)}
              </div>
            </div>
          </R>
        ))}
      </ol>
    </>
  );
};

// ---- Page -------------------------------------------------------------------------------------------------------
const initialLens = () => {
  const q = new URLSearchParams(window.location.search).get('lens');
  const saved = safeStorage.get('lk-lens');
  const pick = [q, saved].find((v) => LENSES.some((l) => l.id === v));
  return pick || 'client';
};

const initialTheme = () => {
  const saved = safeStorage.get('lk-theme');
  if (saved === 'light' || saved === 'dark') return saved;
  return window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
};

export default function LakshResume() {
  const rootRef = useRef(null);
  const sheetRef = useRef(null);
  const [lens, setLens] = useState(initialLens);
  const [theme, setTheme] = useState(initialTheme);
  const [ats, setAts] = useState(null);
  const [copied, setCopied] = useState(false);
  const status = useLiveStatus(PROJECTS);
  const order = ORDER[lens];
  const active = useActiveSection(order);
  useScrollProgress(rootRef);

  useEffect(() => {
    document.title = `${PERSON.name} - Resume`;
    const desc = document.querySelector('meta[name="description"]');
    if (desc) desc.setAttribute('content', `${PERSON.name}: freelance full-stack developer and B.Tech Data Science & AI student. Resume with live project status and an ATS check.`);
    // Page margins live in the print table, so the browser adds no header or footer.
    document.documentElement.classList.toggle('dark', theme === 'dark');
    safeStorage.set('lk-theme', theme);
  }, [theme]);

  const chooseLens = useCallback((id) => {
    setLens(id);
    safeStorage.set('lk-lens', id);
    const url = new URL(window.location.href);
    url.searchParams.set('lens', id);
    window.history.replaceState({}, '', url);
  }, []);

  // Score the printable copy whenever the lens changes, once fonts have settled.
  useLayoutEffect(() => {
    let cancelled = false;
    const run = () => {
      if (cancelled || !sheetRef.current) return;
      setAts(scoreSheet(sheetRef.current, lens));
    };
    (document.fonts?.ready ?? Promise.resolve()).then(() => requestAnimationFrame(run));
    return () => { cancelled = true; };
  }, [lens]);

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(PERSON.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      window.location.href = `mailto:${PERSON.email}`;
    }
  };

  const lensIndex = LENSES.findIndex((l) => l.id === lens);
  const SECTIONS = {
    summary: <Summary lens={lens} />,
    services: <Services />,
    projects: <Projects lens={lens} status={status} />,
    experience: <Experience lens={lens} />,
    skills: <Skills />,
    education: <Education />,
    achievements: <Achievements />,
    certs: <Certs />,
    volunteer: <Volunteer />,
    changelog: <Changelog />,
  };

  // Words stay whole (nowrap); letters inside them animate in one by one.
  const nameWords = useMemo(() => {
    let n = 0;
    return PERSON.name.split(' ').map((w) => w.split('').map((c) => ({ c, i: n++ })));
  }, []);

  return (
    <div className="lk" data-theme={theme} ref={rootRef}>
      <div className="lk-progress" aria-hidden="true" />

      <header className="lk-bar">
        <a href="/" className="lk-logo" aria-label="Profiley home"><Logo size="sm" /></a>
        <div className="lk-lens" role="radiogroup" aria-label="Who is reading" style={{ '--i': lensIndex }}>
          <span className="lk-lens-pill" />
          {LENSES.map((l) => (
            <button key={l.id} type="button" role="radio" aria-checked={lens === l.id} title={l.hint} onClick={() => chooseLens(l.id)} data-on={lens === l.id}>
              {l.label}
            </button>
          ))}
        </div>
        <div className="lk-actions">
          <ViewSwitch creative />
          <button type="button" className="lk-btn lk-btn-ghost lk-icon" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} aria-label={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}>
            {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
          </button>
          <button type="button" className="lk-btn lk-btn-primary lk-mag" onClick={() => window.print()} {...magnet()}>
            <Download size={15} /> <span>PDF</span>
          </button>
        </div>
      </header>

      <div className="lk-wrap">
        <main className="lk-main">
          <section className="lk-hero">
            <div className="lk-hero-id">
              <div className="lk-hero-photo lk-tilt" {...tilt(7)}>
                <img src={PERSON.photo} alt="Laksh Pradhwani" width="120" height="120" />
              </div>
              <p className="lk-eyebrow lk-hero-up" style={{ '--i': 0 }}><MapPin size={13} /> {PERSON.location}</p>
            </div>
            <div className="lk-hero-copy">
              <h1 className="lk-name" aria-label={PERSON.name}>
                {nameWords.map((word, wi) => (
                  <span key={wi} className="lk-word" aria-hidden="true">
                    {word.map(({ c, i }) => <span key={i} className="lk-ch" style={{ '--i': i }}>{c}</span>)}
                  </span>
                ))}
              </h1>
              <p className="lk-headline" key={lens}>{HEADLINE[lens]}</p>
              <div className="lk-links lk-hero-up" style={{ '--i': 8 }}>
                <button type="button" className="lk-chip lk-mag" onClick={copyEmail} {...magnet()}>
                  {copied ? <Check size={14} /> : <Mail size={14} />}
                  <span>{copied ? 'Copied' : PERSON.email}</span>
                  {!copied && <Copy size={12} className="lk-chip-end" />}
                </button>
                <a className="lk-chip lk-mag" href={PERSON.linkedin} target="_blank" rel="noreferrer" {...magnet()}><Linkedin size={14} /> LinkedIn</a>
                <a className="lk-chip lk-mag" href={PERSON.github} target="_blank" rel="noreferrer" {...magnet()}><Github size={14} /> GitHub</a>
                <a className="lk-chip lk-mag" href={PERSON.portfolio} target="_blank" rel="noreferrer" {...magnet()}><ArrowUpRight size={14} /> Portfolio</a>
              </div>
            </div>
          </section>

          <div className="lk-swap" key={lens}>
            {order.map((id, i) => (
              <Sec key={id} id={id} n={i + 1}>{SECTIONS[id]}</Sec>
            ))}
          </div>

          <footer className="lk-foot">
            <p>Last updated {PERSON.updated}. Built on <a className="lk-ul" href="/">Profiley</a>, the resume builder I made, with the rules off.</p>
          </footer>
        </main>

        <aside className="lk-rail">
          <div className="lk-rail-inner">
            <AtsCard ats={ats} />
            <nav className="lk-nav" aria-label="Sections">
              {order.map((id) => (
                <a key={id} href={`#s-${id}`} data-on={active === id}>{SECTION_LABEL[id]}</a>
              ))}
            </nav>
          </div>
        </aside>
      </div>

      {createPortal(<Sheet ref={sheetRef} lens={lens} />, document.body)}
    </div>
  );
}
