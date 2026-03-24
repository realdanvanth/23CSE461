import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './ResearchPage.css';

const PAPERS = [
    {
        id: 1,
        emoji: '🧠',
        color: '#4ECDC4',
        tag: 'Peer-Reviewed · PubMed / Frontiers in Human Neuroscience (2020)',
        title: 'Spatial Perspective-Taking in Children With ASD: The Predictive Role of Visuospatial and Motor Abilities',
        pubmedUrl: 'https://pubmed.ncbi.nlm.nih.gov/32581750/',
        fullUrl: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC7286568/',
        findings: [
            'Children with ASD showed significant differences in spatial perspective-taking compared with typically developing peers.',
            'Spatial task performance was predicted by fine motor skills and visuospatial working memory — both foundational for geometry.',
            'Interventions targeting visuospatial ability and motor coordination may scaffold the spatial reasoning needed for geometry learning.',
        ],
        appImplication: 'Our Geometry Mode builds visuospatial ability directly — placing vertices, judging distances, and visualising polygons all exercise the same skills identified in this study.',
        autismTip: '🌟 Pair drawing activities with motor tasks (e.g. tracing shapes with fingers) to strengthen the fine-motor/spatial link.',
    },
    {
        id: 2,
        emoji: '🏫',
        color: '#C3A6FF',
        tag: 'Systematic Review · PMC (2022)',
        title: 'Strategies in Supporting Inclusive Education for Autistic Students',
        pubmedUrl: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC9620685/',
        fullUrl: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC9620685/',
        findings: [
            'Classroom-level instructional adaptations and didactic strategies are essential to support autistic learners in grasping complex concepts like geometry.',
            'Modifications to content delivery, pacing, and environment significantly improve comprehension outcomes.',
            'Professional development for teachers is a critical factor — educators who understand learner profiles adapt math instruction more effectively.',
        ],
        appImplication: 'The app\'s structured, predictable interface — with clear shape names, colour cues, and immediate feedback — directly reflects these inclusive education principles.',
        autismTip: '🌟 Use visual goals (e.g. "Build a pentagon today!") and predictable step-by-step routines to reduce cognitive load.',
    },
    {
        id: 3,
        emoji: '📐',
        color: '#FF6B6B',
        tag: 'Peer-Reviewed · Journal of Intelligence (2023)',
        title: 'Spatial Visualization Supports Students\' Math: Mechanisms for Spatial Transfer',
        pubmedUrl: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC10299554/',
        fullUrl: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC10299554/',
        findings: [
            'Embedding spatial visualization tasks (rotation, symmetry, construction) into math lessons improves measured learning outcomes.',
            'Physical tools — paper folding, mental rotation, interactive drawing — produce deeper understanding of spatial geometry.',
            'Strategies effective for general learners (concrete manipulatives, embedded spatial training) overlap strongly with autism-friendly instructional methods.',
        ],
        appImplication: 'Geometry Mode embeds exactly this spatial-visualization-within-math approach: students see perimeter, angles, and shape names emerge as they construct, not as abstract definitions.',
        autismTip: '🌟 Encourage students to predict the shape before closing it — "How many sides do you think you\'ve drawn?" supports metacognition.',
    },
    {
        id: 4,
        emoji: '✏️',
        color: '#F5C842',
        tag: 'Practice Guide · Kids Club ABA',
        title: 'Teaching Math to Students with Autism: Effective Strategies for Success',
        pubmedUrl: 'https://kidsclubaba.com/teaching-math-to-students-with-autism/',
        fullUrl: 'https://kidsclubaba.com/teaching-math-to-students-with-autism/',
        findings: [
            'Structured, predictable teaching approaches reduce anxiety and improve learning retention for autistic students.',
            'Autistic children are often strong visual learners — concrete, visible representations of math concepts are especially effective.',
            'Manipulatives, repetition, visual schedules, and clear concrete examples are key for geometry accessibility.',
        ],
        appImplication: 'The drag-and-drop shape palette gives a concrete manipulative feel in a digital medium, lowering the abstraction barrier while preserving visual clarity.',
        autismTip: '🌟 Celebrate each shape construction with a distinct reward (stars ⭐) — reinforcement schedules improve skill retention significantly.',
    },
    {
        id: 5,
        emoji: '📊',
        color: '#A8B5E0',
        tag: 'Qualitative Study · ResearchGate',
        title: 'Mathematics Learning on Geometry for Children with Autism',
        pubmedUrl: 'https://www.researchgate.net/publication/322907546_Mathematics_learning_on_geometry_for_children_with_autism',
        fullUrl: 'https://www.researchgate.net/publication/322907546_Mathematics_learning_on_geometry_for_children_with_autism',
        findings: [
            'Teachers modified lesson content, pacing, and behaviour supports to help autistic students access geometry concepts.',
            'Key challenges included difficulty focusing on abstract math ideas and need for frequent instructional adjustments.',
            'Real-world geometry learning is highly practical — students benefit from seeing shapes named and measured, not just described.',
        ],
        appImplication: 'The app\'s real-time math feedback (angle sums, perimeter, shape names) mirrors the "show, don\'t just tell" adaptations described in this study.',
        autismTip: '🌟 Let students lead — ask them to explain *why* something is a triangle. Verbalising spatial knowledge deepens understanding.',
    },
];

