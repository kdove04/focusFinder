import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { LoginForm } from "./LoginForm";

type PageProps = {
  searchParams: Promise<{ callbackUrl?: string; error?: string }>;
};

export default async function LoginPage({ searchParams }: PageProps) {
  const session = await auth();
  if (session) {
    redirect("/locations");
  }
  const params = await searchParams;
  return (
    <div className="flex min-h-[50vh] items-center justify-center">
      <LoginForm callbackUrl={params.callbackUrl} error={params.error} />
    </div>
  );
}
