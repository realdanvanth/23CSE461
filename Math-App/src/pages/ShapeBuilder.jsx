import { useState, useRef, useCallback, useEffect } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { motion, AnimatePresence } from 'framer-motion';
import { useProgress } from '../context/ProgressContext';
import './ShapeBuilder.css';

/* ═══════════════════════════════════════════════
   SHAPE DATA & SVG RENDERERS
═══════════════════════════════════════════════ */

// 2D shapes
const SHAPES_2D = [
    { id: 'circle', name: 'Circle', color: '#4ECDC4', sides: 0, vertices: 0, note: 'Infinite sides — perfectly round!' },
    { id: 'triangle', name: 'Triangle', color: '#FFE66D', sides: 3, vertices: 3, note: 'Strongest shape in engineering!' },
    { id: 'square', name: 'Square', color: '#A8B5E0', sides: 4, vertices: 4, note: 'All sides equal, all angles 90°.' },
    { id: 'rectangle', name: 'Rectangle', color: '#C3A6FF', sides: 4, vertices: 4, note: 'Opposite sides are equal.' },
    { id: 'hexagon', name: 'Hexagon', color: '#FF6B6B', sides: 6, vertices: 6, note: 'Interior angles sum to 720°.' },
    { id: 'star', name: 'Star', color: '#F5C842', sides: 10, vertices: 10, note: '5 points, 10 sides total!' },
    { id: 'oval', name: 'Oval', color: '#C7F5D5', sides: 0, vertices: 0, note: 'Like a stretched circle.' },
    { id: 'diamond', name: 'Diamond', color: '#FFB3B3', sides: 4, vertices: 4, note: 'A rhombus — equal sides.' },
    { id: 'pentagon', name: 'Pentagon', color: '#A0D8EF', sides: 5, vertices: 5, note: 'Interior angles sum to 540°.' },
    { id: 'octagon', name: 'Octagon', color: '#D4A5A5', sides: 8, vertices: 8, note: 'Like a STOP sign — 1080° sum!' },
];

// 3D shapes
const SHAPES_3D = [
    { id: 'cube', name: 'Cube', color: '#64B5F6', sides: 6, vertices: 8, note: '6 faces, 8 vertices, 12 edges.' },
    { id: 'sphere', name: 'Sphere', color: '#EF9A9A', sides: 0, vertices: 0, note: 'Perfectly round in 3D!' },
    { id: 'cone', name: 'Cone', color: '#A5D6A7', sides: 1, vertices: 1, note: '1 circular base, 1 apex.' },
    { id: 'cylinder', name: 'Cylinder', color: '#FFE082', sides: 2, vertices: 0, note: '2 circular faces, 0 vertices.' },
    { id: 'pyramid', name: 'Pyramid', color: '#CE93D8', sides: 5, vertices: 5, note: '4 triangles + 1 square base.' },
];

const SHAPE_PALETTE = [...SHAPES_2D, ...SHAPES_3D];
const COLORS = ['#4ECDC4', '#A8B5E0', '#FFE66D', '#C3A6FF', '#FF6B6B', '#F5C842', '#C7F5D5', '#FFB3B3', '#64B5F6', '#A5D6A7', '#CE93D8'];

/* Shape Properties look-up */
const SHAPE_INFO = Object.fromEntries(SHAPE_PALETTE.map(s => [s.id, s]));

