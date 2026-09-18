import { listAdminPeople } from "@/lib/admin-data";
import { createPersonAction } from "@/app/actions/admin";
import { Button } from "@/components/ui/button";
import { Field, TextArea } from "@/components/admin/form-fields";
import { PersonRow } from "./person-row";

export const dynamic = "force-dynamic";

export default async function AdminPeoplePage() {
  const list = await listAdminPeople().catch(() => []);
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">People</h1>
        <p className="text-sm text-muted">{list.length} people</p>
      </div>
      <ul className="space-y-3">
        {list.map((p) => (
          <PersonRow key={p.id} person={p} />
        ))}
        {list.length === 0 && <p className="py-8 text-center text-muted">No people yet.</p>}
      </ul>
      <form action={createPersonAction} className="space-y-3 rounded-xl border border-white/10 bg-card p-6">
        <h2 className="font-semibold text-white">Add person</h2>
        <Field label="Name" name="name" required />
        <Field label="Slug (optional)" name="slug" />
        <Field label="Photo URL" name="photoUrl" />
        <TextArea label="Biography" name="biography" rows={3} />
        <Button type="submit" size="sm">Create person</Button>
      </form>
    </div>
  );
}
