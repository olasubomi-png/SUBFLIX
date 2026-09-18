import { listAdminCategories } from "@/lib/admin-data";
import { createCategoryAction, deleteCategoryAction } from "@/app/actions/admin";
import { Button } from "@/components/ui/button";
import { Field, TextArea } from "@/components/admin/form-fields";

export const dynamic = "force-dynamic";

export default async function AdminCategoriesPage() {
  const list = await listAdminCategories().catch(() => []);
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-white">Categories</h1>
      <ul className="space-y-2">
        {list.map((c) => (
          <li key={c.id} className="flex items-center justify-between rounded-xl border border-white/10 bg-card px-4 py-3">
            <div>
              <p className="font-medium text-white">{c.name}</p>
              <p className="text-xs text-muted">{c.slug}</p>
            </div>
            <form action={async () => { "use server"; await deleteCategoryAction(c.id); }}>
              <Button type="submit" size="sm" variant="ghost" className="text-red-400">Delete</Button>
            </form>
          </li>
        ))}
        {list.length === 0 && <p className="text-muted">No categories yet.</p>}
      </ul>
      <form action={createCategoryAction} className="space-y-3 rounded-xl border border-white/10 bg-card p-6">
        <h2 className="font-semibold text-white">Add category</h2>
        <Field label="Name" name="name" required />
        <Field label="Slug (optional)" name="slug" />
        <TextArea label="Description" name="description" rows={2} />
        <Button type="submit" size="sm">Create</Button>
      </form>
    </div>
  );
}
