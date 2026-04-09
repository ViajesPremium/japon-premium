import type { MetadataRoute } from "next";

// Esta función genera automáticamente el archivo /sitemap.xml
// para que los motores de búsqueda como Google sepan qué URL
// deben rastrear e indexar.
export default function sitemap(): MetadataRoute.Sitemap {
    return [
        {
            // URL principal que quieres que Google indexe.
            url: "https://japonpremium.com",

            // Fecha de última modificación.
            // new Date() pone la fecha actual cada vez que se genera el sitemap.
            // Esto le indica al buscador que revise si hubo cambios recientes.
            lastModified: new Date(),

            // Frecuencia estimada con la que cambia esta página.
            // "weekly" le dice a los buscadores que puede actualizarse semanalmente.
            changeFrequency: "yearly",

            // Prioridad de esta URL dentro de tu sitio.
            // 1 es la más alta.
            priority: 1,
        },
    ];
}