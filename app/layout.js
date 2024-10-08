import { Bai_Jamjuree } from "next/font/google";
import "./globals.css";
import Context from "./context/context";

const bai_jamjuree = Bai_Jamjuree(
  {
    subsets: ['latin'],
    weight: '400',
  }
);

export const metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
  robots: {
    index: true,
    follow: true,
  }
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta httpEquiv="X-UA-Compatible" content="IE=edge"/>{/*Agrego la etiqueta head aquí para poder agregar la etiqueta meta de http-equiv, la cual no está soportada por Next JS*/}
      </head>
      
      <body className={bai_jamjuree.className}>
      <Context>{children}</Context>
        {/* I envelope the {children} inside the Context I created, so now all the states are shared in all the app */}
      </body>
      
    </html>
  );
}
