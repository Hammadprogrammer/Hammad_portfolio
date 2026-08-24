import { describe, it, expect } from "vitest";
import { projects, featuredProjects, getProject } from "../lib/projects";

describe("projects data", () => {
  it("has at least one project", () => {
    expect(projects.length).toBeGreaterThan(0);
  });

  it("has unique slugs", () => {
    const slugs = projects.map((p) => p.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it("has unique index numbers", () => {
    const idx = projects.map((p) => p.index);
    expect(new Set(idx).size).toBe(idx.length);
  });

  it("uses URL-safe slugs", () => {
    for (const p of projects) {
      expect(p.slug).toMatch(/^[a-z0-9-]+$/);
    }
  });

  it("every project has all required non-empty content fields", () => {
    for (const p of projects) {
      expect(p.title.length, p.slug).toBeGreaterThan(0);
      expect(p.tagline.length, p.slug).toBeGreaterThan(0);
      expect(p.overview.length, p.slug).toBeGreaterThan(0);
      expect(p.problem.length, p.slug).toBeGreaterThan(0);
      expect(p.solution.length, p.slug).toBeGreaterThan(0);
      expect(p.architecture.length, p.slug).toBeGreaterThan(0);
      expect(p.features.length, p.slug).toBeGreaterThan(0);
      expect(p.tech.length, p.slug).toBeGreaterThan(0);
      expect(p.challenges.length, p.slug).toBeGreaterThan(0);
      expect(p.results.length, p.slug).toBeGreaterThan(0);
      expect(p.gallery.length, p.slug).toBeGreaterThan(0);
    }
  });

  it("every project has a valid size for the grid", () => {
    for (const p of projects) {
      expect(["large", "small", "wide", "tall"]).toContain(p.size);
    }
  });

  it("exposes exactly 4 featured projects for the home tunnel", () => {
    expect(featuredProjects).toHaveLength(4);
  });

  it("getProject returns the right project", () => {
    const first = projects[0];
    expect(getProject(first.slug)?.title).toBe(first.title);
  });

  it("getProject returns undefined for unknown slugs", () => {
    expect(getProject("does-not-exist")).toBeUndefined();
  });
});
