from pathlib import Path

repo = Path('/home/openclaw/.openclaw/workspace/anujsh-temp')
index = repo / 'index.html'
text = index.read_text()

text = text.replace('''        <div class="nav-links">
            <a href="#proof">proof</a>
            <a href="#work">work</a>
            <a href="#experience">experience</a>
            <a href="#skills">skills</a>
            <a href="#about">about</a>
            <a href="#contact">contact</a>
            <button class="nav-resume" id="resumeBtn">resume ↓</button>
        </div>''', '''        <div class="nav-links">
            <a href="#proof">proof</a>
            <a href="#work">work</a>
            <a href="#experience">experience</a>
            <a href="#craft">craft</a>
            <a href="#principles">principles</a>
            <a href="#contact">contact</a>
            <button class="nav-resume" id="resumeBtn">resume ↓</button>
        </div>''')

text = text.replace('''    <div class="mobile-menu" id="mobileMenu">
        <a href="#proof">proof</a>
        <a href="#work">work</a>
        <a href="#experience">experience</a>
        <a href="#skills">skills</a>
        <a href="#about">about</a>
        <a href="#contact">contact</a>
        <button class="mobile-resume" id="mobileResumeBtn">resume ↓</button>
    </div>''', '''    <div class="mobile-menu" id="mobileMenu">
        <a href="#proof">proof</a>
        <a href="#work">work</a>
        <a href="#experience">experience</a>
        <a href="#craft">craft</a>
        <a href="#principles">principles</a>
        <a href="#contact">contact</a>
        <button class="mobile-resume" id="mobileResumeBtn">resume ↓</button>
    </div>''')

start = text.index('        <section class="experience" id="experience">')
end = text.index('    </main>')
replacement = '''        <section class="experience" id="experience">
            <h2 class="section-title">Experience</h2>
            <h3 class="section-lead">Roles where I shipped, led, and cleaned up the hard bits.</h3>
            <div class="experience-list">
                <article class="experience-card fade-in">
                    <div class="experience-brand single-brand light-brand">
                        <img src="assets/logos/delta.svg" alt="Delta Exchange logo">
                    </div>
                    <div class="experience-copy">
                        <span class="experience-period">2025 — present</span>
                        <h3>Senior AI Engineer FullStack · delta.exchange</h3>
                        <p>Building AI support and product workflows for a crypto derivatives platform where correctness and responsiveness both matter.</p>
                    </div>
                </article>

                <article class="experience-card fade-in">
                    <div class="experience-brand single-brand light-brand">
                        <img src="assets/logos/saral.svg" alt="Saral logo">
                    </div>
                    <div class="experience-copy">
                        <span class="experience-period">Nov 2024 — Jul 2025</span>
                        <h3>Senior Software Engineer · Saral</h3>
                        <p>Built social listening and influencer workflow tooling, shipped AI features like intelligent naming, sentiment analysis, and address detection, and tightened CI + delivery confidence.</p>
                    </div>
                </article>

                <article class="experience-card fade-in">
                    <div class="experience-brand dual-brand light-brand">
                        <img src="assets/logos/dukaan.svg" alt="Dukaan logo">
                        <img src="assets/logos/bot9.svg" alt="Bot9 logo">
                    </div>
                    <div class="experience-copy">
                        <span class="experience-period">Jan 2021 — May 2024</span>
                        <h3>Technical Lead · MyDukaan.io / Bot9.ai</h3>
                        <p>First frontend engineer in the room, later a lead. Scaled the product from MVP to 40+ production features, served 60k+ merchants, built Bot9’s conversational AI product, and helped grow the team from 1 to 15+ developers.</p>
                    </div>
                </article>

                <article class="experience-card fade-in">
                    <div class="experience-brand text-brand">
                        <span>React · Angular · Vue · React Native · Kotlin</span>
                    </div>
                    <div class="experience-copy">
                        <span class="experience-period">Feb 2018 — Jan 2021</span>
                        <h3>Software Engineer · Service companies</h3>
                        <p>Cut teeth across frontend delivery, mobile apps, and ETL-heavy enterprise work. Good place to learn how to ship under constraints and not panic when requirements move.</p>
                    </div>
                </article>
            </div>
        </section>

        <section class="craft" id="craft">
            <h2 class="section-title">Craft</h2>
            <h3 class="section-lead">What I actually bring to a team.</h3>
            <div class="craft-grid">
                <article class="craft-card fade-in">
                    <h3>Product-minded frontend</h3>
                    <p>React, Next.js, TypeScript, motion, responsive systems, and interfaces that feel thought-through instead of assembled.</p>
                </article>
                <article class="craft-card fade-in">
                    <h3>AI with product sense</h3>
                    <p>LLM APIs, RAG, Pinecone, prompt/tool workflows, evaluation instincts, and a healthy allergy to gimmicks.</p>
                </article>
                <article class="craft-card fade-in">
                    <h3>Full-stack execution</h3>
                    <p>Node.js, Express, MongoDB, Redis, WebSockets, auth flows, infrastructure glue, and the parts nobody shows in launch tweets.</p>
                </article>
                <article class="craft-card fade-in">
                    <h3>Leadership without theatre</h3>
                    <p>Mentoring, hiring loops, review culture, support SOPs, and helping teams move faster without lowering standards.</p>
                </article>
            </div>
        </section>

        <section class="principles" id="principles">
            <h2 class="section-title">Principles</h2>
            <h3 class="section-lead">My bias is simple: make it useful, then make it beautiful, then make it harder to break.</h3>
            <div class="principles-grid">
                <article class="principle-card fade-in">
                    <span class="principle-number">01</span>
                    <h3>Interfaces should feel obvious.</h3>
                    <p>If someone needs a walkthrough for the happy path, the product is still lying to itself.</p>
                </article>
                <article class="principle-card fade-in">
                    <span class="principle-number">02</span>
                    <h3>Speed is a product feature.</h3>
                    <p>Not just render time — decision speed, iteration speed, support speed, and how quickly a team can ship the next thing.</p>
                </article>
                <article class="principle-card fade-in">
                    <span class="principle-number">03</span>
                    <h3>Details earn trust.</h3>
                    <p>Copy, empty states, spacing, failure modes, keyboard flows — the stuff people call “small” is usually doing the trust-building.</p>
                </article>
            </div>
        </section>

        <section class="contact" id="contact">
            <h2 class="section-title">Contact</h2>
            <h3 class="section-lead">Need someone who can ship the product and make it feel good?</h3>
            <div class="contact-content contact-content-ref">
                <p class="contact-text">
                    I’m always up for smart product conversations, sharp design discussions, and ambitious internet ideas that need both engineering depth and taste.
                </p>
                <div class="contact-links contact-links-minimal">
                    <a href="mailto:me@anujsh.com" class="contact-link contact-link-minimal">me@anujsh.com</a>
                    <a href="https://github.com/ptmaroct" target="_blank" rel="noopener" class="contact-link contact-link-minimal">GitHub</a>
                    <a href="https://www.linkedin.com/in/ptmaroct/" target="_blank" rel="noopener" class="contact-link contact-link-minimal">LinkedIn</a>
                    <a href="https://x.com/waahbete" target="_blank" rel="noopener" class="contact-link contact-link-minimal">X / Twitter</a>
                    <a href="https://www.anujsh.com/" target="_blank" rel="noopener" class="contact-link contact-link-minimal">anujsh.com</a>
                </div>
            </div>
        </section>
'''
text = text[:start] + replacement + text[end:]
index.write_text(text)

