import './styles/global.css';
import { lazy, Suspense, useEffect, useState } from 'react';
import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Navbar, Footer, Cursor } from './components';
import { Hero, About, Skills, Experience, BerserkStatement, Projects, Certifications, Contact } from './sections';
import { detectTier, type GfxTier } from './three/tier';

gsap.registerPlugin(ScrollTrigger);

// The WebGL layer ships as its own chunk, after first paint. The CSS backdrop
// beneath it is the no-WebGL / reduced-motion fallback.
const Scene = lazy(() => import('./three/Scene'));

function App() {
    const [tier, setTier] = useState<GfxTier>('off');

    useEffect(() => {
        setTier(detectTier());
    }, []);

    useEffect(() => {
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

        const lenis = new Lenis({ duration: 1.1, smoothWheel: true });
        lenis.on('scroll', ScrollTrigger.update);
        const tick = (time: number) => lenis.raf(time * 1000);
        gsap.ticker.add(tick);
        gsap.ticker.lagSmoothing(0);

        return () => {
            gsap.ticker.remove(tick);
            lenis.destroy();
        };
    }, []);

    return (
        <>
            <div className="backdrop" aria-hidden />
            {tier !== 'off' && (
                <Suspense fallback={null}>
                    <Scene tier={tier} />
                </Suspense>
            )}
            <div className="grain" aria-hidden />
            <Cursor />
            <Navbar />
            <main>
                <Hero />
                <About />
                <Skills />
                <Experience />
                <BerserkStatement />
                <Projects />
                <Certifications />
                <Contact />
            </main>
            <Footer />
        </>
    );
}

export default App;
