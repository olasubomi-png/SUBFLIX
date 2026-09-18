import { listAdminCategories } from "@/lib/admin-data";
import { createCategoryFormAction } from "@/app/actions/admin";
import { Button } from "@/components/ui/button";
import { Field, TextArea } from "@/components/admin/form-fields";
import { CategoryRow } from "./category-row";

export const dynamic = "force-dynamic";

export default async function AdminCategoriesPage() {
  const list = await listAdminCategories().catch(() => []);
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Categories</h1>
        <p className="text-sm text-muted">{list.length} total</p>
      </div>
      <ul className="space-y-3">
        {list.map((c) => (
          <CategoryRow key={c.id} category={c} />
        ))}
        {list.length === 0 && (
          <p className="py-8 text-center text-muted">No categories yet.</p>
        )}
      </ul>
      <form
        action={createCategoryFormAction}
        className="space-y-3 rounded-xl border border-white/10 bg-card p-6"
      >
        <h2 className="font-semibold text-white">Add category</h2>
        <Field label="Name" name="name" required />
        <Field label="Slug (optional)" name="slug" />
        <TextArea label="Description" name="description" rows={2} />
        <Button type="submit" size="sm">
          Create category
        </Button>
      </form>
    </div>
  );
}
