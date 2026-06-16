import "./globals.css";

/**
 * Metadatos del sitio para SEO y visualización en pestañas del navegador
 */
export const metadata = {
  title: "Los Hongos - Simulador Botánico",
  description: "Un libro interactivo para la feria de ciencias sobre el mundo de los hongos.",
};

/**
 * Viewport meta para escalado correcto en móviles
 */
export const viewport = {
  width: "device-width",
  initialScale: 1,
};

/**
 * Estructura raíz de la aplicación Next.js
 */
export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
