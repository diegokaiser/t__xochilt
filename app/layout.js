import { Roboto_Mono } from "next/font/google";
import "./globals.css";
import AuthProvider from "@/app/libs/providers/AuthContent";

const robotoMono = Roboto_Mono({ subsets: ["latin"] });

export const metadata = {
  title: "El Pastor - Xochitl",
  description: "Sistema de comandas",
};

export default function RootLayout({ children }) {
  return (
    <html lang="es-ES">
      <body className={robotoMono.className}>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