/* ─── SVG Renderers ─── */
function ShapeSVG({ type, color: c, width: w = 60, height: h = 60, size }) {
    // allow legacy 'size' prop as fallback
    const sw = size ?? w;
    const sh = size ?? h;
    switch (type) {
        /* ── 2D ── all use full w×h bounding box ── */
        case 'circle': return <svg width={sw} height={sh} viewBox="0 0 60 60" preserveAspectRatio="none"><circle cx="30" cy="30" r="27" fill={c} stroke="white" strokeWidth="2" /></svg>;
        case 'triangle': return <svg width={sw} height={sh} viewBox="0 0 60 60" preserveAspectRatio="none"><polygon points="30,4 56,54 4,54" fill={c} stroke="white" strokeWidth="2" /></svg>;
        case 'square': return <svg width={sw} height={sh} viewBox="0 0 60 60" preserveAspectRatio="none"><rect x="5" y="5" width="50" height="50" rx="4" fill={c} stroke="white" strokeWidth="2" /></svg>;
        case 'rectangle': return <svg width={sw} height={sh} viewBox="0 0 60 60" preserveAspectRatio="none"><rect x="4" y="4" width="52" height="52" rx="4" fill={c} stroke="white" strokeWidth="2" /></svg>;
        case 'hexagon': return <svg width={sw} height={sh} viewBox="0 0 60 60" preserveAspectRatio="none"><polygon points="30,3 55,17 55,43 30,57 5,43 5,17" fill={c} stroke="white" strokeWidth="2" /></svg>;
        case 'star': return <svg width={sw} height={sh} viewBox="0 0 60 60" preserveAspectRatio="none"><polygon points="30,2 37,22 58,22 42,35 48,56 30,44 12,56 18,35 2,22 23,22" fill={c} stroke="white" strokeWidth="1.5" /></svg>;
        case 'oval': return <svg width={sw} height={sh} viewBox="0 0 60 60" preserveAspectRatio="none"><ellipse cx="30" cy="30" rx="27" ry="27" fill={c} stroke="white" strokeWidth="2" /></svg>;
        case 'diamond': return <svg width={sw} height={sh} viewBox="0 0 60 60" preserveAspectRatio="none"><polygon points="30,3 57,30 30,57 3,30" fill={c} stroke="white" strokeWidth="2" /></svg>;
        case 'pentagon': return <svg width={sw} height={sh} viewBox="0 0 60 60" preserveAspectRatio="none"><polygon points="30,3 57,22 46,54 14,54 3,22" fill={c} stroke="white" strokeWidth="2" /></svg>;
        case 'octagon': return <svg width={sw} height={sh} viewBox="0 0 60 60" preserveAspectRatio="none"><polygon points="20,3 40,3 57,20 57,40 40,57 20,57 3,40 3,20" fill={c} stroke="white" strokeWidth="2" /></svg>;
        /* ── 3D ── */
        case 'cube': {
            // Isometric cube — 3 faces visible
            const top = `30,4 54,17 30,30 6,17`;
            const left = `6,17 30,30 30,56 6,43`;
            const right = `54,17 30,30 30,56 54,43`;
            const darken = (hex, amt) => {
                const n = parseInt(hex.slice(1), 16);
                const r = Math.max(0, ((n >> 16) & 0xff) - amt);
                const g = Math.max(0, ((n >> 8) & 0xff) - amt);
                const b = Math.max(0, (n & 0xff) - amt);
                return `rgb(${r},${g},${b})`;
            };
            return (
                <svg width={s} height={s} viewBox="0 0 60 60">
                    <polygon points={top} fill={c} stroke="white" strokeWidth="1.2" />
                    <polygon points={left} fill={darken(c, 35)} stroke="white" strokeWidth="1.2" />
                    <polygon points={right} fill={darken(c, 18)} stroke="white" strokeWidth="1.2" />
                </svg>
            );
        }
        case 'sphere': {
            const id = `sg_${c.replace('#', '')}`;
            return (
                <svg width={s} height={s} viewBox="0 0 60 60">
                    <defs>
                        <radialGradient id={id} cx="35%" cy="30%" r="60%">
                            <stop offset="0%" stopColor="white" stopOpacity="0.85" />
                            <stop offset="60%" stopColor={c} />
                            <stop offset="100%" stopColor={c} stopOpacity="0.6" />
                        </radialGradient>
                    </defs>
                    <circle cx="30" cy="30" r="27" fill={`url(#${id})`} stroke="white" strokeWidth="1.5" />
                </svg>
            );
        }
        case 'cone': {
            return (
                <svg width={s} height={s} viewBox="0 0 60 60">
                    <ellipse cx="30" cy="52" rx="24" ry="7" fill={c} opacity="0.7" stroke="white" strokeWidth="1.5" />
                    <polygon points="30,4 54,52 6,52" fill={c} stroke="white" strokeWidth="1.5" />
                    <ellipse cx="30" cy="52" rx="24" ry="7" fill={c} stroke="white" strokeWidth="1.5" />
                </svg>
            );
        }
        case 'cylinder': {
            const id = `cy_${c.replace('#', '')}`;
            return (
                <svg width={s} height={s} viewBox="0 0 60 60">
                    <defs>
                        <linearGradient id={id} x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor={c} stopOpacity="0.65" />
                            <stop offset="50%" stopColor={c} />
                            <stop offset="100%" stopColor={c} stopOpacity="0.65" />
                        </linearGradient>
                    </defs>
                    {/* body */}
                    <rect x="7" y="15" width="46" height="36" fill={`url(#${id})`} stroke="none" />
                    {/* bottom ellipse */}
                    <ellipse cx="30" cy="51" rx="23" ry="7" fill={c} opacity="0.8" stroke="white" strokeWidth="1.5" />
                    {/* top ellipse */}
                    <ellipse cx="30" cy="15" rx="23" ry="7" fill={c} stroke="white" strokeWidth="1.5" />
                    {/* side borders */}
                    <line x1="7" y1="15" x2="7" y2="51" stroke="white" strokeWidth="1.5" />
                    <line x1="53" y1="15" x2="53" y2="51" stroke="white" strokeWidth="1.5" />
                </svg>
            );
        }
        case 'pyramid': {
            // Square pyramid — base + 2 visible triangles
            return (
                <svg width={s} height={s} viewBox="0 0 60 60">
                    {/* base parallelogram */}
                    <polygon points="8,46 36,52 52,40 24,34" fill={c} opacity="0.6" stroke="white" strokeWidth="1.2" />
                    {/* left face */}
                    <polygon points="8,46 24,34 30,6" fill={c} stroke="white" strokeWidth="1.2" />
                    {/* right face */}
                    <polygon points="52,40 24,34 30,6" fill={c} opacity="0.8" stroke="white" strokeWidth="1.2" />
                    {/* front face */}
                    <polygon points="8,46 52,40 30,6" fill={c} opacity="0.4" stroke="white" strokeWidth="1.2" />
                </svg>
            );
        }
        default: return null;
    }
}

/* ═══════════════════════════════════════════════
   DRAG MODE — CHALLENGES
═══════════════════════════════════════════════ */
const CHALLENGES = [
    {
        id: 'house',
        name: '🏠 Build a House',
        desc: 'A square for walls, a triangle for the roof!',
        required: { square: 1, triangle: 1 },
        bonus: 6,
    },
    {
        id: 'rocket',
        name: '🚀 Launch a Rocket',
        desc: 'Rectangle body, triangle nose-cone, two small triangles for fins!',
        required: { rectangle: 1, triangle: 3 },
        bonus: 8,
    },
    {
        id: 'snowman',
        name: '☃️ Build a Snowman',
        desc: 'Three circles stacked — big, medium, small!',
        required: { circle: 3 },
        bonus: 5,
    },
    {
        id: 'robot',
        name: '🤖 Make a Robot',
        desc: 'Square head, rectangle body, and smaller squares for arms!',
        required: { square: 3, rectangle: 1 },
        bonus: 7,
    },
    {
        id: 'flower',
        name: '🌸 Draw a Flower',
        desc: 'A circle centre surrounded by oval petals!',
        required: { circle: 1, oval: 5 },
        bonus: 6,
    },
    {
        id: 'castle',
        name: '🏰 Castle Towers',
        desc: 'Use rectangles as towers and pentagons as turrets!',
        required: { rectangle: 2, pentagon: 2 },
        bonus: 8,
    },
];

/* ─── Palette draggable item ─── */
function PaletteShape({ shape }) {
    const [{ isDragging }, drag] = useDrag(() => ({
        type: 'SHAPE',
        item: { shapeId: shape.id, color: shape.color },
        collect: m => ({ isDragging: m.isDragging() }),
    }));
    return (
        <motion.div ref={drag} className="palette-shape" style={{ opacity: isDragging ? 0.4 : 1 }}
            whileHover={{ scale: 1.12 }} whileTap={{ scale: 0.94 }} title={shape.name}>
            <ShapeSVG type={shape.id} color={shape.color} size={44} />
            <span className="palette-label">{shape.name}</span>
        </motion.div>
    );
}

