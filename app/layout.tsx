import "./globals.css";

export const metadata = {
  title: "Nabous Academy",
  description: "Modern training platform",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}
