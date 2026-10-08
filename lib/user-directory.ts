import type { RegisteredUser, UserApplicationSummary } from "./types";

export const userDirectoryPageSizes = [10, 20, 50, 100];

export type UserDirectoryParams = {
  q?: string | string[];
  status?: string | string[];
  page?: string | string[];
  pageSize?: string | string[];
};

function first(value: string | string[] | undefined) {
  return (Array.isArray(value) ? value[0] : value) || "";
}

export function getUserDirectory(
  users: RegisteredUser[],
  applications: UserApplicationSummary[],
  params: UserDirectoryParams,
) {
  const latestApplications = new Map<string, UserApplicationSummary>();
  for (const application of applications) {
    if (!application.userId) continue;
    const previous = latestApplications.get(application.userId);
    if (!previous || application.createdAt > previous.createdAt) {
      latestApplications.set(application.userId, application);
    }
  }

  const query = first(params.q).trim();
  const requestedStatus = first(params.status);
  const status = requestedStatus === "applied" || requestedStatus === "not_applied" ? requestedStatus : "all";
  const rows = users.map((user) => ({ ...user, application: latestApplications.get(user.id) || null }));
  const appliedCount = rows.filter((user) => user.application).length;
  const filtered = rows.filter((user) => {
    const matchesQuery = [user.displayName, user.email, user.id].some((value) => value.toLowerCase().includes(query.toLowerCase()));
    return matchesQuery && (status === "all" || (status === "applied" ? Boolean(user.application) : !user.application));
  }).sort((a, b) => b.createdAt.localeCompare(a.createdAt) || a.id.localeCompare(b.id));

  const requestedPageSize = Number(first(params.pageSize));
  const pageSize = userDirectoryPageSizes.includes(requestedPageSize) ? requestedPageSize : 10;
  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize));
  const requestedPage = Number(first(params.page));
  const page = Number.isSafeInteger(requestedPage) && requestedPage > 0 ? Math.min(requestedPage, pageCount) : 1;

  return {
    query, status, page, pageCount, pageSize,
    total: users.length,
    appliedCount,
    notAppliedCount: users.length - appliedCount,
    filteredCount: filtered.length,
    users: filtered.slice((page - 1) * pageSize, page * pageSize),
  };
}
