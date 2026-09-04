import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { RotateCcw, Eye, Sparkles, Box, Info, Play, CheckCircle2, RefreshCw, Layers } from 'lucide-react';

interface Shape3D {
  id: string;
  name: string;
  emoji: string;
  vertices: number;
  edges: number;
  faces: number;
  faceShape: string;
  description: string;
  funFact: string;
}

const SHAPES: Shape3D[] = [
  {
    id: 'cube',
    name: 'Küp',
    emoji: '🎲',
    vertices: 8,
    edges: 12,
    faces: 6,
    faceShape: '6 adet eş Kare',
    description: 'Bütün yüzeyleri birbirine eşit karelerden oluşan özel prizmadır.',
    funFact: 'Tüm yüzeyleri, ayrıtları ve açıları tamamen birbirine eşittir!'
  },
  {
    id: 'rect_prism',
    name: 'Dikdörtgenler Prizması',
    emoji: '📦',
    vertices: 8,
    edges: 12,
    faces: 6,
    faceShape: '6 adet Dikdörtgen',
    description: 'Tüm yüzeyleri dikdörtgenlerden oluşan kapalı 3 boyutlu cisimdir.',
    funFact: 'İlaç kutuları, kibrit kutuları ve tuğlalar bu şekildedir.'
  },
  {
    id: 'sq_prism',
    name: 'Kare Prizma',
    emoji: '🏢',
    vertices: 8,
    edges: 12,
    faces: 6,
    faceShape: '2 Kare Taban + 4 Dikdörtgen Yan Yüz',
    description: 'Alt ve üst tabanları eş karelerden, yan yüzeyleri ise dikdörtgenlerden oluşan prizmadır.',
    funFact: 'Süt kutuları, hediye kutuları ve kule binalar kare prizma biçimindedir.'
  },
  {
    id: 'tri_prism',
    name: 'Üçgen Prizma',
    emoji: '⛺',
    vertices: 6,
    edges: 9,
    faces: 5,
    faceShape: '2 Üçgen Taban + 3 Dikdörtgen Yüz',
    description: 'Alt ve üst tabanı eş üçgenler, yan yüzleri dikdörtgendir.',
    funFact: 'Kamp çadırları ve çikolata kutuları çoğunlukla üçgen prizmadır.'
  },
  {
    id: 'cylinder',
    name: 'Silindir',
    emoji: '🛢️',
    vertices: 0,
    edges: 2,
    faces: 3,
    faceShape: '2 Daire Taban + 1 Eğri Yüzey',
    description: 'Alt ve üst tabanı birbirine eş dairelerden oluşan eğri yüzeyli cisimdir.',
    funFact: 'Boru, konserve kutusu ve davul birer silindirdir. Sivri köşesi yoktur!'
  },
  {
    id: 'sphere',
    name: 'Küre',
    emoji: '⚽',
    vertices: 0,
    edges: 0,
    faces: 1,
    faceShape: '1 Kesintisiz Eğri Yüzey',
    description: 'Uzayda sabit bir noktaya eşit uzaklıktaki tüm noktaların oluşturduğu yuvarlak cisimdir.',
    funFact: 'Dünyamız, gezegenler ve futbol topları küreye örnektir. Köşesi ve düz ayrıtı yoktur!'
  }
];

