import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Settings - FinBoard",
  description: "Manage your FinBoard settings and API keys",
};

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
