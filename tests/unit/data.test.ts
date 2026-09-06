import { describe, it, expect } from "vitest";
import { MAX_DEPTH } from "@/lib/depth";
import { contactToXY } from "@/lib/sonar";
import { projects } from "@/data/projects";
import { skills } from "@/data/skills";
import { profile } from "@/data/profile";

describe("projects", () => {
  /*
   * A deliberate lock on the roster, not a restatement of the array. Contacts
   * are added here only after the repository has been read and the card's
   * figures traced to something a reader can check, so a new slug arriving
   * without this list changing means that vetting was skipped.
   */
  it("plots exactly the agreed contacts", () => {
    expect(projects.map((p) => p.slug).sort()).toEqual([
      "booksense",
      "energy-forecasting",
      "nostro",
      "pocso-shield",
      "quantumchat",
      "revisehub",
      "smart-bus-tracker",
      "vortifi",
    ]);
  });

  it("excludes the Dynamo task and the nonexistent kisan-mitra", () => {
    const blob = JSON.stringify(projects).toLowerCase();
    expect(blob).not.toContain("dynamo");
    expect(blob).not.toContain("kisan");
  });

  it("gives every contact a bearing in [0,360) and a range within the depth range", () => {
    for (const p of projects) {
      expect(p.bearing).toBeGreaterThanOrEqual(0);
      expect(p.bearing).toBeLessThan(360);
      expect(p.range).toBeGreaterThan(0);
      expect(p.range).toBeLessThanOrEqual(MAX_DEPTH);
    }
  });

  /*
   * Distinct bearings are not sufficient on their own. Two shallow contacts sit
   * almost on the origin whatever their bearing, and the scope anchors a label
   * to whichever side of centre its blip falls on — so two blips on the same
   * side at a similar height print their names on top of each other. That is
   * how Smart Bus Tracker first landed, overlapping QuantumChat at 330°.
   */
  it("keeps same-side labels far enough apart vertically to stay legible", () => {
    const plotted = projects.map((p) => ({
      slug: p.slug,
      ...contactToXY(p.bearing, p.range, 50),
    }));

    for (let i = 0; i < plotted.length; i++) {
      for (let j = i + 1; j < plotted.length; j++) {
        const a = plotted[i];
        const b = plotted[j];
        const sameSide = a.x < 0 === b.x < 0;
        if (!sameSide) continue;
        // In percent of the scope's box. The labels are 10px on a scope a few
        // hundred pixels across, so three percent clears a line of type.
        expect(
          Math.abs(a.y - b.y),
          `${a.slug} and ${b.slug} label on the same side at the same height`,
        ).toBeGreaterThanOrEqual(3);
      }
    }
  });

  it("gives every contact a distinct bearing so contacts never overlap", () => {
    const bearings = projects.map((p) => p.bearing);
    expect(new Set(bearings).size).toBe(bearings.length);
  });

  it("links every contact to a real repository under Ayush3422", () => {
    for (const p of projects) {
      expect(p.repoUrl).toMatch(/^https:\/\/github\.com\/Ayush3422\/[\w.-]+$/);
    }
  });

  it("carries the honesty caveats that the spec requires", () => {
    const quantum = projects.find((p) => p.slug === "quantumchat")!;
    expect(quantum.caveat).toMatch(/simulated/i);
    const nostro = projects.find((p) => p.slug === "nostro")!;
    expect(nostro.caveat).toMatch(/razorpay-side/i);
  });

  it("ranks NOSTRO deepest", () => {
    const deepest = [...projects].sort((a, b) => b.range - a.range)[0];
    expect(deepest.slug).toBe("nostro");
  });
});

describe("skills", () => {
  it("cites a project that exists for every skill", () => {
    const slugs = new Set([...projects.map((p) => p.slug), "abyss"]);
    for (const s of skills) {
      expect(slugs.has(s.evidenceSlug)).toBe(true);
    }
  });

  it("places each skill at the depth of the project it cites", () => {
    for (const s of skills) {
      const p = projects.find((x) => x.slug === s.evidenceSlug);
      if (p) expect(s.depth).toBe(p.range);
    }
  });

  it("uses no self-assigned percentage scores", () => {
    for (const s of skills) {
      expect(s).not.toHaveProperty("level");
    }
  });
});

describe("profile", () => {
  it("carries the decided hero line", () => {
    expect(profile.heroLine).toBe(
      "I hold the data out before I believe the number.",
    );
  });

  it("omits the claims excluded by the spec", () => {
    const blob = JSON.stringify(profile).toLowerCase();
    for (const banned of [
      "dean's list",
      "research publication",
      "professional ml engineer",
      "study group",
      "open-source contributor",
    ]) {
      expect(blob).not.toContain(banned);
    }
  });
});
