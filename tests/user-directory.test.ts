import assert from "node:assert/strict";
import test from "node:test";
import { getUserDirectory } from "../lib/user-directory";
import type { RegisteredUser, UserApplicationSummary } from "../lib/types";

function user(id: string, overrides: Partial<RegisteredUser> = {}): RegisteredUser {
  return {
    id, displayName: `Member ${id}`, email: `${id}@example.test`,
    createdAt: "2026-10-01T00:00:00Z", lastSignInAt: null, emailConfirmed: false,
    ...overrides,
  };
}

function application(id: string, userId: string | null, createdAt = "2026-10-01T00:00:00Z"): UserApplicationSummary {
  return { id, userId, createdAt, status: "pending_review" };
}

test("includes accounts without applications, email or prior sign-in and associates applications by user ID", () => {
  const result = getUserDirectory([
    user("registered-only"), user("applicant"), user("no-email", { email: "" }),
  ], [application("application", "applicant"), application("orphan", null), application("deleted", "deleted-user")], {});
  assert.equal(result.total, 3);
  assert.equal(result.appliedCount, 1);
  assert.equal(result.notAppliedCount, 2);
  assert.equal(result.users.find((row) => row.id === "registered-only")?.application, null);
  assert.equal(result.users.find((row) => row.id === "no-email")?.email, "");
  assert.equal(result.users.find((row) => row.id === "applicant")?.application?.id, "application");
});

test("uses the latest application regardless of input order and counts each applicant once", () => {
  const result = getUserDirectory([user("one")], [
    { ...application("latest", "one", "2026-10-07T00:00:00Z"), status: "approved" },
    application("old", "one"),
  ], {});
  assert.equal(result.appliedCount, 1);
  assert.equal(result.users[0].application?.status, "approved");
});

test("searches names, emails and IDs case-insensitively across all users, with application filtering", () => {
  const users = [user("one", { displayName: "Alice Chen" }), user("two", { email: "ALICE@example.test" }), user("alice-id")];
  const applications = [application("submitted", "one")];
  const result = getUserDirectory(users, applications, { q: " ALICE ", status: "not_applied" });
  assert.deepEqual(result.users.map((row) => row.id), ["alice-id", "two"]);
  assert.equal(result.total, 3);
  assert.equal(result.filteredCount, 2);
  assert.equal(getUserDirectory(users, applications, { q: "alice", status: "applied" }).users[0].id, "one");
  assert.equal(getUserDirectory(users, applications, { q: "missing" }).filteredCount, 0);
});

test("paginates every matching account, orders newest first and handles invalid query parameters", () => {
  const users = Array.from({ length: 105 }, (_, index) => user(String(index).padStart(3, "0")));
  users.push(user("newest", { createdAt: "2026-10-08T00:00:00Z" }));
  const defaultPage = getUserDirectory(users, [], {});
  assert.equal(defaultPage.pageSize, 10);
  assert.equal(defaultPage.users.length, 10);
  assert.equal(defaultPage.pageCount, 11);
  const pages = [1, 2, 3].map((page) => getUserDirectory(users, [], { page: String(page), pageSize: "50" }));
  assert.deepEqual(pages.map((page) => page.users.length), [50, 50, 6]);
  assert.equal(pages[0].users[0].id, "newest");
  assert.equal(new Set(pages.flatMap((page) => page.users.map((row) => row.id))).size, 106);
  assert.equal(getUserDirectory(users, [], { page: "999", pageSize: "50" }).page, 3);
  for (const pageSize of ["10", "20", "50", "100"]) {
    const result = getUserDirectory(users, [], { pageSize, page: "2" });
    assert.equal(result.pageSize, Number(pageSize));
    assert.equal(result.users[0].id, String(Number(pageSize) - 1).padStart(3, "0"));
  }
  for (const pageSize of ["", "0", "-10", "1.5", "NaN", "Infinity", "999"]) {
    assert.equal(getUserDirectory(users, [], { pageSize }).pageSize, 10);
  }
  for (const page of ["-1", "1.5", "NaN", "Infinity", "0"]) {
    assert.equal(getUserDirectory(users, [], { page, status: "invalid" }).page, 1);
  }
  assert.equal(getUserDirectory(users, [], { q: ["newest", "ignored"], page: ["1"] }).filteredCount, 1);
  const empty = getUserDirectory([], [], { page: "5" });
  assert.equal(empty.page, 1);
  assert.equal(empty.pageCount, 1);
  assert.deepEqual(empty.users, []);
});
