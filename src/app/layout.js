import { AppProvider } from "@/components/AppContext";
import Header from "@/components/layout/Header";
import { Roboto } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";

const roboto = Roboto({ subsets: ["latin"], weight: ["400", "500", "700"] });

export const metadata = {
  title: "Hamid Orders",
  description: "Generated by create next app",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={roboto.className}>
        <main className="max-w-4xl mx-auto p-4">
          <AppProvider>
            <Toaster />
            <Header />
            <div className="my-8">{children}</div>
            <footer className="border-t p-8 text-center text-gray-500 mt-16">
              <div className="flex flex-col items-center mb-4">
                <div className="flex justify-center items-center mb-4">
                  <p className="mr-2">Follow us:</p>
                  <a
                    href="https://www.instagram.com/hamideghbali.005"
                    className="text-primary hover:text-primary-dark mr-4"
                  >
                    Instagram
                  </a>
                  <a
                    href="https://github.com/hamideghbali"
                    className="text-primary hover:text-primary-dark mr-4"
                  >
                    GitHub
                  </a>
                  <a
                    href="https://wa.me/4374990651"
                    className="text-primary hover:text-primary-dark"
                  >
                    WhatsApp
                  </a>
                </div>
                <a href="/" className="flex items-center mb-4">
                  <img
                    src="/HEicon.png"
                    alt="HE"
                    className="w-11 h-11 mr-3"
                  />
                  <span className="text-2xl font-bold">HAMID EGHBALI</span>
                </a>
              </div>
              <p>&copy; 2024 Hamid Orders. All rights reserved.</p>
            </footer>
          </AppProvider>
        </main>
      </body>
    </html>
  );
}