/* ─── 8-handle resize ─── */
const HANDLE_DIRS = [
    { id: 'nw', x: 0, y: 0, cursor: 'nw-resize' },
    { id: 'n', x: 0.5, y: 0, cursor: 'n-resize' },
    { id: 'ne', x: 1, y: 0, cursor: 'ne-resize' },
    { id: 'e', x: 1, y: 0.5, cursor: 'e-resize' },
    { id: 'se', x: 1, y: 1, cursor: 'se-resize' },
    { id: 's', x: 0.5, y: 1, cursor: 's-resize' },
    { id: 'sw', x: 0, y: 1, cursor: 'sw-resize' },
    { id: 'w', x: 0, y: 0.5, cursor: 'w-resize' },
];

function CanvasShape({ shape, onSelect, isSelected, onContextMenu, onResize }) {
    const [{ isDragging }, drag] = useDrag(() => ({
        type: 'CANVAS_SHAPE',
        item: { canvasId: shape.canvasId },
        collect: m => ({ isDragging: m.isDragging() }),
    }));

    const startResize = (e, dir) => {
        e.stopPropagation(); e.preventDefault();
        const startX = e.clientX, startY = e.clientY;
        const startW = shape.width, startH = shape.height;
        const MIN = 32, MAX = 480;
        const onMove = mv => {
            const dx = mv.clientX - startX, dy = mv.clientY - startY;
            let nw = startW, nh = startH;
            if (dir.includes('e')) nw = Math.min(MAX, Math.max(MIN, startW + dx));
            if (dir.includes('s')) nh = Math.min(MAX, Math.max(MIN, startH + dy));
            if (dir.includes('w')) nw = Math.min(MAX, Math.max(MIN, startW - dx));
            if (dir.includes('n')) nh = Math.min(MAX, Math.max(MIN, startH - dy));
            onResize(shape.canvasId, nw, nh);
        };
        const onUp = () => {
            document.removeEventListener('mousemove', onMove);
            document.removeEventListener('mouseup', onUp);
        };
        document.addEventListener('mousemove', onMove);
        document.addEventListener('mouseup', onUp);
    };

    return (
        <div
            className={`canvas-shape ${isSelected ? 'selected' : ''}`}
            style={{
                left: shape.x, top: shape.y,
                width: shape.width, height: shape.height,
                opacity: isDragging ? 0.4 : 1,
                zIndex: isSelected ? 20 : 1,
            }}
            onClick={e => { e.stopPropagation(); onSelect(shape.canvasId); }}
            onContextMenu={e => { e.preventDefault(); e.stopPropagation(); onContextMenu(e, shape.canvasId); }}>

            {/* draggable body */}
            <div ref={drag} className="shape-drag-body" title={shape.name}>
                <ShapeSVG type={shape.type} color={shape.color} width={shape.width} height={shape.height} />
            </div>

            {/* label on hover/select */}
            <div className="shape-name-tag">{shape.name}</div>

            {/* 8 resize handles — only visible when selected */}
            {isSelected && HANDLE_DIRS.map(h => (
                <div key={h.id}
                    className="resize-handle"
                    style={{
                        left: `calc(${h.x * 100}% - 6px)`,
                        top: `calc(${h.y * 100}% - 6px)`,
                        cursor: h.cursor,
                    }}
                    onMouseDown={e => startResize(e, h.id)}
                />
            ))}
        </div>
    );
}

/* ═══════════════════════════════════════════════
   DRAW MODE HELPERS
═══════════════════════════════════════════════ */
const POLY_NAMES = {
    3: 'Triangle', 4: 'Quadrilateral', 5: 'Pentagon', 6: 'Hexagon',
    7: 'Heptagon', 8: 'Octagon', 9: 'Nonagon', 10: 'Decagon',
};
const POLY_EMOJIS = { 3: '🔺', 4: '🟦', 5: '⭐', 6: '⬡', 7: '🌀', 8: '🔷', 9: '💜', 10: '🔟' };
const POLY_FACTS = {
    3: 'Angles in a triangle always add up to 180°. The strongest shape in engineering! 🏗️',
    4: 'A quadrilateral\'s interior angles always sum to 360°. Squares are special quadrilaterals! 🟦',
    5: 'A regular pentagon\'s angles each equal 108°, total 540°. Found in soccer balls! ⚽',
    6: 'A regular hexagon\'s angles each equal 120°, total 720°. Honeycombs use hexagons! 🍯',
    7: 'Heptagon angles sum to 900°. They appear on UK 50p coins! 🪙',
    8: 'Octagon angles sum to 1080°. Every STOP sign worldwide is an octagon! 🛑',
    9: 'A nonagon has 9 sides with interior angles summing to 1260°! 💜',
    10: 'A decagon\'s angles sum to 1440°! 🔟',
};
const expectedAngleSum = n => (n - 2) * 180;
const DRAW_COLORS = ['#4ECDC4', '#FF6B6B', '#C3A6FF', '#F5C842', '#A8B5E0'];

function dist(a, b) { return Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2); }
function perimeter(verts) {
    let p = 0;
    for (let i = 0; i < verts.length; i++) p += dist(verts[i], verts[(i + 1) % verts.length]);
    return Math.round(p);
}
function angleDeg(a, b, c) {
    const ba = { x: a.x - b.x, y: a.y - b.y };
    const bc = { x: c.x - b.x, y: c.y - b.y };
    const dot = ba.x * bc.x + ba.y * bc.y;
    const magBA = Math.sqrt(ba.x ** 2 + ba.y ** 2);
    const magBC = Math.sqrt(bc.x ** 2 + bc.y ** 2);
    if (magBA === 0 || magBC === 0) return 0;
    return Math.round(Math.acos(Math.max(-1, Math.min(1, dot / (magBA * magBC)))) * 180 / Math.PI);
}

