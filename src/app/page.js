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
    { id: 1, flipped: false, zIndex: 6 }, // Portada e Introducción
    { id: 2, flipped: false, zIndex: 5 }, // Importancia y Reproducción
    { id: 3, flipped: false, zIndex: 4 }, // Ciclo de Vida y Anatomía
    { id: 4, flipped: false, zIndex: 3 }, // Partes y Rarezas
    { id: 5, flipped: false, zIndex: 2 }, // Amanita Muscaria y Fin
  ]);

  // Estado para la interactividad de anatomía
  const [selectedPart, setSelectedPart] = useState(null);
  
  // Estado para el efecto 3D (Tilt)
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  // Estado para el crecimiento del hongo
  const [isGrowing, setIsGrowing] = useState(false);
  const [growthStage, setGrowthStage] = useState(0); // 0: nada, 1: brotando, 2: maduro

  // Estado para el Simulador de Simbiosis
  const [isSymbiosisConnected, setIsSymbiosisConnected] = useState(false);

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
            <h2 style={{ fontSize: '1.8rem' }}>Amanita Muscaria</h2>
            <div className="content-area" style={{ minHeight: 0 }}>
              <div style={{ position: 'relative', width: '100%', height: '160px', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 4px 10px rgba(0,0,0,0.2)', flexShrink: 0 }}>
                <Image 
                  src="/amanita_clean.png" 
                  alt="Amanita Muscaria" 
                  fill
                  style={{ objectFit: 'contain' }}
                />
              </div>
              <div className="placeholder-text no-flip" style={{ background: 'rgba(165, 42, 42, 0.05)', border: '1px solid rgba(165, 42, 42, 0.1)', flex: 1, display: 'flex', flexDirection: 'column', gap: '8px', overflowY: 'auto', paddingBottom: '20px', paddingRight: '5px', minHeight: 0 }}>
                <p>La <strong>Amanita Muscaria</strong> es el hongo más icónico del mundo.</p>
                <p style={{ fontSize: '0.9rem', color: '#666' }}>Su color rojo brillante con puntos blancos sirve como advertencia en la naturaleza.</p>
                
                <div style={{ marginTop: 'auto', padding: '10px', background: 'rgba(255, 255, 255, 0.7)', borderRadius: '6px', borderLeft: '3px solid #ff4d4d' }}>
                  <h4 style={{ color: '#a52a2a', margin: '0 0 5px 0', fontSize: '0.9rem' }}>🍄 ¿El Hongo de Mario Bros?</h4>
                  <p style={{ margin: 0, fontSize: '0.85rem', color: '#555', lineHeight: '1.4' }}>¡Exacto! Es el mismo hongo que hace crecer a Mario y la casita típica de los Pitufos. Básicamente es la súper estrella de los hongos.</p>
                </div>
                
                <div style={{ padding: '10px', background: 'rgba(255, 255, 255, 0.7)', borderRadius: '6px', borderLeft: '3px solid #ff4d4d' }}>
                  <h4 style={{ color: '#a52a2a', margin: '0 0 5px 0', fontSize: '0.9rem' }}>❄️ ¿Qué son los puntitos blancos?</h4>
                  <p style={{ margin: 0, fontSize: '0.85rem', color: '#555', lineHeight: '1.4' }}>Cuando nacen parecen un huevito blanco. Al crecer, esa "cáscara" se rompe y los pedacitos se quedan pegados al sombrero rojo. ¡Como si tuviera pecas!</p>
                </div>
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
            PÁGINA 4: Detalles de Anatomía & Rarezas
            ========================================== */}
        <div 
          className={`page ${pages[3].flipped ? 'flipped' : ''}`} 
          style={{ zIndex: pages[3].zIndex }}
        >
          {/* Lado Frontal: Explicación Dinámica de las Funciones */}
          <div className="page-side">
            <h2>Partes de los hongos</h2>
            <div className="content-area">
              <div className="info-display">
                {selectedPart ? (
                  <>
                    <h3>{anatomyInfo[selectedPart].title}</h3>
                    <p>{anatomyInfo[selectedPart].desc}</p>
                    <button 
                      onClick={(e) => { e.stopPropagation(); setSelectedPart(null); }}
                      className="no-flip"
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
                    <p>Selecciona una parte en el diagrama anterior para investigar su función.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
          {/* Lado Posterior: Galería de Rarezas */}
          <div className="page-side back">
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
        </div>

        {/* ==========================================
            PÁGINA 3: Ciclo de Vida & Anatomía
            ========================================== */}
        <div 
          className={`page ${pages[2].flipped ? 'flipped' : ''}`} 
          style={{ zIndex: pages[2].zIndex }}
        >
          {/* Lado Frontal: Ciclo de Vida Interactivo */}
          <div className="page-side">
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

              <div className="curiosidad-box" style={{ marginTop: '20px' }}>
                <h4 style={{ color: 'var(--accent-color)', marginBottom: '5px' }}>¿Sabías que?</h4>
                <p style={{ fontSize: '0.9rem', margin: 0 }}>
                  El micelio puede extenderse kilómetros bajo tierra. El hongo que vemos es solo el "sombrero" que aparece para soltar semillas.
                </p>
              </div>
            </div>
          </div>
          {/* Lado Posterior: Diagrama de Anatomía */}
          <div className="page-side back">
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
                * Haz clic en las etiquetas para ver detalles en la siguiente página
              </p>
            </div>
          </div>
        </div>

        {/* ==========================================
            PÁGINA 2: Simbiosis (Amanita) & Espacio de Texto
            ========================================== */}
        <div 
          className={`page ${pages[1].flipped ? 'flipped' : ''}`} 
          style={{ zIndex: pages[1].zIndex }}
        >
          {/* Lado Frontal: Simulador de Simbiosis */}
          <div className="page-side">
            <h2>El Internet del Bosque 🌳🍄</h2>
            <div className="content-area">
              <p style={{ fontSize: '0.9rem', color: '#666', fontStyle: 'italic', textAlign: 'center' }}>
                ¡Toca el botón para enchufar el hongo al árbol y ver cómo se pasan la comida!
              </p>
              
              <div className={`symbiosis-container ${isSymbiosisConnected ? 'connected' : ''}`}>
                <div className="underground-scene">
                  
                  {/* Árbol (Pino/Abedul) */}
                  <div className="tree-roots-zone">
                    <div className="zone-label">[ÁRBOL]</div>
                    <div className="root-main"></div>
                    <div className="root-branch r1"></div>
                    <div className="root-branch r2"></div>
                    
                    {/* Partículas de Azúcar (bajan) */}
                    {isSymbiosisConnected && (
                      <>
                        <div className="particle sugar p1"></div>
                        <div className="particle sugar p2"></div>
                        <div className="particle sugar p3"></div>
                      </>
                    )}
                  </div>

                  {/* Micelio (Amanita) */}
                  <div className="fungus-mycelium-zone">
                    <div className="zone-label">[AMANITA]</div>
                    <div className="mycelium-main"></div>
                    <div className="mycelium-branch m1"></div>
                    <div className="mycelium-branch m2"></div>
                    
                    {/* Partículas de Agua/Minerales (suben) */}
                    {isSymbiosisConnected && (
                      <>
                        <div className="particle water w1"></div>
                        <div className="particle water w2"></div>
                        <div className="particle water w3"></div>
                      </>
                    )}
                  </div>
                  
                  {/* Zona de conexión central */}
                  <div className="connection-core">
                    {isSymbiosisConnected && <div className="glow-pulse"></div>}
                  </div>

                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'center', marginTop: '15px' }}>
                <button 
                  className={`interact-btn no-flip ${isSymbiosisConnected ? 'active' : ''}`}
                  onPointerDown={(e) => { e.stopPropagation(); setIsSymbiosisConnected(!isSymbiosisConnected); }}
                  onClick={(e) => { e.stopPropagation(); setIsSymbiosisConnected(!isSymbiosisConnected); }}
                  style={{ position: 'relative', zIndex: 9999, transform: 'translateZ(50px)' }}
                >
                  {isSymbiosisConnected ? '⚡ Desconectar Red' : '🌱 Conectar Micelio'}
                </button>
              </div>

              {isSymbiosisConnected && (
                <div className="curiosidad-box" style={{ marginTop: '10px' }}>
                  <h4 style={{ color: 'var(--accent-color)', marginBottom: '5px' }}>¡Conexión Establecida! ⚡</h4>
                  <p style={{ fontSize: '0.85rem', margin: 0 }}>
                    ¡Es un trabajo en equipo! El árbol hace fotosíntesis y le regala <strong>azúcares</strong> al hongo (¡su postre favorito!). A cambio, el hongo actúa como una esponja gigante y le pasa <strong>agua y minerales</strong> al árbol. ¡Mejores amigos por siempre!
                  </p>
                </div>
              )}
            </div>
          </div>
          {/* Lado Posterior: Espacio Libre para Textos */}
          <div className="page-side back">
            <h2>Datos Random 🍄✨</h2>
            <div className="content-area">
              <div style={{ padding: '15px', background: 'rgba(0,0,0,0.03)', borderRadius: '8px', border: '1px solid #ccc', height: '100%' }}>
                <h3 style={{ color: '#555', marginBottom: '10px' }}>¿Dónde se esconde? 🌲</h3>
                <p style={{ color: '#777', lineHeight: '1.6', fontSize: '0.9rem' }}>
                  A la <strong>Amanita</strong> le encanta el frío y vivir de arrimada con los árboles (especialmente pinos). ¡Hacen equipo bajo la tierra donde nadie los ve! Si ves un bosque de pinos en un lugar frío, seguro hay una cerca.
                </p>
                <br/>
                <h3 style={{ color: '#555', marginBottom: '10px' }}>¡Mira pero no toques! 🚫</h3>
                <p style={{ color: '#777', lineHeight: '1.6', fontSize: '0.9rem' }}>
                  Sí, es el hongo de Mario Bros, pero en la vida real <strong>¡es súper tóxico!</strong> Te puede dar un dolor de barriga terrible o alucinar feo. Así que, si te encuentras uno, ¡tómale una foto pero ni se te ocurra morderlo!
                </p>
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
