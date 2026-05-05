import "./globals.css";

export const metadata = {
  title: "Los Hongos - Simulador Botánico",
  description: "Un libro interactivo para la feria de ciencias sobre el mundo de los hongos.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
