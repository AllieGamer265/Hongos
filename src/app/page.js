"use client";

import { useState } from "react";
import Image from "next/image";

export default function Home() {
  const [pages, setPages] = useState([
    { id: 1, flipped: false, zIndex: 5 },
    { id: 2, flipped: false, zIndex: 4 },
    { id: 3, flipped: false, zIndex: 3 },
    { id: 4, flipped: false, zIndex: 2 },
  ]);

  const togglePage = (index) => {
    const newPages = [...pages];
    newPages[index].flipped = !newPages[index].flipped;
    
    // Adjust z-index based on flip state to ensure proper stacking
    if (newPages[index].flipped) {
      newPages[index].zIndex = index + 1;
    } else {
      newPages[index].zIndex = pages.length - index;
    }
    
    setPages(newPages);
  };

  const nextStep = () => {
    const firstUnflipped = pages.findIndex(p => !p.flipped);
    if (firstUnflipped !== -1) {
      togglePage(firstUnflipped);
    }
  };

  const prevStep = () => {
    const lastFlipped = [...pages].reverse().findIndex(p => p.flipped);
    if (lastFlipped !== -1) {
      togglePage(pages.length - 1 - lastFlipped);
    }
  };

  return (
    <div className="book-wrapper">
      <div className="book">
        
        {/* PAGE 4: Amanita Muscaria & Final */}
        <div 
          className={`page ${pages[3].flipped ? 'flipped' : ''}`} 
          style={{ zIndex: pages[3].zIndex }}
          onClick={() => togglePage(3)}
        >
          <div className="page-side">
            <h2>Amanita Muscaria</h2>
            <div className="content-area">
              <div style={{ position: 'relative', width: '100%', height: '220px', borderRadius: '8px', overflow: 'hidden' }}>
                <Image 
                  src="/amanita.png" 
                  alt="Amanita Muscaria" 
                  fill
                  style={{ objectFit: 'cover' }}
                />
              </div>
              <div className="placeholder-text">
                [TU INFORMACIÓN SOBRE LA AMANITA MUSCARIA AQUÍ]
              </div>
            </div>
          </div>
          <div className="page-side back cover">
            <h1>Fin</h1>
            <p>Feria de Ciencias 2026</p>
          </div>
        </div>

        {/* PAGE 3: Reproducción */}
        <div 
          className={`page ${pages[2].flipped ? 'flipped' : ''}`} 
          style={{ zIndex: pages[2].zIndex }}
          onClick={() => togglePage(2)}
        >
          <div className="page-side">
            <h2>Reproducción</h2>
            <div className="content-area">
              <div style={{ display: 'flex', gap: '15px', height: '100%' }}>
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <h3 style={{ fontSize: '1.2rem', color: '#8b0000' }}>Sexual</h3>
                  <div className="placeholder-text">[INFO REPRODUCCIÓN SEXUAL]</div>
                </div>
                <div style={{ width: '1px', background: '#ddd' }}></div>
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <h3 style={{ fontSize: '1.2rem', color: '#8b0000' }}>Asexual</h3>
                  <div className="placeholder-text">[INFO REPRODUCCIÓN ASEXUAL]</div>
                </div>
              </div>
            </div>
          </div>
          <div className="page-side back">
            <h2>Curiosidades</h2>
            <div className="content-area">
              <div className="placeholder-text">
                [ESPACIO PARA DATOS CURIOSOS]
              </div>
            </div>
          </div>
        </div>

        {/* PAGE 2: Partes del Hongo */}
        <div 
          className={`page ${pages[1].flipped ? 'flipped' : ''}`} 
          style={{ zIndex: pages[1].zIndex }}
          onClick={() => togglePage(1)}
        >
          <div className="page-side">
            <h2>Anatomía Detallada</h2>
            <div className="content-area">
              <div className="diagram-container" style={{ height: '320px', background: 'none' }}>
                <Image 
                  src="/anatomy.png" 
                  alt="Anatomía del hongo" 
                  fill
                  style={{ objectFit: 'contain', borderRadius: '8px' }}
                />
                
                {/* Connector Lines & Labels */}
                {/* Píleo */}
                <div className="connector" style={{ top: '22%', left: '35%', width: '40px', transform: 'rotate(-20deg)' }}></div>
                <span className="diagram-label" style={{ top: '18%', left: '15%' }}>Píleo (Sombrero)</span>
                
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
              <div className="placeholder-text" style={{ fontSize: '0.9rem', padding: '10px' }}>
                [ESCRIBE AQUÍ LAS FUNCIONES DE CADA PARTE: El micelio absorbe nutrientes, las láminas dispersan esporas, etc.]
              </div>
            </div>
          </div>
          <div className="page-side back">
            <h2>El Micelio</h2>
            <div className="content-area">
              <div className="placeholder-text">
                [MÁS ESPACIO PARA TU INFORMACIÓN]
              </div>
            </div>
          </div>
        </div>

        {/* PAGE 1: Cover */}
        <div 
          className={`page ${pages[0].flipped ? 'flipped' : ''}`} 
          style={{ zIndex: pages[0].zIndex }}
          onClick={() => togglePage(0)}
        >
          <div className="page-side cover" style={{ padding: 0, position: 'relative' }}>
            <Image 
              src="/cover_v2.png" 
              alt="Portada Los Hongos" 
              fill
              style={{ objectFit: 'cover' }}
              priority
            />
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
          <div className="page-side back">
            <h2>Introducción</h2>
            <div className="content-area">
              <div className="placeholder-text">
                [PRESENTACIÓN DE TU PROYECTO]
              </div>
            </div>
          </div>
        </div>

      </div>

      <div className="nav-controls">
        <button className="nav-btn" onClick={prevStep}>Anterior</button>
        <button className="nav-btn" onClick={nextStep}>Siguiente</button>
      </div>
    </div>
  );
}
