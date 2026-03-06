import { redirect } from "next/navigation";

/**
 * Root dashboard page - redirects to /dashboard
 * This keeps the route structure clean and professional
 */
export default function RootDashboardPage() {
  redirect("/dashboard");
}
