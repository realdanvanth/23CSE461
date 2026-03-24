function ProductDescription() {
    return (
        <div className="product-page">
            <h1 className="page-title">About This Product</h1>

            <section className="section">
                <h2>Course Information</h2>
                <div className="info-card">
                    <p><strong>Course Code:</strong> 23CSE461</p>
                    <p><strong>Course Name:</strong> Web Application Development Lab</p>
                    <p><strong>Course Teacher:</strong> Dr. T. Senthil Kumar</p>
                    <p><strong>Designation:</strong> Professor</p>
                    <p><strong>Institution:</strong> Amrita School of Computing, Amrita Vishwa Vidyapeetham</p>
                    <p><strong>Location:</strong> Coimbatore - 641112</p>
                    <p><strong>Email:</strong> t_senthilkumar@cb.amrita.edu</p>
                </div>
            </section>

            <section className="section">
                <h2>Team Members</h2>
                <div className="team-grid">
                    <div className="team-member">
                        <div className="member-avatar">👨‍💻</div>
                        <h3>Student Name</h3>
                        <p><strong>Roll No:</strong> CB.SC.U4CSE23241</p>
                        <p><strong>Role:</strong> Lead Developer</p>
                    </div>
                    {/* Add more team members as needed */}
                </div>
            </section>

            <section className="section">
                <h2>Product Overview</h2>
                <div className="info-card">
                    <h3>Math Learning Portal for Autism Kids</h3>
                    <p>
                        An interactive web application designed specifically for children with autism
                        to learn mathematical concepts through engaging games and visual activities.
                    </p>

                    <h4>Why This Portal is Required for Autism Kids</h4>
                    <ul>
                        <li>Autism children often struggle with traditional teaching methods</li>
                        <li>Visual and interactive learning helps maintain attention and engagement</li>
                        <li>Repetitive patterns and structured activities align with autism learning preferences</li>
                        <li>Immediate feedback helps reinforce correct responses</li>
                        <li>Self-paced learning reduces anxiety and pressure</li>
                    </ul>

                    <h4>Challenges Addressed</h4>
                    <ul>
                        <li><strong>Attention Span:</strong> Short, focused game sessions maintain engagement</li>
                        <li><strong>Social Communication:</strong> Non-verbal, visual-based learning reduces communication barriers</li>
                        <li><strong>Sensory Processing:</strong> Calm colors and controlled animations prevent sensory overload</li>
                        <li><strong>Pattern Recognition:</strong> Games specifically designed to improve this skill</li>
                        <li><strong>Memory Retention:</strong> Repetitive gameplay strengthens memory pathways</li>
                    </ul>

                    <h4>Highlights and Novelty</h4>
                    <ul>
                        <li>🎨 <strong>Autism-Friendly Design:</strong> Calm color schemes, no flashing or overwhelming animations</li>
                        <li>📊 <strong>Progress Visualization:</strong> Track improvements visually with charts</li>
                        <li>🎯 <strong>Adaptive Difficulty:</strong> Games adjust to player's skill level</li>
                        <li>💡 <strong>Multi-Sensory Feedback:</strong> Visual, text, and emoji-based feedback</li>
                        <li>🔄 <strong>Repetitive Learning:</strong> Games encourage healthy repetition for mastery</li>
                    </ul>

                    <h4>Importance of Visualization</h4>
                    <p>
                        Visual representations are crucial for autism learning because:
                    </p>
                    <ul>
                        <li>Visual processing is often a strength in autism individuals</li>
                        <li>Concrete visual objects help understand abstract math concepts</li>
                        <li>Progress charts provide motivating visual feedback</li>
                        <li>Color-coded elements help with categorization and memory</li>
                        <li>Visual patterns are easier to recognize than verbal instructions</li>
                    </ul>
                </div>
            </section>

            <section className="section">
                <h2>Technical Details</h2>
                <div className="info-card">
                    <p><strong>GitHub Repository:</strong> <a href="#">github.com/username/autism-math-game</a></p>
                    <p><strong>Technology Stack:</strong> ReactJS, React Router, Recharts, CSS3</p>
                    <p><strong>Collaborator - Academic:</strong> Dr. T. Senthil Kumar (Amrita School of Computing)</p>
                    <p><strong>Collaborator - Industry:</strong> [To be updated]</p>
                </div>
            </section>
        </div>
    )
}

export default ProductDescription
