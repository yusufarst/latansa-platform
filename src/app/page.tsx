import { LatansaLogo } from "@/components/brand/latansa-logo";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function Home() {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-lg border-border">
        <CardHeader className="space-y-4">
          <div className="flex justify-center mb-4">
            <LatansaLogo width={180} height={60} />
          </div>
          <CardTitle className="text-center text-2xl font-bold">LATANSA Platform</CardTitle>
          <CardDescription className="text-center text-muted-foreground">
            Application Foundation Successfully Bootstrapped
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-center">
            The modular monolith foundation is ready. This includes Next.js App Router, Tailwind CSS, shadcn/ui, and environment validation.
          </p>
          <div className="flex justify-center pt-4">
            <Button>Continue to Authentication</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
