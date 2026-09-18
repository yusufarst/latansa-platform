import { LatansaLogo } from "@/components/brand/latansa-logo";
import { LoginForm } from "./login-form";

export const metadata = {
  title: "Login - LATANSA Platform",
};

export default function LoginPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 dark:bg-slate-950 p-4">
      <div className="w-full max-w-md space-y-8 bg-white dark:bg-slate-900 p-8 rounded-xl shadow-lg border border-slate-100 dark:border-slate-800">
        <div className="flex flex-col items-center gap-4">
          <LatansaLogo width={160} height={48} />
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-50 mt-4">
            Welcome Back
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Sign in to your account to continue
          </p>
        </div>
        
        <LoginForm />
      </div>
    </div>
  );
}
