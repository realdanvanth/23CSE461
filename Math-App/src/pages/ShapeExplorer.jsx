import { useState, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, Float } from '@react-three/drei';
import { motion, AnimatePresence } from 'framer-motion';
import { useProgress } from '../context/ProgressContext';
import './ShapeExplorer.css';

const SHAPES_3D = [
    {
        id: 'cube',
        name: 'Cube',
        color: '#4ECDC4',
        icon: '🟦',
        faces: 6,
        edges: 12,
        vertices: 8,
        fact: 'A cube has 6 equal square faces!',
        component: ({ color }) => (
            <mesh castShadow>
                <boxGeometry args={[2, 2, 2]} />
                <meshStandardMaterial color={color} roughness={0.3} metalness={0.1} />
            </mesh>
        ),
    },
    {
        id: 'sphere',
        name: 'Sphere',
        color: '#A8B5E0',
        icon: '🔵',
        faces: '∞',
        edges: 0,
        vertices: 0,
        fact: 'A sphere is perfectly round — like a ball!',
        component: ({ color }) => (
            <mesh castShadow>
                <sphereGeometry args={[1.4, 32, 32]} />
                <meshStandardMaterial color={color} roughness={0.2} metalness={0.15} />
            </mesh>
        ),
    },
    {
        id: 'cone',
        name: 'Cone',
        color: '#FF6B6B',
        icon: '🔺',
        faces: 2,
        edges: 1,
        vertices: 1,
        fact: 'A cone has a circular base and a pointy top!',
        component: ({ color }) => (
            <mesh castShadow>
                <coneGeometry args={[1.3, 2.6, 32]} />
                <meshStandardMaterial color={color} roughness={0.3} metalness={0.1} />
            </mesh>
        ),
    },
    {
        id: 'cylinder',
        name: 'Cylinder',
        color: '#C3A6FF',
        icon: '🥫',
        faces: 3,
        edges: 2,
        vertices: 0,
        fact: 'A cylinder looks like a can of soup!',
        component: ({ color }) => (
            <mesh castShadow>
                <cylinderGeometry args={[1.1, 1.1, 2.4, 32]} />
                <meshStandardMaterial color={color} roughness={0.3} metalness={0.1} />
            </mesh>
        ),
    },
    {
        id: 'pyramid',
        name: 'Pyramid',
        color: '#FFE66D',
        icon: '🔷',
        faces: 5,
        edges: 8,
        vertices: 5,
        fact: 'The Great Pyramids of Egypt are this shape!',
        component: ({ color }) => (
            <mesh castShadow>
                <coneGeometry args={[1.5, 2.5, 4]} />
                <meshStandardMaterial color={color} roughness={0.3} metalness={0.1} />
            </mesh>
        ),
    },
    {
        id: 'torus',
        name: 'Torus',
        color: '#F5C842',
        icon: '🍩',
        faces: '∞',
        edges: 0,
        vertices: 0,
        fact: 'A torus looks just like a donut!',
        component: ({ color }) => (
            <mesh castShadow>
                <torusGeometry args={[1.1, 0.45, 16, 64]} />
                <meshStandardMaterial color={color} roughness={0.3} metalness={0.1} />
            </mesh>
        ),
    },
];

function Shape3D({ shape }) {
    const ShapeComponent = shape.component;
    return (
        <Float speed={1.5} rotationIntensity={0.4} floatIntensity={0.5}>
            <ShapeComponent color={shape.color} />
        </Float>
    );
}

export default function ShapeExplorer() {
    const [activeId, setActiveId] = useState('cube');
    const { recordExplore } = useProgress();

    const activeShape = SHAPES_3D.find(s => s.id === activeId);

    const handleSelect = (id) => {
        setActiveId(id);
        recordExplore(id);
    };

    return (
        <div className="explorer-page">
            <div className="explorer-header">
                <h1 className="title-lg">🌐 3D Explorer</h1>
                <p className="body-sm" style={{ color: 'var(--text-mid)' }}>Drag to spin the shape!</p>
            </div>

            {/* 3D Canvas */}
            <div className="canvas-3d">
                <Canvas
                    camera={{ position: [0, 0, 5], fov: 50 }}
                    shadows
                    style={{ background: 'transparent' }}
                >
                    <ambientLight intensity={0.6} />
                    <directionalLight position={[5, 5, 5]} intensity={1.2} castShadow />
                    <pointLight position={[-5, -5, -5]} intensity={0.4} color={activeShape.color} />
                    <Suspense fallback={null}>
                        <Shape3D key={activeId} shape={activeShape} />
                        <Environment preset="city" />
                    </Suspense>
                    <OrbitControls
                        enableZoom={false}
                        enablePan={false}
                        autoRotate
                        autoRotateSpeed={2}
                    />
                </Canvas>

                {/* Gradient overlay at bottom */}
                <div className="canvas-fade" />
            </div>

            {/* Info Panel */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={activeId}
                    className="shape-info-panel"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                >
                    <div className="info-header">
                        <span className="info-icon">{activeShape.icon}</span>
                        <h2 className="title-md">{activeShape.name}</h2>
                    </div>
                    <p className="body-md info-fact">💡 {activeShape.fact}</p>
                    <div className="info-stats">
                        <div className="stat-chip">
                            <span className="stat-value">{activeShape.faces}</span>
                            <span className="stat-label">Faces</span>
                        </div>
                        <div className="stat-chip">
                            <span className="stat-value">{activeShape.edges}</span>
                            <span className="stat-label">Edges</span>
                        </div>
                        <div className="stat-chip">
                            <span className="stat-value">{activeShape.vertices}</span>
                            <span className="stat-label">Corners</span>
                        </div>
                    </div>
                </motion.div>
            </AnimatePresence>

            {/* Shape Selector */}
            <div className="shape-selector">
                {SHAPES_3D.map(shape => (
                    <motion.button
                        key={shape.id}
                        className={`shape-btn ${activeId === shape.id ? 'active' : ''}`}
                        style={{ '--shape-color': shape.color }}
                        onClick={() => handleSelect(shape.id)}
                        whileHover={{ scale: 1.08 }}
                        whileTap={{ scale: 0.93 }}
                    >
                        <span className="shape-btn-icon">{shape.icon}</span>
                        <span className="shape-btn-label">{shape.name}</span>
                    </motion.button>
                ))}
            </div>
        </div>
    );
}