const TAKEAWAYS = [
    { icon: '👁️', title: 'Visual & Concrete Instruction', body: 'Use manipulatives and drawing tools to make abstract geometry tangible. (PMC 2023)' },
    { icon: '🤲', title: 'Motor + Spatial Integration', body: 'Strengthen visuospatial working memory and fine motor skills as geometry foundations. (PubMed 2020)' },
    { icon: '📋', title: 'Structured Routines', body: 'Predictable lesson structures, visual goals, and supportive prompts reduce cognitive load. (PMC 2022)' },
    { icon: '🔁', title: 'Immediate Feedback', body: 'Show angle sums, shape names, and perimeter in real time — not as abstractions. (ResearchGate)' },
    { icon: '⭐', title: 'Reinforcement Schedules', body: 'Reward each successful construction to improve skill retention over time. (Kids Club ABA)' },
    { icon: '🎓', title: 'Teacher Adaptations', body: 'Educators need training to adjust math instruction to autistic learners\' profiles. (PMC 2022)' },
];

export default function ResearchPage() {
    const [expanded, setExpanded] = useState(null);

    return (
        <div className="research-page">
            {/* Header */}
            <motion.div className="research-header"
                initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
                <h1 className="title-lg">📚 Research Foundation</h1>
                <p className="research-sub">
                    Evidence-based strategies for teaching spatial geometry to children with autism —
                    drawn from peer-reviewed literature and implemented in this app.
                </p>
            </motion.div>

            {/* Papers */}
            <div className="papers-grid">
                {PAPERS.map((p, idx) => (
                    <motion.div key={p.id} className="paper-card"
                        initial={{ opacity: 0, y: 24 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.08 }}>

                        <div className="paper-card-top" style={{ borderColor: p.color + '60' }}>
                            <div className="paper-emoji-wrap" style={{ background: p.color + '22' }}>
                                <span className="paper-emoji">{p.emoji}</span>
                            </div>
                            <div className="paper-meta">
                                <span className="paper-tag" style={{ color: p.color }}>{p.tag}</span>
                                <h3 className="paper-title">{p.title}</h3>
                            </div>
                        </div>

                        <ul className="paper-findings">
                            {p.findings.map((f, i) => (
                                <li key={i}><span className="finding-dot" style={{ background: p.color }} />{f}</li>
                            ))}
                        </ul>

                        <div className="paper-implication" style={{ borderColor: p.color + '60' }}>
                            <span className="implication-label">🔗 App connection</span>
                            <p>{p.appImplication}</p>
                        </div>

                        <AnimatePresence>
                            {expanded === p.id && (
                                <motion.div className="paper-tip"
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}>
                                    <p>{p.autismTip}</p>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <div className="paper-footer">
                            <button className="btn-tip" onClick={() => setExpanded(expanded === p.id ? null : p.id)}>
                                {expanded === p.id ? '▲ Hide tip' : '💡 Teaching tip'}
                            </button>
                            <div className="paper-links">
                                <a href={p.pubmedUrl} target="_blank" rel="noopener noreferrer" className="paper-link">
                                    🔗 View Source
                                </a>
                                {p.fullUrl !== p.pubmedUrl && (
                                    <a href={p.fullUrl} target="_blank" rel="noopener noreferrer" className="paper-link">
                                        📄 Full Text
                                    </a>
                                )}
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Key Takeaways */}
            <motion.div className="takeaways-section"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
                <h2 className="title-sm takeaways-title">🧩 Key Teaching Takeaways</h2>
                <div className="takeaways-grid">
                    {TAKEAWAYS.map((t, i) => (
                        <motion.div key={i} className="takeaway-card"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.6 + i * 0.06 }}>
                            <span className="takeaway-icon">{t.icon}</span>
                            <h4 className="takeaway-title">{t.title}</h4>
                            <p className="takeaway-body">{t.body}</p>
                        </motion.div>
                    ))}
                </div>
            </motion.div>

            {/* Citation footer */}
            <div className="citation-footer">
                <p className="body-sm" style={{ color: 'var(--text-light)', textAlign: 'center' }}>
                    Sources: PubMed/NCBI · PMC · ResearchGate · Kids Club ABA — all links open in a new tab.
                    This page summarises key findings; always refer to the original publications for full methodology.
                </p>
            </div>
        </div>
    );
}
