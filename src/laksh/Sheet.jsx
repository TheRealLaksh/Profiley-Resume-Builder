import React, { forwardRef } from 'react';
import {
  PERSON, HEADLINE, SUMMARY, EXPERIENCE, PROJECTS, SERVICES, SKILLS, EDUCATION,
  ACHIEVEMENTS, CERTS, VOLUNTEER, sheetSections, forLens,
} from './content';

// The A4 text version of the resume: what "Download PDF" prints, and the copy Profiley's ATS reader
// scans. Plain single-column blocks (no side-by-side rows) so a parser reads it in order.
// A table with spacer rows repeats the page margin on every printed page while @page margin stays 0
// (browsers only print headers and footers when the page margin is non-zero).

const Section = ({ title, children }) => (
  <section className="lk-sh-sec">
    <h2>{title}</h2>
    {children}
  </section>
);

const BLOCKS = {
  summary: ({ lens }) => (
    <Section title="Summary">
      <p>{SUMMARY[lens]}</p>
    </Section>
  ),
  services: () => (
    <Section title="Freelance Work and Services">
      <ul>
        {SERVICES.map((s) => (
          <li key={s.name}><b>{s.name}</b>, from {s.price}. {s.text}</li>
        ))}
      </ul>
    </Section>
  ),
  experience: ({ lens }) => (
    <Section title="Experience">
      {forLens(EXPERIENCE, lens).map((e) => (
        <div key={e.id} className="lk-sh-item">
          <h3>{e.role}, {e.org}</h3>
          <p className="lk-sh-meta">{e.place} | {e.dates}</p>
          <ul>{e.bullets.map((b) => <li key={b.t}>{b.t}</li>)}</ul>
        </div>
      ))}
    </Section>
  ),
  projects: ({ lens }) => (
    <Section title="Projects">
      {forLens(PROJECTS, lens).map((p) => (
        <div key={p.id} className="lk-sh-item">
          <h3>{p.name}: {p.kind}{p.host ? ` | ${p.host}` : ''}</h3>
          <p>{p.text} {p.proof}.</p>
        </div>
      ))}
    </Section>
  ),
  skills: () => (
    <Section title="Skills">
      {SKILLS.map((g) => (
        <p key={g.group}><b>{g.group}:</b> {g.items.join(', ')}</p>
      ))}
    </Section>
  ),
  education: () => (
    <Section title="Education">
      {EDUCATION.map((e) => (
        <div key={e.school} className="lk-sh-item">
          <h3>{e.what}, {e.school}</h3>
          <p className="lk-sh-meta">{e.dates}</p>
          <p>{e.text}</p>
        </div>
      ))}
    </Section>
  ),
  achievements: () => (
    <Section title="Achievements">
      <ul>{ACHIEVEMENTS.map((a) => <li key={a.t}>{a.year ? `${a.year}: ` : ''}{a.t}</li>)}</ul>
    </Section>
  ),
  certs: () => (
    <Section title="Certifications">
      <ul>{CERTS.map((c) => <li key={c.t}>{c.t}, {c.by} ({c.when})</li>)}</ul>
    </Section>
  ),
  volunteer: () => (
    <Section title="Volunteering">
      <ul>{VOLUNTEER.map((v) => <li key={v.t}>{v.when ? `${v.when}: ` : ''}{v.t}</li>)}</ul>
    </Section>
  ),
};

const Sheet = forwardRef(function Sheet({ lens }, ref) {
  return (
    <div id="lk-print" ref={ref} aria-hidden="true">
      <table className="lk-sh">
        <thead><tr><td><div className="lk-sh-gap" /></td></tr></thead>
        <tfoot><tr><td><div className="lk-sh-gap" /></td></tr></tfoot>
        <tbody>
          <tr>
            <td className="lk-sh-body">
              <header className="lk-sh-head">
                <img src={PERSON.photo} alt="" width="72" height="72" />
                <h1>{PERSON.name}</h1>
                <p className="lk-sh-title">{HEADLINE[lens]}</p>
                <p className="lk-sh-contact">
                  {PERSON.email} | {PERSON.location} | linkedin.com/in/laksh-pradhwani | github.com/TheRealLaksh | lakshpradhwani.com
                </p>
              </header>
              {sheetSections(lens).map((id) => {
                const Block = BLOCKS[id];
                return <Block key={id} lens={lens} />;
              })}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
});

export default Sheet;