export const Geometry3DLab: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [selectedShape, setSelectedShape] = useState<Shape3D>(SHAPES[0]);
  const [wireframe, setWireframe] = useState(false);
  const [autoRotate, setAutoRotate] = useState(true);
  const [highlightMode, setHighlightMode] = useState<'none' | 'vertices' | 'edges' | 'faces'>('none');
  const [activeQuizQuestion, setActiveQuizQuestion] = useState<{
    q: string;
    options: number[];
    answer: number;
    explanation: string;
  } | null>(null);
  const [quizSelected, setQuizSelected] = useState<number | null>(null);
  const [quizFeedback, setQuizFeedback] = useState<boolean | null>(null);

  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const shapeGroupRef = useRef<THREE.Group | null>(null);
  const isDraggingRef = useRef(false);
  const previousMousePositionRef = useRef({ x: 0, y: 0 });

  // Quiz generator for the active shape
  const generateQuiz = (shape: Shape3D) => {
    setQuizSelected(null);
    setQuizFeedback(null);
    const types = ['vertices', 'edges', 'faces'];
    const selectedType = types[Math.floor(Math.random() * types.length)];

    let correct = 0;
    let text = '';
    if (selectedType === 'vertices') {
      correct = shape.vertices;
      text = `${shape.name} cisminin toplam kaç adet KÖŞESİ vardır?`;
    } else if (selectedType === 'edges') {
      correct = shape.edges;
      text = `${shape.name} cisminin toplam kaç adet AYRITI (kenarı) vardır?`;
    } else {
      correct = shape.faces;
      text = `${shape.name} cisminin toplam kaç adet YÜZEYİ vardır?`;
    }

    // Generate options
    const optsSet = new Set<number>([correct]);
    while (optsSet.size < 4) {
      const fake = Math.max(0, correct + Math.floor(Math.random() * 7) - 3);
      optsSet.add(fake);
    }
    const options = Array.from(optsSet).sort((a, b) => a - b);

    setActiveQuizQuestion({
      q: text,
      options,
      answer: correct,
      explanation: `${shape.name}: ${shape.vertices} Köşe, ${shape.edges} Ayrıt, ${shape.faces} Yüzey`
    });
  };

  useEffect(() => {
    generateQuiz(selectedShape);
  }, [selectedShape]);

  // Three.js scene setup and rendering
  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    let renderer: THREE.WebGLRenderer | null = null;
    let animationFrameId: number | null = null;
    let isDisposed = false;

    try {
      const width = container.clientWidth || 400;
      const height = container.clientHeight || 300;

      // Scene
      const scene = new THREE.Scene();
      sceneRef.current = scene;

      // Camera
      const camera = new THREE.PerspectiveCamera(45, Math.max(0.1, width / Math.max(1, height)), 0.1, 1000);
      camera.position.set(0, 0, 7.5);

      // Renderer
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'default' });
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      rendererRef.current = renderer;

      container.innerHTML = '';
      container.appendChild(renderer.domElement);

      // Ambient & Directional Lights
      const ambientLight = new THREE.AmbientLight(0xffffff, 0.85);
      scene.add(ambientLight);

      const dirLight1 = new THREE.DirectionalLight(0xfff5ea, 1.2);
      dirLight1.position.set(5, 10, 7);
      scene.add(dirLight1);

      const dirLight2 = new THREE.DirectionalLight(0x90e0ef, 0.8);
      dirLight2.position.set(-5, -5, -5);
      scene.add(dirLight2);

      // Main Group holding current geometry
      const group = new THREE.Group();
      scene.add(group);
      shapeGroupRef.current = group;

      // Create 3D Mesh
      create3DShapeMesh(selectedShape.id, group, wireframe, highlightMode);

      // Animation Loop
      const animate = () => {
        if (isDisposed || !renderer) return;
        animationFrameId = requestAnimationFrame(animate);

        try {
          if (autoRotate && shapeGroupRef.current && !isDraggingRef.current) {
            shapeGroupRef.current.rotation.y += 0.008;
            shapeGroupRef.current.rotation.x += 0.003;
          }

          renderer.render(scene, camera);
        } catch {
          // Ignore render loop errors
        }
      };
      animate();

      // Resize Handler
      const handleResize = () => {
        if (!container || !rendererRef.current || isDisposed) return;
        try {
          const w = container.clientWidth || 400;
          const h = container.clientHeight || 300;
          if (h > 0) {
            camera.aspect = w / h;
            camera.updateProjectionMatrix();
            rendererRef.current.setSize(w, h);
          }
        } catch {
          // Ignore resize errors
        }
      };
      window.addEventListener('resize', handleResize);

      return () => {
        isDisposed = true;
        window.removeEventListener('resize', handleResize);
        if (animationFrameId) cancelAnimationFrame(animationFrameId);
        if (renderer) {
          try {
            renderer.dispose();
          } catch {}
        }
      };
    } catch (err) {
      console.warn('Three.js setup error:', err);
      return () => {
        isDisposed = true;
        if (animationFrameId) cancelAnimationFrame(animationFrameId);
        if (renderer) {
          try {
            renderer.dispose();
          } catch {}
        }
      };
    }
  }, [selectedShape, wireframe, highlightMode]);

  // Handle Rotation Speed on Drag or Touch
  const handlePointerDown = (e: React.PointerEvent) => {
    isDraggingRef.current = true;
    previousMousePositionRef.current = { x: e.clientX, y: e.clientY };
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDraggingRef.current || !shapeGroupRef.current) return;

    const deltaX = e.clientX - previousMousePositionRef.current.x;
    const deltaY = e.clientY - previousMousePositionRef.current.y;

    shapeGroupRef.current.rotation.y += deltaX * 0.01;
    shapeGroupRef.current.rotation.x += deltaY * 0.01;

    previousMousePositionRef.current = { x: e.clientX, y: e.clientY };
  };

  const handlePointerUp = () => {
    isDraggingRef.current = false;
  };

  return (
    <div className="fixed inset-0 top-[52px] xs:top-[60px] sm:top-[74px] md:top-[80px] bg-slate-950/90 backdrop-blur-md z-50 flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
      <div className="bg-gradient-to-b from-slate-900 via-slate-900 to-indigo-950 border-3 border-amber-400/80 rounded-3xl max-w-4xl w-full p-2.5 sm:p-4 shadow-[0_20px_50px_rgba(0,0,0,0.8)] text-white flex flex-col max-h-[calc(100vh-90px)] sm:max-h-[calc(100vh-100px)] overflow-hidden relative">
        
        {/* HEADER BAR */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-2.5 mb-2.5 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-xl shadow-md border border-white/40">
              🧊
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-xl font-black text-amber-300 tracking-wide">
                  3D Geometri Keşif Labı
                </h2>
                <img 
                  src="/icon_2.png" 
                  alt="2. Sınıf" 
                  className="h-6 sm:h-7 w-auto object-contain shrink-0 filter drop-shadow-sm" 
                />
              </div>
              <p className="text-xs text-slate-400 font-medium">
                Geometrik cisimleri seçin, dokunarak döndürün, yüzey-ayrıt-köşelerini keşfedin!
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="group relative px-3 py-1.5 rounded-xl bg-gradient-to-r from-red-600 to-rose-700 hover:from-red-500 hover:to-rose-600 text-white font-black text-xs transition-all transform hover:scale-105 active:scale-95 cursor-pointer border border-white/30 shadow-md flex items-center gap-1"
            title="Kapat"
          >
            <span>✕</span>
            <span>Kapat</span>
          </button>
        </div>

        {/* COMPACT CATEGORY HEADER BADGE (MATCHING OTHER GRADES) */}
        <div className="flex flex-col items-center justify-center mb-2 max-w-4xl w-full mx-auto shrink-0 py-0.5">
          <div className="z-10 flex items-center justify-center gap-2.5 sm:gap-3 bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 text-blue-950 px-4 sm:px-7 py-1.5 sm:py-2 rounded-xl sm:rounded-2xl border-2 sm:border-2.5 border-white shadow-[0_3px_10px_rgba(0,0,0,0.5)] font-black text-xs sm:text-sm md:text-base uppercase tracking-wider max-w-full shrink-0">
            <div className="relative shrink-0 flex items-center justify-center">
              <img src="/MENUIKON/grid_icon_10.png" alt="3D Geometri Labı" className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 object-contain filter drop-shadow-[0_3px_6px_rgba(0,0,0,0.4)]" />
            </div>
            <span className="drop-shadow-xs break-words">6. 3D Geometri Keşif Labı</span>
            <img src="/icon_2.png" alt="2. Sınıf" className="h-6 sm:h-7 md:h-8 w-auto object-contain shrink-0 filter drop-shadow-xs ml-1" />
          </div>
        </div>

        {/* SHAPE SELECTOR DROPDOWN BANNER */}
        <div className="mb-2.5 sm:mb-3 bg-gradient-to-r from-amber-500/25 via-orange-500/20 to-amber-500/25 border-2 border-amber-400/70 rounded-2xl p-2 sm:p-2.5 flex flex-wrap items-center justify-between gap-2 shrink-0 shadow-md">
          <div className="flex items-center gap-1.5 sm:gap-2">
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center font-black text-xs sm:text-sm shadow-sm shrink-0">
              🔽
            </div>
            <div>
              <span className="text-xs sm:text-sm font-black text-amber-200 block leading-none">
                3D Geometrik Cisim Seç:
              </span>
              <span className="text-[10px] text-amber-100/70 font-medium hidden sm:inline">
                Açılır menüden istediğin cismi kolayca seçebilirsin
              </span>
            </div>
          </div>

          <div className="relative w-full sm:w-auto sm:flex-1 sm:max-w-xs">
            <select
              value={selectedShape.id}
              onChange={(e) => {
                const found = SHAPES.find(s => s.id === e.target.value);
                if (found) setSelectedShape(found);
              }}
              className="w-full bg-slate-900 text-amber-300 font-extrabold text-[11px] sm:text-xs md:text-sm px-2.5 py-1.5 sm:px-3 sm:py-2 rounded-xl border-2 border-amber-400 shadow-lg cursor-pointer focus:outline-none focus:ring-2 focus:ring-amber-300 appearance-none pr-7 transition-all hover:bg-slate-850"
            >
              {SHAPES.map(shape => (
                <option key={shape.id} value={shape.id} className="bg-slate-900 text-amber-200 text-xs sm:text-sm py-1 font-semibold">
                  {shape.emoji} {shape.name} ({shape.faces} Yüz, {shape.edges} Ayrıt, {shape.vertices} Köşe)
                </option>
              ))}
            </select>
            <div className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-amber-300 text-[10px] sm:text-xs font-black">
              ▼
            </div>
          </div>
        </div>

        {/* MAIN LAB CONTENT AREA */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 flex-1 min-h-0 overflow-y-auto no-scrollbar">
          
          {/* 3D CANVAS & VIEWER (CENTER - 7/8 COLS) */}
          <div className="md:col-span-7 lg:col-span-8 flex flex-col bg-slate-950/80 rounded-2xl border border-slate-800 p-2 relative overflow-hidden min-h-[300px] sm:min-h-[360px]">
            
            {/* CANVAS INTERACTION AREA */}
            <div
              ref={mountRef}
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              onPointerLeave={handlePointerUp}
              className="w-full h-full flex-1 cursor-grab active:cursor-grabbing touch-none relative select-none"
            />

            {/* FLOATING CONTROLS OVERLAY */}
            <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
              <div className="bg-slate-900/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-amber-400/80 text-xs sm:text-sm font-black text-amber-300 flex items-center gap-2 shadow-md">
                <span className="text-base sm:text-lg">{selectedShape.emoji}</span>
                <span>{selectedShape.name}</span>
              </div>

              <div className="flex items-center gap-1.5 pointer-events-auto">
                <button
                  onClick={() => setAutoRotate(!autoRotate)}
                  className={`px-2.5 py-1 rounded-xl text-xs font-extrabold border transition-all cursor-pointer flex items-center gap-1 ${
                    autoRotate
                      ? 'bg-amber-500 text-slate-950 border-amber-300'
                      : 'bg-slate-800 text-slate-300 border-slate-700'
                  }`}
                  title="Otomatik Döndürme"
                >
                  <RefreshCw size={12} className={autoRotate ? 'animate-spin' : ''} />
                  <span>Döndür</span>
                </button>

                <button
                  onClick={() => setWireframe(!wireframe)}
                  className={`px-2.5 py-1 rounded-xl text-xs font-extrabold border transition-all cursor-pointer flex items-center gap-1 ${
                    wireframe
                      ? 'bg-cyan-500 text-slate-950 border-cyan-300'
                      : 'bg-slate-800 text-slate-300 border-slate-700'
                  }`}
                  title="İskelet Görünümü (Wireframe)"
                >
                  <Layers size={12} />
                  <span>İskelet</span>
                </button>
              </div>
            </div>

            {/* DRAG INSTRUCTION WATERMARK */}
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-[10px] text-amber-200/90 font-medium border border-white/10 pointer-events-none flex items-center gap-1">
              <span>👈 Parmağınla veya fareyle çevir 👉</span>
            </div>
          </div>

          {/* PROPERTIES & QUIZ PANEL (RIGHT - 5/4 COLS) */}
          <div className="md:col-span-5 lg:col-span-4 flex flex-col gap-3 shrink-0">
            
            {/* STATS & HIGHLIGHT CARD */}
            <div className="bg-slate-800/90 rounded-2xl p-3 border border-slate-700 space-y-2.5">
              <h3 className="text-xs font-black uppercase text-amber-400 tracking-wider flex items-center gap-1">
                <Info size={14} /> Şeklin Özellikleri
              </h3>

              <div className="grid grid-cols-3 gap-1.5 text-center">
                <button
                  onClick={() => setHighlightMode(highlightMode === 'faces' ? 'none' : 'faces')}
                  className={`p-2 rounded-xl border transition-all cursor-pointer ${
                    highlightMode === 'faces'
                      ? 'bg-amber-400 text-slate-950 border-white font-black'
                      : 'bg-slate-900 border-slate-700 text-slate-200'
                  }`}
                >
                  <div className="text-xs font-black">{selectedShape.faces}</div>
                  <div className="text-[10px] opacity-80 uppercase font-bold">Yüzey</div>
                </button>

                <button
                  onClick={() => setHighlightMode(highlightMode === 'edges' ? 'none' : 'edges')}
                  className={`p-2 rounded-xl border transition-all cursor-pointer ${
                    highlightMode === 'edges'
                      ? 'bg-cyan-400 text-slate-950 border-white font-black'
                      : 'bg-slate-900 border-slate-700 text-slate-200'
                  }`}
                >
                  <div className="text-xs font-black">{selectedShape.edges}</div>
                  <div className="text-[10px] opacity-80 uppercase font-bold">Ayrıt</div>
                </button>

                <button
                  onClick={() => setHighlightMode(highlightMode === 'vertices' ? 'none' : 'vertices')}
                  className={`p-2 rounded-xl border transition-all cursor-pointer ${
                    highlightMode === 'vertices'
                      ? 'bg-pink-400 text-slate-950 border-white font-black'
                      : 'bg-slate-900 border-slate-700 text-slate-200'
                  }`}
                >
                  <div className="text-xs font-black">{selectedShape.vertices}</div>
                  <div className="text-[10px] opacity-80 uppercase font-bold">Köşe</div>
                </button>
              </div>

              <div className="bg-slate-900/90 p-2.5 rounded-xl border border-slate-800 text-xs space-y-1">
                <div className="font-extrabold text-amber-300">Yüzey Biçimi:</div>
                <div className="text-slate-300">{selectedShape.faceShape}</div>
                <div className="text-[11px] text-slate-400 italic mt-1 leading-tight">
                  "{selectedShape.funFact}"
                </div>
              </div>
            </div>

            {/* MINI QUIZ CARD */}
            <div className="bg-gradient-to-b from-indigo-900/80 to-slate-900 rounded-2xl p-3 border border-indigo-700/60 flex-1 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between text-xs font-black text-indigo-300 mb-1.5">
                  <span className="flex items-center gap-1">
                    <Sparkles size={14} className="text-yellow-400" />
                    Hızlı Test
                  </span>
                  <button
                    onClick={() => generateQuiz(selectedShape)}
                    className="text-[10px] text-indigo-300 hover:text-white underline cursor-pointer"
                  >
                    Yeni Soru
                  </button>
                </div>

                {activeQuizQuestion && (
                  <div className="space-y-2">
                    <p className="text-xs font-bold text-slate-200 leading-snug">
                      {activeQuizQuestion.q}
                    </p>

                    <div className="grid grid-cols-2 gap-1.5">
                      {activeQuizQuestion.options.map(opt => {
                        let btnStyle = 'bg-slate-800 hover:bg-slate-700 text-white border-slate-700';
                        if (quizSelected === opt) {
                          if (opt === activeQuizQuestion.answer) {
                            btnStyle = 'bg-emerald-500 text-white border-emerald-300 font-black';
                          } else {
                            btnStyle = 'bg-rose-600 text-white border-rose-400 font-black';
                          }
                        } else if (quizSelected !== null && opt === activeQuizQuestion.answer) {
                          btnStyle = 'bg-emerald-600/60 text-white border-emerald-500';
                        }

                        return (
                          <button
                            key={opt}
                            disabled={quizSelected !== null}
                            onClick={() => {
                              setQuizSelected(opt);
                              setQuizFeedback(opt === activeQuizQuestion.answer);
                            }}
                            className={`py-1.5 px-2 rounded-xl border text-xs font-extrabold transition-all cursor-pointer ${btnStyle}`}
                          >
                            {opt}
                          </button>
                        );
                      })}
                    </div>

                    {quizFeedback !== null && (
                      <div className={`p-2 rounded-xl text-[11px] font-black text-center mt-1 border ${
                        quizFeedback
                          ? 'bg-emerald-950/80 border-emerald-500 text-emerald-200'
                          : 'bg-rose-950/80 border-rose-500 text-rose-200'
                      }`}>
                        {quizFeedback ? '🎉 Tebrikler! Doğru cevap!' : `❌ Yanlış. Doğru cevap: ${activeQuizQuestion.answer}`}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};

// Helper function to build geometries and materials for Three.js
function create3DShapeMesh(
  id: string,
  group: THREE.Group,
  isWireframe: boolean,
  highlightMode: 'none' | 'vertices' | 'edges' | 'faces'
) {
  // Clear group
  while (group.children.length > 0) {
    const obj = group.children[0];
    group.remove(obj);
  }

  let geometry: THREE.BufferGeometry;

  switch (id) {
    case 'cube':
      geometry = new THREE.BoxGeometry(2, 2, 2);
      break;
    case 'rect_prism':
      geometry = new THREE.BoxGeometry(2.6, 1.4, 1.8);
      break;
    case 'sq_prism':
      geometry = new THREE.BoxGeometry(1.8, 2.8, 1.8);
      break;
    case 'tri_prism':
      geometry = new THREE.CylinderGeometry(1.6, 1.6, 2.2, 3); // 3 sides triangular base
      break;
    case 'cylinder':
      geometry = new THREE.CylinderGeometry(1.4, 1.4, 2.4, 32);
      break;
    case 'sphere':
      geometry = new THREE.SphereGeometry(1.6, 32, 32);
      break;
    default:
      geometry = new THREE.BoxGeometry(2, 2, 2);
  }

  // Material setup
  const faceColor = highlightMode === 'faces' ? 0xfbbf24 : 0x38bdf8;
  const mainMaterial = new THREE.MeshStandardMaterial({
    color: faceColor,
    wireframe: isWireframe,
    roughness: 0.3,
    metalness: 0.2,
    transparent: true,
    opacity: isWireframe ? 0.9 : 0.88,
    side: THREE.DoubleSide
  });

  const mainMesh = new THREE.Mesh(geometry, mainMaterial);
  group.add(mainMesh);

  // Edges / Wireframe Outline
  const edgeColor = highlightMode === 'edges' ? 0x22d3ee : 0xffffff;
  const edgesGeometry = new THREE.EdgesGeometry(geometry);
  const lineMaterial = new THREE.LineBasicMaterial({
    color: edgeColor,
    linewidth: highlightMode === 'edges' ? 3 : 1.5
  });
  const lineSegments = new THREE.LineSegments(edgesGeometry, lineMaterial);
  group.add(lineSegments);

  // Vertices points (Red dots on corners)
  const hasVertices = ['cube', 'rect_prism', 'sq_prism', 'tri_prism'].includes(id);

  if (highlightMode === 'vertices' || hasVertices) {
    const posAttribute = geometry.getAttribute('position');
    const verticesMap = new Set<string>();
    const isVertexHighlighted = highlightMode === 'vertices';
    const sphereRadius = isVertexHighlighted ? 0.15 : 0.11;
    const sphereGeo = new THREE.SphereGeometry(sphereRadius, 16, 16);
    const sphereMat = new THREE.MeshStandardMaterial({
      color: 0xf43f5e,
      emissive: 0xe11d48,
      roughness: 0.2
    });

    for (let i = 0; i < posAttribute.count; i++) {
      const x = posAttribute.getX(i);
      const y = posAttribute.getY(i);
      const z = posAttribute.getZ(i);
      const key = `${x.toFixed(2)},${y.toFixed(2)},${z.toFixed(2)}`;

      if (!verticesMap.has(key)) {
        verticesMap.add(key);
        const vertexMesh = new THREE.Mesh(sphereGeo, sphereMat);
        vertexMesh.position.set(x, y, z);
        group.add(vertexMesh);
      }
    }
  }
}
