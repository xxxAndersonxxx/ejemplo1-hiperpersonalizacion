// src/app/user-ui.model.ts
export interface Tarjeta {
    titulo: string;
    contenido: string;
    etiqueta: string;
}

export interface UIPersonalizada {
    saludo: string;
    tema_sugerido: string; // ej: 'dark-tech', 'nature-green', 'minimal-blue'
    tarjetas: Tarjeta[];
}