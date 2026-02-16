import Sidebar from "@/components/layout/Sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-white">
      <Sidebar />
      <main className="flex-1 flex flex-col min-w-0 bg-white">
        {/* Padding atas berubah dari md:pt-0 menjadi lg:pt-0 */}
        <div className="pt-14 lg:pt-0">
          <div className="p-6 lg:p-10 max-w-full">{children}</div>
        </div>
      </main>
    </div>
  );
}
