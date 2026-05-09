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
    { id: 1, flipped: false, zIndex: 6 }, // Portada
    { id: 2, flipped: false, zIndex: 5 }, // Anatomía
    { id: 3, flipped: false, zIndex: 4 }, // Reproducción
    { id: 4, flipped: false, zIndex: 3 }, // Rarezas (NUEVA)
    { id: 5, flipped: false, zIndex: 2 }, // Amanita Muscaria
  ]);

  // Estado para la interactividad de anatomía
  const [selectedPart, setSelectedPart] = useState(null);
  
  // Estado para el efecto 3D (Tilt)
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  // Estado para el crecimiento del hongo
  const [isGrowing, setIsGrowing] = useState(false);
  const [growthStage, setGrowthStage] = useState(0); // 0: nada, 1: brotando, 2: maduro

  // Estado para la Galería de Rarezas
  const [rareIndex, setRareIndex] = useState(0);
  const rareSpecies = [
    {
      name: "Hydnellum peckii",
      common: "Diente Sangrante",
      desc: "No es sangre, es un fluido rojo que secreta cuando es joven. ¡Parece un postre, pero es muy amargo!",
      color: "#ff4d4d",
      image: "https://upload.wikimedia.org/wikipedia/commons/e/e0/Hydnellum_peckii_01.JPG"
    },
    {
      name: "Phallus indusiatus",
      common: "Velo de Novia",
      desc: "Posee una delicada 'falda' de encaje. Crece en jardines y bosques tropicales en cuestión de horas.",
      color: "#e0e0e0",
      image: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/23/Phallus_indusiatus.jpg/800px-Phallus_indusiatus.jpg"
    },
    {
      name: "Clathrus ruber",
      common: "Hongo Jaula",
      desc: "Parece una pelota de fútbol roja hecha de ramas. Huele a carne podrida para atraer moscas.",
      color: "#ff6b6b",
      image: "https://upload.wikimedia.org/wikipedia/commons/6/6d/Clathrus_ruber.jpg"
    }

  ];

  // Descripciones detalladas de la anatomía
  const anatomyInfo = {
    "Píleo": {
      title: "Píleo (Sombrero)",
      desc: "Es la parte superior del hongo que protege las láminas. Su superficie puede ser lisa, escamosa o viscosa, y su color es vital para identificar especies venenosas."
    },
    "Escamas": {
      title: "Escamas",
      desc: "Restos del velo universal que protegía al hongo cuando era un 'huevo'. Son muy características de la Amanita Muscaria."
    },
    "Láminas": {
      title: "Láminas",
      desc: "Estructuras laminares donde se producen las esporas. Son el motor reproductivo del hongo, liberando millones de esporas al viento."
    },
    "Anillo": {
      title: "Anillo",
      desc: "Una membrana que rodea el estípite. Es el resto del velo parcial que protegía las láminas durante el desarrollo temprano del hongo."
    },
    "Estípite": {
      title: "Estípite (Pie)",
      desc: "El tallo que sostiene el píleo. Su función es elevar el sombrero para facilitar la dispersión de las esporas por las corrientes de aire."
    },
    "Volva": {
      title: "Volva",
      desc: "Estructura en forma de copa en la base del pie. Es un rasgo distintivo de ciertos géneros de hongos y representa el resto del velo inicial."
    },
    "Micelio": {
      title: "Micelio",
      desc: "La red subterránea de hifas. Es el verdadero 'cuerpo' del hongo, extendiéndose por metros bajo tierra para absorber nutrientes."
    }
  };

  /**
   * Maneja el ciclo de crecimiento del hongo
   */
  const handleGrowth = (e) => {
    e.stopPropagation();
    if (isGrowing) return;

    setIsGrowing(true);
    setGrowthStage(1);
    
    // Simular etapas de crecimiento
    setTimeout(() => setGrowthStage(2), 2000);
    setTimeout(() => {
      // Opcional: resetear después de un tiempo o dejarlo ahí
    }, 5000);
  };

  const resetGrowth = (e) => {
    e.stopPropagation();
    setIsGrowing(false);
    setGrowthStage(0);
  };

  /**
   * Función para voltear una página específica
   * @param {number} index - Índice de la página en el array
   */
  const togglePage = (index, e) => {
    // Si el clic viene de un botón o cualquier elemento con la clase 'no-flip', NO voltear
    if (e?.target.closest('.no-flip') || 
        e?.target.closest('button') || 
        e?.target.closest('.diagram-label')) {
      return;
    }

    const newPages = [...pages];
    newPages[index].flipped = !newPages[index].flipped;
    
    // Ajuste dinámico del z-index para que las páginas se vean correctamente al voltearlas
    if (newPages[index].flipped) {
      newPages[index].zIndex = index + 1;
    } else {
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

  /**
   * Maneja el efecto de inclinación 3D basado en el ratón
   */
  const handleMouseMove = (e) => {
    const { clientX, clientY } = e;
    const { innerWidth, innerHeight } = window;
    
    // Calcular rotación (-5 a 5 grados)
    const x = ((clientY / innerHeight) - 0.5) * 10;
    const y = ((clientX / innerWidth) - 0.5) * -10;
    
    setTilt({ x, y });
  };

  const resetTilt = () => {
    setTilt({ x: 0, y: 0 });
  };

  return (
    <div 
      className="book-wrapper"
      onMouseMove={handleMouseMove}
      onMouseLeave={resetTilt}
    >
      {/* Zonas invisibles para pasar página (Hitboxes) */}
      <div className="flip-hitbox left" onClick={prevStep} title="Página Anterior"></div>
      <div className="flip-hitbox right" onClick={nextStep} title="Página Siguiente"></div>

      <div 
        className="book"
        style={{ 
          transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`
        }}
      >
        {/* ==========================================
            PÁGINA 5: Amanita Muscaria & Contraportada
            ========================================== */}
        <div 
          className={`page ${pages[4].flipped ? 'flipped' : ''}`} 
          style={{ zIndex: pages[4].zIndex }}
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
                <p>La <strong>Amanita Muscaria</strong> es el hongo más icónico del mundo.</p>
                <p style={{ fontSize: '0.9rem', color: '#666' }}>Su color rojo brillante con puntos blancos sirve como advertencia en la naturaleza.</p>
              </div>
            </div>
          </div>
          {/* Lado Posterior: Contraportada del libro */}
          <div className="page-side back cover">
            <h1>Fin</h1>
            <p>Feria de Ciencias 2026</p>
            <div style={{ marginTop: '40px' }}>
              <button 
                className="interact-btn no-flip" 
                onClick={(e) => {
                  e.stopPropagation();
                  const resetPages = pages.map((p, i) => ({
                    ...p,
                    flipped: false,
                    zIndex: pages.length - i
                  }));
                  setPages(resetPages);
                }}
              >
                📕 Volver a empezar
              </button>
            </div>
          </div>
        </div>

        {/* ==========================================
            PÁGINA 4: Galería de Rarezas (NUEVA)
            ========================================== */}
        <div 
          className={`page ${pages[3].flipped ? 'flipped' : ''}`} 
          style={{ zIndex: pages[3].zIndex }}
        >
          {/* Lado Frontal: Lista de Rarezas */}
          <div className="page-side">
            <h2>Rarezas del Mundo</h2>
            <div className="content-area">
              <div className="rare-gallery-container">
                <div className="rare-card" style={{ borderColor: rareSpecies[rareIndex].color }}>
                  <div className="rare-badge" style={{ backgroundColor: rareSpecies[rareIndex].color }}>
                    {rareSpecies[rareIndex].common}
                  </div>
                  <h3 style={{ color: '#333', margin: '10px 0 5px 0' }}>{rareSpecies[rareIndex].name}</h3>
                  <p style={{ fontSize: '0.95rem', color: '#555', lineHeight: '1.4' }}>
                    {rareSpecies[rareIndex].desc}
                  </p>
                  
                  <div className="rare-visual-container" style={{ 
                    position: 'relative',
                    width: '100%',
                    height: '180px',
                    borderRadius: '8px',
                    overflow: 'hidden',
                    marginTop: '10px',
                    background: `linear-gradient(135deg, ${rareSpecies[rareIndex].color}22, ${rareSpecies[rareIndex].color}44)`,
                    border: `1px solid ${rareSpecies[rareIndex].color}44`
                  }}>
                    <Image 
                      src={rareSpecies[rareIndex].image}
                      alt={rareSpecies[rareIndex].name}
                      fill
                      style={{ objectFit: 'cover' }}
                      onError={(e) => {
                        // Si no encuentra la imagen, mostramos un estilo de respaldo
                        e.target.style.display = 'none';
                      }}
                    />
                    <div style={{ 
                      position: 'absolute', 
                      inset: 0, 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center',
                      zIndex: -1,
                      color: rareSpecies[rareIndex].color,
                      fontSize: '0.8rem',
                      fontWeight: 'bold'
                    }}>
                      [ Sin Imagen ]
                    </div>
                  </div>
                </div>

                <div className="rare-controls">
                  {rareSpecies.map((_, idx) => (
                    <button 
                      key={idx}
                      className={`rare-dot-btn no-flip ${rareIndex === idx ? 'active' : ''}`}
                      onClick={(e) => { e.stopPropagation(); setRareIndex(idx); }}
                      style={{ '--dot-color': rareSpecies[idx].color }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
          {/* Lado Posterior: Curiosidades Médicas */}
          <div className="page-side back">
            <h2>Importancia</h2>
            <div className="content-area">
              <div className="importance-item">
                <div className="importance-icon">💊</div>
                <div>
                  <h4>Medicina</h4>
                  <p>Muchos hongos producen compuestos que usamos como antibióticos, como la penicilina.</p>
                </div>
              </div>
              <div className="importance-item">
                <div className="importance-icon">♻️</div>
                <div>
                  <h4>Reciclaje</h4>
                  <p>Sin ellos, las hojas y ramas muertas llenarían el mundo. Son los mejores recicladores de la Tierra.</p>
                </div>
              </div>
              <div className="importance-item">
                <div className="importance-icon">🌲</div>
                <div>
                  <h4>Simbiosis</h4>
                  <p>Ayudan a las raíces de los árboles a absorber agua, a cambio de un poco de azúcar.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ==========================================
            PÁGINA 3: Reproducción y Curiosidades
            ========================================== */}
        <div 
          className={`page ${pages[2].flipped ? 'flipped' : ''}`} 
          style={{ zIndex: pages[2].zIndex }}
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
          {/* Lado Posterior: Datos Curiosos e Interacción de Crecimiento */}
          <div className="page-side back">
            <h2>Ciclo de Vida</h2>
            <div className="content-area">
              <p style={{ fontSize: '1rem', color: '#666', fontStyle: 'italic', textAlign: 'center' }}>
                Pulsa el botón para nutrir el micelio y ver cómo crece el hongo.
              </p>
              
              <div className="growth-stage-container">
                <div className={`mushroom-growth ${growthStage >= 1 ? 'growing' : ''} ${growthStage === 2 ? 'mature' : ''}`}>
                  <div className="cap-dots">
                    <div className="dot"></div>
                    <div className="dot"></div>
                    <div className="dot"></div>
                    <div className="dot"></div>
                  </div>
                  <div className="mushroom-cap"></div>
                  <div className="mushroom-ring"></div>
                  <div className="mushroom-stem"></div>
                  <div className="ground-soil"></div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
                <button 
                  className="interact-btn no-flip"
                  onClick={(e) => { e.stopPropagation(); handleGrowth(e); }}
                  disabled={isGrowing}
                  style={{ opacity: isGrowing ? 0.5 : 1, position: 'relative', zIndex: 100 }}
                >
                  🌱 Nutrir Micelio
                </button>
                {growthStage === 2 && (
                  <button 
                    className="interact-btn reset no-flip"
                    onClick={(e) => { e.stopPropagation(); resetGrowth(e); }}
                    style={{ position: 'relative', zIndex: 100 }}
                  >
                    🔄 Resetear
                  </button>
                )}
              </div>

              <div className="curiosidad-box">
                <h4 style={{ color: 'var(--accent-color)', marginBottom: '5px' }}>¿Sabías que?</h4>
                <p style={{ fontSize: '0.9rem', margin: 0 }}>
                  El micelio puede extenderse kilómetros bajo tierra. El hongo que vemos es solo el "fruto" que aparece para soltar semillas.
                </p>
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
                <div className="connector" style={{ top: '22%', left: '35%', width: '40px', transform: 'rotate(-20deg)' }}></div>
                <span className="diagram-label" onClick={(e) => { e.stopPropagation(); setSelectedPart("Píleo"); }} style={{ top: '18%', left: '15%' }}>Píleo (Sombrero)</span>
                
                <div className="connector" style={{ top: '18%', left: '55%', width: '40px', transform: 'rotate(20deg)' }}></div>
                <span className="diagram-label" onClick={(e) => { e.stopPropagation(); setSelectedPart("Escamas"); }} style={{ top: '14%', left: '65%' }}>Escamas</span>
                
                <div className="connector" style={{ top: '38%', left: '55%', width: '60px', transform: 'rotate(10deg)' }}></div>
                <span className="diagram-label" onClick={(e) => { e.stopPropagation(); setSelectedPart("Láminas"); }} style={{ top: '38%', left: '72%' }}>Láminas</span>
                
                <div className="connector" style={{ top: '48%', left: '35%', width: '50px', transform: 'rotate(-10deg)' }}></div>
                <span className="diagram-label" onClick={(e) => { e.stopPropagation(); setSelectedPart("Anillo"); }} style={{ top: '48%', left: '12%' }}>Anillo</span>
                
                <div className="connector" style={{ top: '65%', left: '55%', width: '50px', transform: 'rotate(5deg)' }}></div>
                <span className="diagram-label" onClick={(e) => { e.stopPropagation(); setSelectedPart("Estípite"); }} style={{ top: '65%', left: '72%' }}>Estípite (Pie)</span>
                
                <div className="connector" style={{ top: '82%', left: '35%', width: '50px', transform: 'rotate(-15deg)' }}></div>
                <span className="diagram-label" onClick={(e) => { e.stopPropagation(); setSelectedPart("Volva"); }} style={{ top: '80%', left: '12%' }}>Volva</span>
                
                <div className="connector" style={{ top: '92%', left: '50%', width: '2px', height: '20px', transform: 'translateY(-100%)' }}></div>
                <span className="diagram-label" onClick={(e) => { e.stopPropagation(); setSelectedPart("Micelio"); }} style={{ top: '92%', left: '50%', transform: 'translateX(-50%)' }}>Micelio</span>
              </div>
              <p style={{ textAlign: 'center', fontSize: '0.9rem', color: '#888', fontStyle: 'italic' }}>
                * Haz clic en las etiquetas para ver detalles al reverso
              </p>
            </div>
          </div>
          {/* Lado Posterior: Explicación Dinámica de las Funciones */}
          <div className="page-side back">
            <h2>Partes de los hongos</h2>
            <div className="content-area">
              <div className="info-display">
                {selectedPart ? (
                  <>
                    <h3>{anatomyInfo[selectedPart].title}</h3>
                    <p>{anatomyInfo[selectedPart].desc}</p>
                    <button 
                      onClick={(e) => { e.stopPropagation(); setSelectedPart(null); }}
                      style={{ 
                        marginTop: '20px', 
                        padding: '5px 15px', 
                        background: 'none', 
                        border: '1px solid var(--accent-color)',
                        color: 'var(--accent-color)',
                        borderRadius: '4px',
                        cursor: 'pointer'
                      }}
                    >
                      Volver a la lista
                    </button>
                  </>
                ) : (
                  <div className="empty-info">
                    <p>Selecciona una parte en el diagrama para investigar su función.</p>
                  </div>
                )}
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

      {/* Controles de Navegación Inferiores - Regresados a su lugar original pero optimizados */}
      <div className="nav-controls">
        <button className="nav-btn" onClick={prevStep}>Anterior</button>
        <button className="nav-btn" onClick={nextStep}>Siguiente</button>
      </div>
    </div>
  );
}
