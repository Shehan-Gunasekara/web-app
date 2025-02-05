import type { Metadata } from "next";
import "./globals.css";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import { ThemeProvider } from "./providers/ThemeProvider";
import { AuthProvider } from "./providers/AuthProvider";
import { ApolloWrapper } from "@/lib/apollo-provider";
import { SettingsProvider } from "@/app/providers/SettingsProvider";
import { Exo } from "next/font/google";
// import useSelectedStrings from "@/constants/strings";

// import useSelectedStrings from "@/constants/strings";

// export const metadata: Metadata = {};

const exo_init = Exo({
  weight: ["400", "500", "700"],
  subsets: ["latin"],
  variable: "--font-exo",
});

export const metadata: Metadata = {
  title: "Lono - Local Anywhere",
  description: "Restaurant management app",
  manifest: "/manifest.json",
  icons: { icon: "/assets/logo.svg", apple: "/assets/logo.svg" },
  themeColor: "#FFFFFF",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // const selectedStrings = useSelectedStrings();
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/assets/logo-tab.svg" />
        <link rel="apple-touch-icon" href="/assets/logo-tab.svg" />
        {/* <title>{selectedStrings.appName}</title>
        <meta name="description" content={selectedStrings.metaDescription} />
        <link rel="manifest" href="/manifest.json" /> */}
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700&display=swap"
        />
      </head>

      <body style={{ margin: 0, padding: 0 }} className={exo_init.variable}>
        <AntdRegistry>
          <ThemeProvider>
            <SettingsProvider>
              <AuthProvider>
                <ApolloWrapper>{children}</ApolloWrapper>
              </AuthProvider>
            </SettingsProvider>
          </ThemeProvider>
        </AntdRegistry>
      </body>
    </html>
  );
}
