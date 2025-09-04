import type { Metadata } from "next";
import "@/styles/globals.css";
import { inter } from "@/styles/fonts";
import { Toaster } from "sonner";
import { AuthCallbackProvider } from "@/components/auth/auth-callback-provider";

export const metadata: Metadata = {
  title: {
    template: "%s | Themis App",
    default: "Themis App",
  },
  description:
    "An application to help healthcare professionals manage home medical care, contacts, appointments, medical records, clinical progress, diagnoses, and more.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased`}>
        <AuthCallbackProvider>{children}</AuthCallbackProvider>
        <Toaster
          position="bottom-center"
          richColors
          theme="light"
          className="text-center sm:bottom-4"
        />
      </body>
    </html>
  );
}
