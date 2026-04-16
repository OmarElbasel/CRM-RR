import { ClerkProvider } from "@clerk/nextjs";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { AdminNav } from "@/components/admin/AdminNav";
import "../globals.css";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await currentUser();

  const adminIds = (process.env.ADMIN_CLERK_USER_IDS ?? "")
    .split(",")
    .map((id) => id.trim())
    .filter(Boolean);

  if (!user || !adminIds.includes(user.id)) {
    redirect("/dashboard");
  }

  return (
    <ClerkProvider appearance={{ variables: { colorPrimary: "#4F46E5" } }}>
      <html lang="en" dir="ltr">
        <body className="antialiased">
          <div className="min-h-screen bg-gray-50 flex flex-col">
            <AdminNav />
            <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
              {children}
            </main>
          </div>
        </body>
      </html>
    </ClerkProvider>
  );
}
