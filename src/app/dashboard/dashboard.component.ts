import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GoogleGenAI } from '@google/genai';
import { UIPersonalizada } from '../user-ui.model';

@Component({
    selector: 'app-dashboard',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
    nombre: string = '';
    intereses: string = '';
    nivel: string = 'Principiante';

    uiData: UIPersonalizada | null = null;
    cargando: boolean = false;
    errorMensaje: string = '';
    pasoActual: string = '';
    progreso: number = 0;

    private ai = new GoogleGenAI({ apiKey: 'AQ.Ab8RN6JHJk2LrAPl-Sx-MED_95XeV6kCl0rKRHWQmXD_1mJoEw' });
    private modelos: string[] = ['gemini-3.5-flash-lite', 'gemini-3.5-flash', 'gemini-3.6-flash'];

    constructor(private cdr: ChangeDetectorRef) { }

    async ngOnInit() {
        try {
            console.log('🔑 Verificando conexión con Gemini API...');
            const test = await this.ai.models.generateContent({
                model: 'gemini-3.5-flash-lite',
                contents: 'hola',
            });
            console.log('✅ Conexión exitosa con Gemini:', test.text?.trim());
        } catch (e: any) {
            console.error('❌ Error de verificación:', e?.message || e);
        }
    }

    private async simularPasos() {
        const pasos = [
            { msg: '🔍 Analizando tu perfil...', prog: 25 },
            { msg: '🧠 El agente está procesando tus intereses...', prog: 50 },
            { msg: '🎨 Diseñando tu interfaz personalizada...', prog: 75 },
            { msg: '✨ Aplicando tema y contenido...', prog: 95 },
        ];
        for (const paso of pasos) {
            this.pasoActual = paso.msg;
            this.progreso = paso.prog;
            this.cdr.detectChanges();
            await new Promise(r => setTimeout(r, 250));
        }
    }

    async generarExperiencia() {
        if (!this.nombre || !this.intereses) {
            this.errorMensaje = 'Por favor completa tu nombre y tus intereses.';
            this.cdr.detectChanges();
            return;
        }

        this.cargando = true;
        this.errorMensaje = '';
        this.uiData = null;
        this.progreso = 10;
        this.pasoActual = 'Iniciando agente hiperpersonalizado...';
        this.cdr.detectChanges();

        const prompt = `
Eres un Agente de UI especializado en hiperpersonalización.
Analiza el siguiente perfil de usuario:
- Nombre: ${this.nombre}
- Intereses Y/O enlace de linkedin para analizar todo el perfil profesional ddel usaurio en la web: ${this.intereses}
- Nivel: ${this.nivel}

Genera una estructura de interfaz de usuario en formato JSON puro con los siguientes campos exactos:
{
  "saludo": "Un saludo personalizado y motivador acorde a sus intereses y nombre",
  "tema_sugerido": "Un nombre de tema CSS (elige uno de estos tres exactamente: 'dark-tech', 'nature-green', 'minimal-blue')",
  "tarjetas": [
     {"titulo": "Título relevante 1", "contenido": "Contenido o recomendación adaptada a sus intereses", "etiqueta": "Recomendado"},
     {"titulo": "Título relevante 2", "contenido": "Contenido complementario para su nivel", "etiqueta": "Nuevo"},
     {"titulo": "Título relevante 3", "contenido": "Recurso o consejo avanzado relacionado", "etiqueta": "Popular"}
  ]
}
`;

        const simulacion = this.simularPasos();

        try {
            let textoRespuesta = '';
            let ultimoError = null;

            for (const modelo of this.modelos) {
                try {
                    console.log(`🚀 Generando UI con modelo: ${modelo}...`);
                    const response = await this.ai.models.generateContent({
                        model: modelo,
                        contents: prompt,
                        config: {
                            responseMimeType: 'application/json'
                        }
                    });

                    if (response.text) {
                        textoRespuesta = response.text;
                        console.log(`✅ Respuesta exitosa con ${modelo}`);
                        break;
                    }
                } catch (err: any) {
                    console.warn(`⚠️ Modelo ${modelo} falló, probando alternativa:`, err?.message || err);
                    ultimoError = err;
                }
            }

            if (!textoRespuesta) {
                throw ultimoError || new Error('No se pudo obtener respuesta de la API.');
            }

            await simulacion;

            console.log('📄 Respuesta recibida:', textoRespuesta);

            const jsonLimpio = textoRespuesta
                .replace(/```json\s*/gi, '')
                .replace(/```\s*/gi, '')
                .trim();

            this.uiData = JSON.parse(jsonLimpio);
            this.progreso = 100;
            this.pasoActual = '✅ ¡Interfaz generada con éxito!';
            console.log('🎨 Interfaz generada y asignada:', this.uiData);

        } catch (err: any) {
            console.error('Error al generar la UI agéntica:', err);
            this.errorMensaje = `Error del agente: ${err?.message || 'Intenta de nuevo.'}`;
        } finally {
            this.cargando = false;
            this.cdr.detectChanges();
        }
    }

    reiniciar() {
        this.uiData = null;
        this.nombre = '';
        this.intereses = '';
        this.errorMensaje = '';
        this.pasoActual = '';
        this.progreso = 0;
        this.cdr.detectChanges();
    }
}