/* ═══════════════════════════════════════════════
   GEOMETRY CANVAS (Draw Mode)
═══════════════════════════════════════════════ */
function GeometryCanvas({ addStars, recordBuilderSave }) {
    const [vertices, setVertices] = useState([]);
    const [mousePos, setMousePos] = useState(null);
    const [complete, setComplete] = useState(false);
    const [shapeInfo, setShapeInfo] = useState(null);
    const [drawColor, setDrawColor] = useState(DRAW_COLORS[0]);
    const [showSnap, setShowSnap] = useState(false);
    const [capturing, setCapturing] = useState(false);
    const [captureImg, setCaptureImg] = useState(null);
    const svgWrapRef = useRef(null);
    const svgRef = useRef(null);
    const SNAP_R = 20;

    const toSVG = e => {
        const r = svgRef.current.getBoundingClientRect();
        return { x: e.clientX - r.left, y: e.clientY - r.top };
    };
    const isNearFirst = pt => vertices.length >= 2 && dist(pt, vertices[0]) < SNAP_R;

    const handleSVGClick = e => {
        if (complete) return;
        const pt = toSVG(e);
        if (isNearFirst(pt)) { closeShape(); return; }
        setVertices(v => [...v, pt]);
    };
    const handleMouseMove = e => {
        if (complete) return;
        const pt = toSVG(e);
        setMousePos(pt);
        setShowSnap(isNearFirst(pt));
    };
    const handleMouseLeave = () => setMousePos(null);
    const undoLast = () => { if (!complete && vertices.length > 0) setVertices(v => v.slice(0, -1)); };
    const clearAll = () => { setVertices([]); setComplete(false); setShapeInfo(null); setMousePos(null); setCaptureImg(null); };

    const closeShape = () => {
        if (vertices.length < 3) return;
        const sides = vertices.length;
        const name = POLY_NAMES[sides] || `${sides}-gon`;
        const emoji = POLY_EMOJIS[sides] || '🔷';
        const fact = POLY_FACTS[sides] || `A ${name} has ${sides} sides and ${sides} vertices!`;
        const peri = perimeter(vertices);
        const angles = vertices.map((v, i) =>
            angleDeg(vertices[(i - 1 + sides) % sides], v, vertices[(i + 1) % sides])
        );
        const actualSum = angles.reduce((a, b) => a + b, 0);
        const expectedSum = expectedAngleSum(sides);
        const avgAngle = Math.round(actualSum / sides);
        const stars = Math.min(sides, 8);
        setShapeInfo({ sides, name, emoji, fact, peri, angles, actualSum, expectedSum, avgAngle, stars });
        setComplete(true);
        addStars(stars);
        recordBuilderSave();
    };

    /* Screenshot of SVG canvas */
    const handleCapture = () => {
        if (!svgWrapRef.current) return;
        setCapturing(true);
        import('html2canvas').then(({ default: html2canvas }) => {
            html2canvas(svgWrapRef.current, { backgroundColor: '#fff', useCORS: true }).then(canvas => {
                setCaptureImg(canvas.toDataURL('image/png'));
                addStars(2);
                setCapturing(false);
            }).catch(() => setCapturing(false));
        }).catch(() => setCapturing(false));
    };

    const downloadCapture = () => {
        if (!captureImg) return;
        const a = document.createElement('a');
        a.href = captureImg; a.download = 'my-geometry-shape.png'; a.click();
    };

    /* Keyboard shortcuts */
    useEffect(() => {
        const onKey = e => {
            if (e.key === 'c' || e.key === 'C') closeShape();
            if (e.key === 'Backspace') undoLast();
            if (e.key === 'Escape') clearAll();
        };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, [vertices, complete]);

    const polyPoints = vertices.map(v => `${v.x},${v.y}`).join(' ');
    const GRID = 30;

    return (
        <div className="draw-mode-wrapper">
            {/* Toolbar */}
            <div className="draw-toolbar">
                <div className="draw-color-row">
                    {DRAW_COLORS.map(c => (
                        <button key={c} className={`draw-color-dot ${drawColor === c ? 'active' : ''}`}
                            style={{ background: c }} onClick={() => setDrawColor(c)} />
                    ))}
                </div>
                <div className="draw-actions">
                    <button className="btn btn-ghost btn-sm" onClick={undoLast} disabled={complete || vertices.length === 0}>↩️ Undo</button>
                    <button className="btn btn-teal btn-sm" onClick={closeShape} disabled={complete || vertices.length < 3}>✅ Close Shape</button>
                    <button className="btn btn-screenshot btn-sm" onClick={handleCapture} disabled={!complete || capturing}>
                        {capturing ? '⏳' : '📸 Capture'}
                    </button>
                    <button className="btn btn-ghost btn-sm" onClick={clearAll}>🗑️ Clear</button>
                </div>
            </div>

            {/* SVG Canvas */}
            <div ref={svgWrapRef} className="draw-canvas-wrap">
                <svg ref={svgRef} className="draw-svg"
                    onClick={handleSVGClick}
                    onMouseMove={handleMouseMove}
                    onMouseLeave={handleMouseLeave}>
                    <defs>
                        <pattern id="dot-grid" x="0" y="0" width={GRID} height={GRID} patternUnits="userSpaceOnUse">
                            <circle cx={GRID / 2} cy={GRID / 2} r="1.8" fill="rgba(168,181,224,0.45)" />
                        </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#dot-grid)" />

                    {/* Filled polygon (completed) */}
                    {complete && vertices.length >= 3 && (
                        <motion.polygon points={polyPoints}
                            fill={drawColor + '33'} stroke={drawColor} strokeWidth="3" strokeLinejoin="round"
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}
                        />
                    )}

                    {/* Drawn edges */}
                    {!complete && vertices.length >= 2 && vertices.map((v, i) => i === 0 ? null : (
                        <line key={i} x1={vertices[i - 1].x} y1={vertices[i - 1].y} x2={v.x} y2={v.y}
                            stroke={drawColor} strokeWidth="2.5" strokeLinecap="round" />
                    ))}

                    {/* Preview dashed edge */}
                    {!complete && vertices.length > 0 && mousePos && (
                        <line x1={vertices[vertices.length - 1].x} y1={vertices[vertices.length - 1].y}
                            x2={mousePos.x} y2={mousePos.y}
                            stroke={drawColor} strokeWidth="2" strokeDasharray="6 4" opacity="0.6" />
                    )}

                    {/* Edge length labels */}
                    {vertices.length >= 2 && vertices.map((v, i) => {
                        const isLast = complete && i === vertices.length - 1;
                        const next = complete ? vertices[(i + 1) % vertices.length] : (i < vertices.length - 1 ? vertices[i + 1] : null);
                        if (!next && !isLast) return null;
                        if (!next) return null;
                        const prev = v;
                        const mx = (prev.x + next.x) / 2, my = (prev.y + next.y) / 2;
                        const d = Math.round(dist(prev, next));
                        return (
                            <g key={`lbl-${i}`}>
                                <rect x={mx - 14} y={my - 10} width={28} height={18} rx="5" fill="white" opacity="0.85" />
                                <text x={mx} y={my + 4} textAnchor="middle" fontSize="11" fontWeight="700" fill={drawColor}>{d}</text>
                            </g>
                        );
                    })}

                    {/* Angle arc labels on completed shape */}
                    {complete && shapeInfo && vertices.map((v, i) => {
                        const a = shapeInfo.angles[i];
                        return (
                            <text key={`ang-${i}`} x={v.x + 2} y={v.y - 6} fontSize="10" fontWeight="700"
                                fill={drawColor} textAnchor="middle">{a}°</text>
                        );
                    })}

                    {/* Vertex dots */}
                    {vertices.map((v, i) => (
                        <g key={`v-${i}`}>
                            {i === 0 && showSnap && (
                                <circle cx={v.x} cy={v.y} r={SNAP_R} fill={drawColor + '28'}
                                    stroke={drawColor} strokeWidth="1.5" strokeDasharray="4 3" />
                            )}
                            <circle cx={v.x} cy={v.y} r="10" fill={drawColor} stroke="white" strokeWidth="2.5" />
                            <text x={v.x} y={v.y + 4.5} textAnchor="middle" fontSize="10" fontWeight="900" fill="white">{i + 1}</text>
                        </g>
                    ))}

                    {/* Snap hint */}
                    {!complete && vertices.length >= 2 && showSnap && (
                        <text x={vertices[0].x} y={vertices[0].y - 18} textAnchor="middle"
                            fontSize="11" fontWeight="700" fill={drawColor}>Close here!</text>
                    )}

                    {/* Empty state */}
                    {vertices.length === 0 && (
                        <text x="50%" y="48%" textAnchor="middle" fontSize="15"
                            fontWeight="700" fill="rgba(168,181,224,0.7)">
                            Click anywhere to place your first vertex ✦
                        </text>
                    )}
                </svg>
            </div>

            {/* Keyboard hints */}
            <div className="kbd-hints">
                <span>Click = place vertex</span>
                <span><kbd>C</kbd> Close shape</span>
                <span><kbd>⌫</kbd> Undo</span>
                <span><kbd>Esc</kbd> Clear</span>
                <span style={{ color: vertices.length >= 3 ? '#4ECDC4' : 'inherit' }}>
                    {vertices.length} point{vertices.length !== 1 ? 's' : ''}
                </span>
            </div>

            {/* Capture preview modal */}
            <AnimatePresence>
                {captureImg && (
                    <motion.div className="screenshot-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        onClick={() => setCaptureImg(null)}>
                        <motion.div className="screenshot-modal" initial={{ scale: .8 }} animate={{ scale: 1 }} exit={{ scale: .8 }}
                            onClick={e => e.stopPropagation()}>
                            <h2 className="title-sm" style={{ marginBottom: 12 }}>📐 Your Shape!</h2>
                            <img src={captureImg} alt="Shape capture" className="screenshot-preview" />
                            <div style={{ display: 'flex', gap: 10, marginTop: 16, justifyContent: 'center' }}>
                                <button className="btn btn-primary" onClick={downloadCapture}>⬇️ Download</button>
                                <button className="btn btn-ghost" onClick={() => setCaptureImg(null)}>Close</button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Shape Result Panel */}
            <AnimatePresence>
                {shapeInfo && (
                    <motion.div className="shape-result-panel"
                        initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 30 }} transition={{ type: 'spring', stiffness: 200 }}>
                        <div className="shape-result-hero">
                            <span className="shape-result-emoji">{shapeInfo.emoji}</span>
                            <div>
                                <h2 className="shape-result-name">{shapeInfo.name}!</h2>
                                <p className="shape-result-sub">You constructed a {shapeInfo.sides}-sided polygon 🎉</p>
                            </div>
                            <span className="shape-result-stars">+{shapeInfo.stars} ⭐</span>
                        </div>

                        <div className="shape-props-grid">
                            {[
                                { icon: '📐', label: 'Sides', val: shapeInfo.sides },
                                { icon: '📏', label: 'Perimeter', val: `${shapeInfo.peri}px` },
                                { icon: '🔢', label: 'Vertices', val: shapeInfo.sides },
                                { icon: '📊', label: 'Avg Angle', val: `${shapeInfo.avgAngle}°` },
                            ].map(p => (
                                <div key={p.label} className="shape-prop">
                                    <span className="prop-icon">{p.icon}</span>
                                    <span className="prop-label">{p.label}</span>
                                    <span className="prop-value">{p.val}</span>
                                </div>
                            ))}
                        </div>

                        {/* Angle-sum formula */}
                        <div className="angle-sum-row">
                            <span className="angle-sum-formula">
                                ({shapeInfo.sides} − 2) × 180° = <strong>{shapeInfo.expectedSum}°</strong>
                            </span>
                            <span className={`angle-sum-badge ${Math.abs(shapeInfo.actualSum - shapeInfo.expectedSum) <= 8 ? 'ok' : 'off'}`}>
                                Your sum: {shapeInfo.actualSum}°
                                {Math.abs(shapeInfo.actualSum - shapeInfo.expectedSum) <= 8 ? ' ✓' : ' ≈'}
                            </span>
                        </div>

                        {/* Per-vertex angles */}
                        <div className="angle-list">
                            <p className="angle-list-title">📐 Interior angles at each vertex:</p>
                            <div className="angle-chips">
                                {shapeInfo.angles.map((a, i) => (
                                    <span key={i} className="angle-chip">V{i + 1}: <strong>{a}°</strong></span>
                                ))}
                            </div>
                        </div>

                        <div className="shape-fact">{shapeInfo.fact}</div>

                        <div style={{ display: 'flex', gap: 10, marginTop: 12 }}>
                            <button className="btn btn-screenshot" onClick={handleCapture} disabled={capturing} style={{ flex: 1 }}>
                                {capturing ? '⏳ Capturing…' : '📸 Capture Shape'}
                            </button>
                            <button className="btn btn-primary" onClick={clearAll} style={{ flex: 1 }}>
                                🔄 Draw Another
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

/* ═══════════════════════════════════════════════
   DRAG MODE — Scene Builder with Challenges
═══════════════════════════════════════════════ */
let idCounter = 0;

function DragModeBuilder({ addStars, recordBuilderSave }) {
    const [canvasShapes, setCanvasShapes] = useState([]);
    const [selectedId, setSelectedId] = useState(null);
    const [selectedColor, setSelectedColor] = useState(COLORS[0]);
    const [saved, setSaved] = useState(false);
    const [contextMenu, setContextMenu] = useState(null);
    const [screenshot, setScreenshot] = useState(null);
    const [screenshotReward, setScreenshotReward] = useState(false);
    const [activeChallenge, setActiveChallenge] = useState(CHALLENGES[0]);
    const [challengeDone, setChallengeDone] = useState(false);
    const [challengeRewarded, setChallengeRewarded] = useState(false);
    const [tab, setTab] = useState('2d'); // '2d' | '3d'
    const canvasRef = useRef(null);

    /* Current selection's shape info */
    const selectedShape = canvasShapes.find(s => s.canvasId === selectedId);
    const selectedInfo = selectedShape ? SHAPE_INFO[selectedShape.type] : null;

    /* Challenge progress */
    const challengeProgress = activeChallenge ? (() => {
        const counts = {};
        canvasShapes.forEach(s => { counts[s.type] = (counts[s.type] || 0) + 1; });
        const req = activeChallenge.required;
        let met = 0, total = 0;
        Object.entries(req).forEach(([type, n]) => {
            total += n;
            met += Math.min(counts[type] || 0, n);
        });
        return { counts, met, total, done: met >= total };
    })() : null;

    /* Award stars when challenge completed */
    useEffect(() => {
        if (challengeProgress?.done && !challengeDone && !challengeRewarded) {
            setChallengeDone(true);
            setChallengeRewarded(true);
            addStars(activeChallenge.bonus);
        }
    }, [challengeProgress?.done]);

    /* Reset challenge flags when challenge changes */
    useEffect(() => {
        setChallengeDone(false);
        setChallengeRewarded(false);
    }, [activeChallenge]);

    const changeColor = useCallback(color => {
        setSelectedColor(color);
        if (selectedId) setCanvasShapes(p => p.map(s => s.canvasId === selectedId ? { ...s, color } : s));
    }, [selectedId]);

    const changeSize = useCallback((delta, targetId = selectedId) => {
        if (targetId) setCanvasShapes(p => p.map(s =>
            s.canvasId === targetId ? {
                ...s,
                width: Math.max(32, Math.min(480, (s.width ?? s.size ?? 90) + delta)),
                height: Math.max(32, Math.min(480, (s.height ?? s.size ?? 90) + delta)),
            } : s
        ));
    }, [selectedId]);

    const deleteShape = useCallback((targetId = selectedId) => {
        setCanvasShapes(p => p.filter(s => s.canvasId !== targetId));
        if (targetId === selectedId) setSelectedId(null);
    }, [selectedId]);

    const duplicateShape = useCallback(targetId => {
        const src = canvasShapes.find(s => s.canvasId === targetId);
        if (!src) return;
        const ns = { ...src, canvasId: ++idCounter, x: src.x + 22, y: src.y + 22 };
        setCanvasShapes(p => [...p, ns]);
        setSelectedId(ns.canvasId);
    }, [canvasShapes]);

    const bringToFront = useCallback(targetId => {
        setCanvasShapes(p => {
            const s = p.find(x => x.canvasId === targetId);
            return s ? [...p.filter(x => x.canvasId !== targetId), s] : p;
        });
    }, []);

    const handleSave = () => {
        if (canvasShapes.length > 0) { recordBuilderSave(); addStars(3); setSaved(true); setTimeout(() => setSaved(false), 2500); }
    };

    const handleScreenshot = useCallback(() => {
        if (!canvasRef.current || canvasShapes.length === 0) return;
        import('html2canvas').then(({ default: html2canvas }) => {
            html2canvas(canvasRef.current, { backgroundColor: '#F8FBF8', useCORS: true }).then(canvas => {
                setScreenshot(canvas.toDataURL('image/png'));
                setScreenshotReward(true);
                addStars(2);
                setTimeout(() => setScreenshotReward(false), 2500);
            });
        });
    }, [canvasShapes, addStars]);

    /* Keyboard */
    useEffect(() => {
        const onKey = e => {
            if (e.key === 'Escape') { setContextMenu(null); setSelectedId(null); return; }
            if (!selectedId) return;
            const S = 10;
            if (e.key === 'ArrowUp') { e.preventDefault(); setCanvasShapes(p => p.map(s => s.canvasId === selectedId ? { ...s, y: Math.max(0, s.y - S) } : s)); }
            if (e.key === 'ArrowDown') { e.preventDefault(); setCanvasShapes(p => p.map(s => s.canvasId === selectedId ? { ...s, y: s.y + S } : s)); }
            if (e.key === 'ArrowLeft') { e.preventDefault(); setCanvasShapes(p => p.map(s => s.canvasId === selectedId ? { ...s, x: Math.max(0, s.x - S) } : s)); }
            if (e.key === 'ArrowRight') { e.preventDefault(); setCanvasShapes(p => p.map(s => s.canvasId === selectedId ? { ...s, x: s.x + S } : s)); }
            if (e.key === '+' || e.key === '=') changeSize(10);
            if (e.key === '-') changeSize(-10);
            if (e.key === 'Delete' || e.key === 'Backspace') deleteShape();
        };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, [selectedId, changeSize, deleteShape]);

    const handleWheel = useCallback(e => {
        if (!selectedId) return;
        e.preventDefault();
        changeSize(e.deltaY < 0 ? 8 : -8);
    }, [selectedId, changeSize]);

    const handleContextMenu = useCallback((e, canvasId) => {
        setSelectedId(canvasId); setContextMenu({ x: e.clientX, y: e.clientY, canvasId });
    }, []);

    /* Resize handler called from CanvasShape handles */
    const handleResize = useCallback((canvasId, newW, newH) => {
        setCanvasShapes(p => p.map(s =>
            s.canvasId === canvasId ? { ...s, width: newW, height: newH } : s
        ));
    }, []);

    const [, drop] = useDrop(() => ({
        accept: ['SHAPE', 'CANVAS_SHAPE'],
        drop: (item, monitor) => {
            const off = monitor.getClientOffset();
            const rect = canvasRef.current.getBoundingClientRect();
            const x = Math.max(0, off.x - rect.left - 45);
            const y = Math.max(0, off.y - rect.top - 45);
            if (item.shapeId) {
                const info = SHAPE_PALETTE.find(s => s.id === item.shapeId);
                const ns = { canvasId: ++idCounter, type: item.shapeId, name: info.name, color: item.color, x, y, width: 90, height: 90 };
                setCanvasShapes(p => [...p, ns]);
                setSelectedId(ns.canvasId);
            } else if (item.canvasId) {
                setCanvasShapes(p => p.map(s => s.canvasId === item.canvasId ? { ...s, x, y } : s));
            }
        },
    }));

    const palette = tab === '2d' ? SHAPES_2D : SHAPES_3D;

    return (
        <div onClick={() => setContextMenu(null)}>
            {/* ─── Challenge Banner ─── */}
            <div className="challenge-section">
                <div className="challenge-header">
                    <div className="challenge-select-row">
                        <span className="challenge-pick-label">🎯 Challenge:</span>
                        <div className="challenge-pills">
                            {CHALLENGES.map(ch => (
                                <button key={ch.id}
                                    className={`challenge-pill ${activeChallenge?.id === ch.id ? 'active' : ''}`}
                                    onClick={() => setActiveChallenge(ch)}>
                                    {ch.name}
                                </button>
                            ))}
                        </div>
                    </div>
                    {activeChallenge && (
                        <p className="challenge-desc">{activeChallenge.desc}</p>
                    )}
                </div>

                {/* Progress checklist */}
                {activeChallenge && (
                    <div className="challenge-checklist">
                        {Object.entries(activeChallenge.required).map(([type, n]) => {
                            const got = Math.min(challengeProgress?.counts?.[type] || 0, n);
                            return (
                                <div key={type} className={`check-item ${got >= n ? 'done' : ''}`}>
                                    <ShapeSVG type={type} color={got >= n ? '#4ECDC4' : '#CBD5E0'} size={28} />
                                    <span>{n}× {SHAPE_INFO[type]?.name}</span>
                                    <span className="check-count">{got}/{n}</span>
                                    {got >= n && <span className="check-tick">✓</span>}
                                </div>
                            );
                        })}
                        {challengeDone && (
                            <motion.span className="challenge-badge"
                                initial={{ scale: .5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
                                🏆 +{activeChallenge.bonus}⭐ Complete!
                            </motion.span>
                        )}
                    </div>
                )}
            </div>

            {/* ─── Main layout ─── */}
            <div className="builder-layout">
                {/* Palette */}
                <div className="shape-palette">
                    <div className="palette-tab-row">
                        <button className={`palette-tab ${tab === '2d' ? 'active' : ''}`} onClick={() => setTab('2d')}>2D</button>
                        <button className={`palette-tab ${tab === '3d' ? 'active' : ''}`} onClick={() => setTab('3d')}>3D</button>
                    </div>
                    <h3 className="palette-title">{tab === '2d' ? '2D Shapes' : '3D Shapes'}</h3>
                    <div className="palette-grid">
                        {palette.map(s => <PaletteShape key={s.id} shape={s} />)}
                    </div>
                </div>

                {/* Canvas + right panels */}
                <div style={{ display: 'flex', flex: 1, gap: 12, overflow: 'hidden' }}>
                    {/* Drop canvas */}
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 10 }}>
                        <div ref={n => { drop(n); canvasRef.current = n; }}
                            className="drop-canvas" onClick={() => setSelectedId(null)}
                            onWheel={handleWheel} tabIndex={0}>
                            {canvasShapes.length === 0 && (
                                <div className="canvas-empty">
                                    <span style={{ fontSize: '3rem' }}>🎨</span>
                                    <p className="body-md" style={{ color: 'var(--text-light)', marginTop: 8 }}>Drag shapes here!</p>
                                    <p className="body-sm" style={{ color: 'var(--text-light)', marginTop: 4, opacity: 0.7 }}>
                                        Arrow keys move · scroll to resize · right-click for menu
                                    </p>
                                </div>
                            )}
                            {canvasShapes.map(s => (
                                <CanvasShape key={s.canvasId} shape={s}
                                    isSelected={s.canvasId === selectedId}
                                    onSelect={setSelectedId} onContextMenu={handleContextMenu}
                                    onResize={handleResize} />
                            ))}
                        </div>

                        {/* Controls */}
                        <div className="canvas-controls">
                            <div className="color-row">
                                {COLORS.map(c => (
                                    <button key={c} className={`color-dot ${selectedColor === c ? 'active' : ''}`}
                                        style={{ background: c }} onClick={() => changeColor(c)} />
                                ))}
                            </div>
                            <div className="control-buttons">
                                {selectedId && (<>
                                    <button className="btn btn-ghost btn-icon" onClick={() => changeSize(-10)}>➖</button>
                                    <button className="btn btn-ghost btn-icon" onClick={() => changeSize(10)}>➕</button>
                                    <button className="btn btn-coral btn-icon" onClick={() => deleteShape()}>🗑️</button>
                                </>)}
                                <button className="btn btn-ghost" onClick={() => { setCanvasShapes([]); setSelectedId(null); setChallengeDone(false); setChallengeRewarded(false); }}>Clear</button>
                                <button className="btn btn-screenshot" onClick={handleScreenshot} disabled={canvasShapes.length === 0}>📸 Photo</button>
                                <button className="btn btn-primary" onClick={handleSave}>💾 Save</button>
                            </div>
                        </div>
                    </div>

                    {/* ─── Shape Properties Sidebar ─── */}
                    {selectedInfo && (
                        <motion.div className="shape-info-sidebar"
                            initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}>
                            <h3 className="sidebar-title">📐 Shape Info</h3>
                            <div className="sidebar-shape-preview">
                                <ShapeSVG type={selectedShape?.type} color={selectedShape?.color} size={72} />
                            </div>
                            <h4 className="sidebar-shape-name">{selectedInfo.name}</h4>
                            <div className="sidebar-props">
                                {[
                                    { label: 'Sides', val: selectedInfo.sides === 0 ? '∞' : selectedInfo.sides },
                                    { label: 'Vertices', val: selectedInfo.vertices === 0 ? '∞' : selectedInfo.vertices },
                                    { label: 'Type', val: SHAPES_3D.find(s => s.id === selectedInfo.id) ? '3D Solid' : '2D Shape' },
                                ].map(p => (
                                    <div key={p.label} className="sidebar-prop-row">
                                        <span className="sidebar-prop-key">{p.label}</span>
                                        <span className="sidebar-prop-val">{p.val}</span>
                                    </div>
                                ))}
                            </div>
                            <p className="sidebar-note">{selectedInfo.note}</p>
                            <div className="sidebar-kbd-hints">
                                <span><kbd>←↑→↓</kbd> Move</span>
                                <span><kbd>+</kbd><kbd>-</kbd> Resize</span>
                                <span><kbd>Del</kbd> Delete</span>
                            </div>
                        </motion.div>
                    )}
                </div>
            </div>

            {/* Context menu */}
            <AnimatePresence>
                {contextMenu && (
                    <motion.div className="context-menu" style={{ top: contextMenu.y, left: contextMenu.x }}
                        initial={{ opacity: 0, scale: .85 }} animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: .85 }} transition={{ duration: .15 }}
                        onClick={e => e.stopPropagation()}>
                        <button className="ctx-item" onClick={() => { bringToFront(contextMenu.canvasId); setContextMenu(null); }}>⬆️ Bring to Front</button>
                        <button className="ctx-item" onClick={() => { duplicateShape(contextMenu.canvasId); setContextMenu(null); }}>📋 Duplicate</button>
                        <div className="ctx-divider" />
                        <button className="ctx-item ctx-danger" onClick={() => { deleteShape(contextMenu.canvasId); setContextMenu(null); }}>🗑️ Delete</button>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Screenshot modal */}
            <AnimatePresence>
                {screenshot && (
                    <motion.div className="screenshot-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }} onClick={() => setScreenshot(null)}>
                        <motion.div className="screenshot-modal" initial={{ scale: .8 }} animate={{ scale: 1 }}
                            exit={{ scale: .8 }} onClick={e => e.stopPropagation()}>
                            <h2 className="title-sm" style={{ marginBottom: 12 }}>📸 Your Creation!</h2>
                            <img src={screenshot} alt="Creation" className="screenshot-preview" />
                            <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
                                <button className="btn btn-primary" onClick={() => {
                                    const a = document.createElement('a'); a.href = screenshot;
                                    a.download = 'my-shape-scene.png'; a.click();
                                }}>⬇️ Download</button>
                                <button className="btn btn-ghost" onClick={() => setScreenshot(null)}>Close</button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Toasts */}
            <AnimatePresence>
                {saved && <motion.div className="save-toast" initial={{ y: 80, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 80, opacity: 0 }}>🎉 Saved! +3 ⭐</motion.div>}
            </AnimatePresence>
            <AnimatePresence>
                {screenshotReward && <motion.div className="save-toast screenshot-toast" initial={{ y: 80, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 80, opacity: 0 }}>📸 Screenshot! +2 ⭐</motion.div>}
            </AnimatePresence>
        </div>
    );
}

/* ═══════════════════════════════════════════════
   ROOT — MODE SWITCHER
═══════════════════════════════════════════════ */
export default function ShapeBuilder() {
    const [mode, setMode] = useState('drag');
    const { recordBuilderSave, addStars } = useProgress();
    return (
        <div className="builder-page">
            <div className="builder-header">
                <h1 className="title-lg">🧩 Shape Builder</h1>
                <p className="body-sm" style={{ color: 'var(--text-mid)' }}>
                    {mode === 'drag'
                        ? 'Complete creative challenges by dragging shapes — learn their properties as you build!'
                        : 'Click to place vertices and construct any polygon — see the math come alive!'}
                </p>
                <div className="mode-switcher">
                    <button className={`mode-btn ${mode === 'drag' ? 'active' : ''}`} onClick={() => setMode('drag')}>
                        🎨 Scene Builder
                    </button>
                    <button className={`mode-btn ${mode === 'draw' ? 'active' : ''}`} onClick={() => setMode('draw')}>
                        📐 Geometry Mode
                    </button>
                </div>
            </div>

            <AnimatePresence mode="wait">
                {mode === 'drag' ? (
                    <motion.div key="drag" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} transition={{ duration: .25 }}>
                        <DragModeBuilder addStars={addStars} recordBuilderSave={recordBuilderSave} />
                    </motion.div>
                ) : (
                    <motion.div key="draw" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: .25 }}>
                        <GeometryCanvas addStars={addStars} recordBuilderSave={recordBuilderSave} />
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
