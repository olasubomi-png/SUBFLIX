import { requireAdminPage } from "@/lib/admin-auth";
import { AdminNav } from "@/components/admin/admin-nav";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await requireAdminPage();

  return (
    <div className="flex min-h-screen flex-col bg-background lg:flex-row">
      <AdminNav userEmail={session.user.email} />
      <div className="flex min-w-0 flex-1 flex-col">
        <main className="flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
