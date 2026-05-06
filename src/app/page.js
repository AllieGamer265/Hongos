"use client";

import { useState } from "react";
import Image from "next/image";

/**
 * Componente Principal del Simulador "Los Hongos"
 * Este componente maneja la lógica del libro 3D interactivo.
 */
export default function Home() {
  // Estado para controlar qué páginas están volteadas y su orden de apilamiento (z-index)
  const [pages, setPages] = useState([
    { id: 1, flipped: false, zIndex: 5 }, // Portada
    { id: 2, flipped: false, zIndex: 4 }, // Anatomía
    { id: 3, flipped: false, zIndex: 3 }, // Reproducción
    { id: 4, flipped: false, zIndex: 2 }, // Amanita Muscaria
  ]);

  /**
   * Función para voltear una página específica
   * @param {number} index - Índice de la página en el array
   */
  const togglePage = (index) => {
    const newPages = [...pages];
    newPages[index].flipped = !newPages[index].flipped;
    
    // Ajuste dinámico del z-index para que las páginas se vean correctamente al voltearlas
    if (newPages[index].flipped) {
      // Si se voltea hacia la izquierda, el z-index debe ser bajo para que las siguientes queden encima
      newPages[index].zIndex = index + 1;
    } else {
      // Si se regresa a la derecha, recupera su prioridad de apilamiento original
      newPages[index].zIndex = pages.length - index;
    }
    
    setPages(newPages);
  };

  /**
   * Navegación: Avanzar a la siguiente página
   */
  const nextStep = () => {
    const firstUnflipped = pages.findIndex(p => !p.flipped);
    if (firstUnflipped !== -1) {
      togglePage(firstUnflipped);
    }
  };

  /**
   * Navegación: Regresar a la página anterior
   */
  const prevStep = () => {
    const lastFlipped = [...pages].reverse().findIndex(p => p.flipped);
    if (lastFlipped !== -1) {
      togglePage(pages.length - 1 - lastFlipped);
    }
  };

  return (
    <div className="book-wrapper">
      <div className="book">
        
        {/* ==========================================
            PÁGINA 4: Amanita Muscaria & Contraportada
            ========================================== */}
        <div 
          className={`page ${pages[3].flipped ? 'flipped' : ''}`} 
          style={{ zIndex: pages[3].zIndex }}
          onClick={() => togglePage(3)}
        >
          {/* Lado Frontal: Información sobre la Amanita */}
          <div className="page-side">
            <h2>Amanita Muscaria</h2>
            <div className="content-area">
              <div style={{ position: 'relative', width: '100%', height: '220px', borderRadius: '8px', overflow: 'hidden' }}>
                <Image 
                  src="/amanita_clean.png" 
                  alt="Amanita Muscaria" 
                  fill
                  style={{ objectFit: 'contain' }}
                />
              </div>
              <div className="placeholder-text">
                [TU INFORMACIÓN SOBRE LA AMANITA MUSCARIA AQUÍ]
              </div>
            </div>
          </div>
          {/* Lado Posterior: Contraportada del libro */}
          <div className="page-side back cover">
            <h1>Fin</h1>
            <p>Feria de Ciencias 2026</p>
          </div>
        </div>

        {/* ==========================================
            PÁGINA 3: Reproducción y Curiosidades
            ========================================== */}
        <div 
          className={`page ${pages[2].flipped ? 'flipped' : ''}`} 
          style={{ zIndex: pages[2].zIndex }}
          onClick={() => togglePage(2)}
        >
          {/* Lado Frontal: Ciclos de Reproducción */}
          <div className="page-side">
            <h2>Reproducción</h2>
                        <div className="content-area">
              <div className="reproduction-container">
                <div className="reproduction-column">
                  <h3 className="reproduction-title">Sexual</h3>
                  <p className="reproduction-text">
                    Ocurre cuando dos hifas se unen y comparten la misma célula. Al combinarse, crean un <strong>cigoto</strong> que da origen a las <strong>esporas</strong>. Estas se esparcen por el ambiente para dar vida a nuevos honguitos.
                  </p>
                </div>
                <div style={{ width: '1px', background: 'rgba(0,0,0,0.1)' }}></div>
                <div className="reproduction-column">
                  <h3 className="reproduction-title">Asexual</h3>
                  <p className="reproduction-text">
                    No requiere de dos individuos; una sola célula se separa para crear <strong>copias idénticas</strong> del progenitor. A diferencia de la sexual donde cada hongo es único, aquí son clones exactos.
                  </p>
                </div>
              </div>
            </div>
          </div>
          {/* Lado Posterior: Datos Curiosos */}
          <div className="page-side back">
            <h2>Curiosidades</h2>
            <div className="content-area">
              <div className="placeholder-text">
                [ESPACIO PARA DATOS CURIOSOS]
              </div>
            </div>
          </div>
        </div>

        {/* ==========================================
            PÁGINA 2: Anatomía del Hongo
            ========================================== */}
        <div 
          className={`page ${pages[1].flipped ? 'flipped' : ''}`} 
          style={{ zIndex: pages[1].zIndex }}
          onClick={() => togglePage(1)}
        >
          {/* Lado Frontal: Diagrama Interactivo */}
          <div className="page-side">
            <h2>Anatomía Detallada</h2>
            <div className="content-area">
              <div className="diagram-container" style={{ height: '420px', background: 'none' }}>
                <Image 
                  src="/anatomy.png" 
                  alt="Anatomía del hongo" 
                  fill
                  style={{ objectFit: 'contain', borderRadius: '8px' }}
                />
                
                {/* Líneas Conectoras y Etiquetas (Labels) */}
                {/* Píleo */}
                <div className="connector" style={{ top: '22%', left: '35%', width: '40px', transform: 'rotate(-20deg)' }}></div>
                <span className="diagram-label" title="Parte superior que protege las láminas" style={{ top: '18%', left: '15%' }}>Píleo (Sombrero)</span>
                
                {/* Escamas */}
                <div className="connector" style={{ top: '18%', left: '55%', width: '40px', transform: 'rotate(20deg)' }}></div>
                <span className="diagram-label" style={{ top: '14%', left: '65%' }}>Escamas</span>
                
                {/* Láminas */}
                <div className="connector" style={{ top: '38%', left: '55%', width: '60px', transform: 'rotate(10deg)' }}></div>
                <span className="diagram-label" style={{ top: '38%', left: '72%' }}>Láminas</span>
                
                {/* Anillo */}
                <div className="connector" style={{ top: '48%', left: '35%', width: '50px', transform: 'rotate(-10deg)' }}></div>
                <span className="diagram-label" style={{ top: '48%', left: '12%' }}>Anillo</span>
                
                {/* Estípite */}
                <div className="connector" style={{ top: '65%', left: '55%', width: '50px', transform: 'rotate(5deg)' }}></div>
                <span className="diagram-label" style={{ top: '65%', left: '72%' }}>Estípite (Pie)</span>
                
                {/* Volva */}
                <div className="connector" style={{ top: '82%', left: '35%', width: '50px', transform: 'rotate(-15deg)' }}></div>
                <span className="diagram-label" style={{ top: '80%', left: '12%' }}>Volva</span>
                
                {/* Micelio */}
                <div className="connector" style={{ top: '92%', left: '50%', width: '2px', height: '20px', transform: 'translateY(-100%)' }}></div>
                <span className="diagram-label" style={{ top: '92%', left: '50%', transform: 'translateX(-50%)' }}>Micelio</span>
              </div>
            </div>
          </div>
          {/* Lado Posterior: Explicación de las Funciones */}
          <div className="page-side back">
            <h2>Partes de los hongos</h2>
            <div className="content-area">
              <div className="placeholder-text" style={{ flex: 1, padding: '20px', fontSize: '1.1rem' }}>
                [ESCRIBE AQUÍ LAS FUNCIONES DE CADA PARTE:
                
                - Píleo: ...
                - Láminas: ...
                - Anillo: ...
                - Estípite: ...
                - Volva: ...
                - Micelio: ...
                ]
              </div>
            </div>
          </div>
        </div>

        {/* ==========================================
            PÁGINA 1: Portada e Introducción
            ========================================== */}
        <div 
          className={`page ${pages[0].flipped ? 'flipped' : ''}`} 
          style={{ zIndex: pages[0].zIndex }}
          onClick={() => togglePage(0)}
        >
          {/* Lado Frontal: Portada Artística */}
          <div className="page-side cover" style={{ padding: 0, position: 'relative' }}>
            <Image 
              src="/cover_v2.png" 
              alt="Portada Los Hongos" 
              fill
              style={{ objectFit: 'cover' }}
              priority
            />
            {/* Título Estilizado en la Portada */}
            <div style={{
              position: 'absolute',
              bottom: '10%',
              left: '50%',
              transform: 'translateX(-50%)',
              width: '80%',
              backgroundColor: 'rgba(61, 43, 31, 0.85)',
              padding: '20px',
              borderRadius: '8px',
              border: '2px solid #e0c097',
              textAlign: 'center',
              zIndex: 1,
              pointerEvents: 'none',
              boxShadow: '0 4px 15px rgba(0,0,0,0.5)'
            }}>
              <h1 style={{ 
                fontSize: '2.8rem', 
                color: '#e0c097', 
                margin: 0,
                lineHeight: '1',
                fontFamily: "'Playfair Display', serif"
              }}>Los Hongos</h1>
              <div style={{ 
                width: '60px', 
                height: '2px', 
                backgroundColor: '#e0c097', 
                margin: '10px auto' 
              }}></div>
              <p style={{ 
                color: '#e0c097', 
                fontSize: '1rem',
                margin: 0,
                textTransform: 'uppercase',
                letterSpacing: '2px'
              }}>Simulador Botánico Interactivo</p>
            </div>
          </div>
          {/* Lado Posterior: Introducción al Proyecto */}
          <div className="page-side back">
            <h2>Introducción</h2>
            <div className="content-area">
              <p style={{ 
                fontSize: '1.25rem', 
                lineHeight: '1.6', 
                color: '#4a3728',
                textAlign: 'justify',
                textIndent: '30px'
              }}>
                Los hongos son criaturas fascinantes. Bienvenido a un mundo inexplorado y nuevo. 
                Esta es una especie de bitácora donde registraré toda mi investigación para mi feria de ciencias.
              </p>
              <p style={{ 
                fontSize: '1.25rem', 
                lineHeight: '1.6', 
                color: '#4a3728',
                textAlign: 'justify',
                marginTop: '15px'
              }}>
                Existen muchos tipos: venenosos, alucinógenos y comestibles. Además, pueden ser 
                unicelulares (de una sola célula) o pluricelulares (de muchas células).
              </p>
              <div style={{ 
                marginTop: '30px', 
                textAlign: 'center', 
                opacity: 0.6,
                fontStyle: 'italic'
              }}>
                — Investigador Botánico —
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Controles de Navegación Inferiores */}
      <div className="nav-controls">
        <button className="nav-btn" onClick={prevStep}>Anterior</button>
        <button className="nav-btn" onClick={nextStep}>Siguiente</button>
      </div>
    </div>
  );
}
