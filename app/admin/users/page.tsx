import Link from "next/link";
import { AdminShell, Notice, StatusPill } from "../_components";
import { requireAdmin } from "@/lib/admin-auth";
import { applicationStatusLabel, formatDate } from "@/lib/format";
import { listRegisteredUsers, listUserApplicationSummaries } from "@/lib/store";
import { getUserDirectory, userDirectoryPageSizes, type UserDirectoryParams } from "@/lib/user-directory";
import { UsersFiltersForm } from "./filters-form";
import { UsersPagination } from "./pagination";

export default async function UsersPage({ searchParams }: { searchParams: Promise<UserDirectoryParams> }) {
  await requireAdmin();
  const params = await searchParams;
  let directory: ReturnType<typeof getUserDirectory>;
  try {
    const [users, applications] = await Promise.all([listRegisteredUsers(), listUserApplicationSummaries()]);
    directory = getUserDirectory(users, applications, params);
  } catch (error) {
    console.error("Failed to load registered users", error);
    return (
      <AdminShell title="Registered users">
        <Notice error="Unable to load registered users. Please refresh the page to try again." />
      </AdminShell>
    );
  }

  function pageHref(page: number) {
    const query = new URLSearchParams({ page: String(page), pageSize: String(directory.pageSize) });
    if (directory.query) query.set("q", directory.query);
    if (directory.status !== "all") query.set("status", directory.status);
    return `/admin/users?${query}`;
  }

  return (
    <AdminShell title="Registered users">
      <p className="py-5 text-sm leading-6 text-ink-soft">
        All registered accounts, including people who have not submitted an application. Newest registrations first.
      </p>
      <section className="grid gap-px border border-line bg-line/70 sm:grid-cols-3">
        <Metric label="Registered users" value={directory.total} />
        <Metric label="Applied" value={directory.appliedCount} />
        <Metric label="Not applied" value={directory.notAppliedCount} />
      </section>

      <UsersFiltersForm key={`${directory.query}:${directory.status}:${directory.pageSize}`}>
        <label className="grid min-w-0 flex-1 gap-2 text-sm font-semibold">
          Search users
          <input name="q" type="search" defaultValue={directory.query} placeholder="Name, email or user ID"
            className="min-h-11 w-full border border-line bg-white px-3 font-normal" />
        </label>
        <label className="grid gap-2 text-sm font-semibold">
          Application
          <select name="status" defaultValue={directory.status} className="min-h-11 border border-line bg-white px-3 font-normal">
            <option value="all">All users</option>
            <option value="applied">Applied</option>
            <option value="not_applied">Not applied</option>
          </select>
        </label>
        <label className="grid gap-2 text-sm font-semibold">
          Rows per page
          <select name="pageSize" defaultValue={directory.pageSize} className="min-h-11 border border-line bg-white px-3 font-normal">
            {userDirectoryPageSizes.map((size) => <option key={size} value={size}>{size}</option>)}
          </select>
        </label>
      </UsersFiltersForm>

      <p className="my-4 text-sm text-ink-soft">{directory.filteredCount} users found · Page {directory.page} of {directory.pageCount}</p>
      <section className="overflow-hidden border border-line bg-paper">
        {directory.users.length === 0 ? (
          <p className="p-6 text-sm leading-6 text-ink-soft">
            {directory.total === 0 ? "No registered users yet." : "No users match your search. Try a different name, email or filter."}
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1050px] border-collapse text-left text-sm">
              <caption className="sr-only">Registered accounts and their latest application</caption>
              <thead className="bg-ink text-paper">
                <tr className="font-mono text-[10px] uppercase tracking-[0.2em]">
                  <th scope="col" className="px-4 py-4">User</th>
                  <th scope="col" className="px-4 py-4">Email</th>
                  <th scope="col" className="px-4 py-4">Registered</th>
                  <th scope="col" className="px-4 py-4">Last sign-in</th>
                  <th scope="col" className="px-4 py-4">Latest application</th>
                </tr>
              </thead>
              <tbody>
                {directory.users.map((user) => (
                  <tr key={user.id} className="border-t border-line align-top">
                    <td className="px-4 py-4">
                      <strong className="block text-base">{user.displayName}</strong>
                      <span className="mt-1 block font-mono text-[10px] text-ink-soft">{user.id}</span>
                    </td>
                    <td className="px-4 py-4">
                      <span className="break-all">{user.email || "No email"}</span>
                      {user.email && <span className="mt-1 block text-xs text-ink-soft">{user.emailConfirmed ? "Verified" : "Unverified"}</span>}
                    </td>
                    <td className="px-4 py-4 text-ink-soft">{formatDate(user.createdAt)}</td>
                    <td className="px-4 py-4 text-ink-soft">{user.lastSignInAt ? formatDate(user.lastSignInAt) : "Never signed in"}</td>
                    <td className="px-4 py-4">
                      {user.application ? (
                        <div className="grid justify-items-start gap-3">
                          <StatusPill>{applicationStatusLabel(user.application.status)}</StatusPill>
                          <Link href={`/admin/applications/${user.application.id}`} className="text-xs font-semibold underline decoration-sun decoration-2 underline-offset-4">
                            View application
                          </Link>
                        </div>
                      ) : <StatusPill>Not applied</StatusPill>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
      {directory.pageCount > 1 && (
        <UsersPagination
          page={directory.page}
          pageCount={directory.pageCount}
          previousHref={directory.page > 1 ? pageHref(directory.page - 1) : null}
          nextHref={directory.page < directory.pageCount ? pageHref(directory.page + 1) : null}
        />
      )}
    </AdminShell>
  );
}

function Metric({ label, value }: { label: string; value: number }) {
  return (
    <article className="bg-paper p-5">
      <p className="font-mono text-[10px] font-bold uppercase tracking-[0.24em] text-ink-soft">{label}</p>
      <strong className="mt-2 block font-poster text-5xl leading-none tracking-[0.08em]">{value}</strong>
    </article>
  );
}
