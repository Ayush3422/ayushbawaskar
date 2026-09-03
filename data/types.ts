export interface Metric {
  label: string;
  value: string;
  note?: string;
}

export interface Project {
  slug: string;
  name: string;
  /** Sonar bearing label, e.g. "Applied ML / finance". */
  domain: string;
  /** Degrees clockwise from north. Distinct per contact. */
  bearing: number;
  /**
   * Sonar range in metres — how deep the work goes, deliberately on the same
   * scale as page depth. Not where the project sits on the page.
   */
  range: number;
  /** One line, shown on the blip label. */
  summary: string;
  /** Opening paragraph of the contact sheet. */
  lede: string;
  metrics: Metric[];
  stack: string[];
  repoUrl: string;
  /**
   * A limitation stated in the project's own README. Rendered prominently,
   * never as fine print — the site's premise is checkable claims.
   */
  caveat?: string;
}

export interface Skill {
  name: string;
  /** Depth of the deepest project that used it. Never a self-assessment. */
  depth: number;
  evidenceSlug: string;
  evidenceLabel: string;
}

export interface TimelineEntry {
  when: string;
  title: string;
  detail: string;
}

export interface Profile {
  name: string;
  heroLine: string;
  role: string;
  education: { degree: string; institution: string; period: string }[];
  links: { label: string; href: string }[];
  interests: string[];
  about: string[];
}
