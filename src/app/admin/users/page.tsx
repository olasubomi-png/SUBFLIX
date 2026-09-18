import { listAdminUsers } from "@/lib/admin-data";
import { updateUserRoleAction, toggleUserActiveAction } from "@/app/actions/admin";
import { Button } from "@/components/ui/button";

export const dynamic = "force-dynamic";

export default async function AdminUsersPage() {
  const list = await listAdminUsers().catch(() => []);
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-white">Users</h1>
      <div className="overflow-x-auto rounded-xl border border-white/10">
        <table className="w-full min-w-[600px] text-left text-sm">
          <thead className="border-b border-white/10 bg-card text-xs uppercase text-muted">
            <tr>
              <th className="px-3 py-3">Email</th>
              <th className="px-3 py-3">Name</th>
              <th className="px-3 py-3">Role</th>
              <th className="px-3 py-3">Status</th>
              <th className="px-3 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {list.map((u) => (
              <tr key={u.id} className="border-b border-white/5">
                <td className="px-3 py-3 text-white">{u.email}</td>
                <td className="px-3 py-3 text-muted">{u.name ?? "—"}</td>
                <td className="px-3 py-3">
                  <span className={u.role === "admin" ? "text-violet-300" : "text-muted"}>
                    {u.role}
                  </span>
                </td>
                <td className="px-3 py-3">
                  <span className={u.isActive ? "text-emerald-300" : "text-red-300"}>
                    {u.isActive ? "Active" : "Inactive"}
                  </span>
                </td>
                <td className="px-3 py-3">
                  <div className="flex justify-end gap-1">
                    <form action={async () => {
                      "use server";
                      await updateUserRoleAction(u.id, u.role === "admin" ? "user" : "admin");
                    }}>
                      <Button type="submit" size="sm" variant="ghost">
                        Make {u.role === "admin" ? "user" : "admin"}
                      </Button>
                    </form>
                    <form action={async () => {
                      "use server";
                      await toggleUserActiveAction(u.id);
                    }}>
                      <Button type="submit" size="sm" variant="ghost">
                        {u.isActive ? "Deactivate" : "Activate"}
                      </Button>
                    </form>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {list.length === 0 && <p className="text-muted">No users.</p>}
    </div>
  );
}
