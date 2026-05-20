import { auth } from "@/auth";
import { SignInScreen } from "@/components/auth/SignInScreen";
import { AppShell } from "@/components/AppShell";

export default async function Home() {
  const session = await auth();

  if (!session?.user?.id) {
    return <SignInScreen />;
  }

  return <AppShell />;
}
