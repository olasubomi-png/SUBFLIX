import { listAdminGenres } from "@/lib/admin-data";
import {
  createGenreAction,
  updateGenreAction,
  deleteGenreAction,
} from "@/app/actions/admin";
import { Button } from "@/components/ui/button";
import { Field, TextArea } from "@/components/admin/form-fields";
import { GenreRow } from "./genre-row";

export const dynamic = "force-dynamic";

export default async function AdminGenresPage() {
  const list = await listAdminGenres().catch(() => []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Genres</h1>
        <p className="text-sm text-muted">
          {list.length} genre{list.length !== 1 ? "s" : ""}
        </p>
      </div>

      <ul className="space-y-3">
        {list.map((g) => (
          <GenreRow key={g.id} genre={g} />
        ))}
        {list.length === 0 && (
          <p className="py-8 text-center text-muted">No genres yet.</p>
        )}
      </ul>

      <form
        action={createGenreAction}
        className="space-y-3 rounded-xl border border-white/10 bg-card p-6"
      >
        <h2 className="font-semibold text-white">Add genre</h2>
        <Field label="Name" name="name" required />
        <Field label="Slug (optional)" name="slug" placeholder="auto from name" />
        <TextArea label="Description" name="description" rows={2} />
        <Button type="submit" size="sm">
          Create genre
        </Button>
      </form>
    </div>
  );
}