styles_path = repo / 'styles.css'
styles = styles_path.read_text()
start = styles.index('/* Skills */')
end = styles.index('/* Footer */')
replacement = '''/* Section Leads */
.section-lead {
    font-size: clamp(1.6rem, 3vw, 2.3rem);
    font-weight: 600;
    line-height: 1.2;
    letter-spacing: -0.03em;
    margin: -1.75rem 0 2.25rem;
    max-width: 820px;
}

/* Craft */
.craft-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
    gap: 1.25rem;
}

.craft-card,
.principle-card {
    background: var(--bg-secondary);
    border: 1px solid var(--border);
    border-radius: 10px;
    padding: 1.5rem;
    transition: border-color var(--transition), transform var(--transition);
}

.craft-card:hover,
.principle-card:hover {
    border-color: var(--border-hover);
    transform: translateY(-2px);
}

.craft-card h3,
.principle-card h3 {
    font-size: 1.15rem;
    margin-bottom: 0.75rem;
}

.craft-card p,
.principle-card p {
    color: var(--text-secondary);
    line-height: 1.75;
}

/* Principles */
.principles-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 1.25rem;
}

.principle-number {
    display: inline-block;
    font-family: var(--font-mono);
    color: var(--accent);
    font-size: 0.8rem;
    margin-bottom: 1rem;
    letter-spacing: 0.12em;
}

/* Contact */
.contact-content {
    text-align: center;
    max-width: 760px;
    margin: 0 auto;
}

.contact-content-ref {
    max-width: 820px;
}

.contact-text {
    font-size: 1.1rem;
    color: var(--text-secondary);
    margin-bottom: 2.5rem;
    line-height: 1.8;
}

.contact-links {
    display: flex;
    justify-content: center;
    gap: 1rem;
    flex-wrap: wrap;
}

.contact-link {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    background: var(--bg-secondary);
    border: 1px solid var(--border);
    padding: 0.85rem 1.3rem;
    border-radius: 999px;
    transition: all var(--transition);
}

.contact-link:hover {
    border-color: var(--accent);
    transform: translateY(-2px);
}

.contact-links-minimal .contact-link-minimal {
    font-size: 0.95rem;
    color: var(--text-primary);
}

.contact-links-minimal .contact-link-minimal:hover {
    color: var(--accent);
}

'''
styles = styles[:start] + replacement + styles[end:]
styles = styles.replace('@media (max-width: 900px) {\n    .about-content {\n        grid-template-columns: 1fr;\n    }\n}\n\n', '@media (max-width: 900px) {\n    .section-lead {\n        margin-bottom: 2rem;\n    }\n}\n\n')
styles_path.write_text(styles)
print('updated files')
