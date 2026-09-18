import { listAdminPeople } from "@/lib/admin-data";
import { createPersonAction, deletePersonAction } from "@/app/actions/admin";
import { Button } from "@/components/ui/button";
import { Field, TextArea } from "@/components/admin/form-fields";

export const dynamic = "force-dynamic";

export default async function AdminPeoplePage() {
  const list = await listAdminPeople().catch(() => []);
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-white">People</h1>
      <ul className="space-y-2">
        {list.map((p) => (
          <li key={p.id} className="flex items-center justify-between rounded-xl border border-white/10 bg-card px-4 py-3">
            <div>
              <p className="font-medium text-white">{p.name}</p>
              <p className="text-xs text-muted">{p.slug}</p>
            </div>
            <form action={async () => { "use server"; await deletePersonAction(p.id); }}>
              <Button type="submit" size="sm" variant="ghost" className="text-red-400">Delete</Button>
            </form>
          </li>
        ))}
        {list.length === 0 && <p className="text-muted">No people yet.</p>}
      </ul>
      <form action={createPersonAction} className="space-y-3 rounded-xl border border-white/10 bg-card p-6">
        <h2 className="font-semibold text-white">Add person</h2>
        <Field label="Name" name="name" required />
        <Field label="Slug (optional)" name="slug" />
        <Field label="Photo URL" name="photoUrl" />
        <TextArea label="Biography" name="biography" rows={3} />
        <Button type="submit" size="sm">Create</Button>
      </form>
    </div>
  );
}
