import type { MetadataRoute } from "next";

// Esta función genera automáticamente el archivo /robots.txt
// para indicar a los bots de buscadores qué partes del sitio
// pueden rastrear.
export default function robots(): MetadataRoute.Robots {
    return {
        rules: {
            // userAgent: "*" significa que esta regla aplica
            // para todos los bots y rastreadores.
            userAgent: "*",

            // allow: "/" significa que permites el acceso
            // a todo el sitio.
            allow: "/",
        },

        // Aquí indicas la ubicación de tu sitemap.xml
        // para que los buscadores lo encuentren fácilmente.
        sitemap: "https://japonpremium.com/sitemap.xml",
    };
}