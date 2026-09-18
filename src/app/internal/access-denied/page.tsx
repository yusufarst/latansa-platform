import { requireUser } from "@/modules/auth/authorization";
import { ShieldAlert, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "Access Denied - LATANSA",
};

export default async function AccessDeniedPage() {
  await requireUser();

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] p-4 text-center">
      <div className="rounded-full bg-red-100 p-6 mb-6 dark:bg-red-900/20">
        <ShieldAlert className="h-16 w-16 text-red-600 dark:text-red-500" />
      </div>
      <h1 className="text-3xl font-bold tracking-tight mb-2">Access Denied</h1>
      <p className="text-muted-foreground max-w-md mx-auto mb-8">
        You do not have the required permissions to view this page or perform this action.
      </p>
      <Link href="/internal" className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Return to Dashboard
      </Link>
    </div>
  );
}
