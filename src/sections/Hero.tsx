import { motion, useReducedMotion } from 'framer-motion';
import { IconArrowDown, IconArrowRight, IconMail } from '@tabler/icons-react';
import { profile } from '../data/profile';

export function Hero() {
    const reduce = useReducedMotion();
    const anim = (delay: number) =>
        reduce ? {} : {
            initial: { opacity: 0, y: 24 },
            animate: { opacity: 1, y: 0 },
            transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] as const, delay },
        };

    return (
        <section
            id="hero"
            style={{ minHeight: '100svh', display: 'flex', alignItems: 'center', position: 'relative', overflow: 'hidden', paddingTop: '6rem', paddingBottom: '3rem' }}
        >
            <div className="container" style={{ position: 'relative', zIndex: 1 }}>
                {/* Text holds the left; the 3D Brand of Sacrifice breathes in the right field. */}
                <div style={{ maxWidth: 640 }}>
                    <motion.div {...anim(0.05)}>
                        <p className="mono" style={{ display: 'flex', alignItems: 'center', gap: '0.6ch', fontSize: '0.85rem', color: 'var(--ash)', margin: '0 0 1.6rem' }}>
                            <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--blood)', boxShadow: '0 0 10px var(--blood)' }} />
                            {profile.availability} · {profile.location.split(',')[0]}, ID · {profile.timezone}
                        </p>
                    </motion.div>

                    <motion.div {...anim(0.15)}>
                        <h1 className="display" style={{ fontSize: 'var(--fs-hero)', color: 'var(--bone)', margin: 0 }}>
                            {profile.name.replace(/\.$/, '')}
                            <span style={{ color: 'var(--blood-bright)' }}>.</span>
                        </h1>
                    </motion.div>

                    <motion.div {...anim(0.28)}>
                        <p style={{ fontSize: 'var(--fs-h3)', fontWeight: 600, color: 'var(--ash)', margin: '1rem 0 0' }}>
                            {profile.roleTitle} <span style={{ color: 'var(--ash-dim)' }}>@</span>{' '}
                            <span style={{ color: 'var(--bone)', fontWeight: 700 }}>{profile.roleAt}</span>
                        </p>
                    </motion.div>

                    <motion.div {...anim(0.4)}>
                        <p className="pretty" style={{ maxWidth: '52ch', fontSize: 'var(--fs-lead)', color: 'var(--ash)', lineHeight: 1.6, margin: '1.25rem 0 0' }}>
                            {profile.tagline}
                        </p>
                    </motion.div>

                    <motion.div {...anim(0.5)}>
                        <p className="mono" style={{ fontSize: '0.8rem', color: 'var(--ash-dim)', margin: '1.25rem 0 0' }}>
                            AWS Solutions Architect · RHCSA · CCNA · Azure
                        </p>
                    </motion.div>

                    <motion.div {...anim(0.62)}>
                        <div style={{ display: 'flex', gap: '0.9rem', flexWrap: 'wrap', margin: '1.75rem 0 0' }}>
                            <a href="#projects" className="btn btn-blood">View work <IconArrowRight size={17} /></a>
                            <a href="#contact" className="btn btn-ghost"><IconMail size={17} /> Get in touch</a>
                        </div>
                    </motion.div>
                </div>
            </div>

            {!reduce && (
                <motion.a
                    href="#about" aria-label="Scroll to about"
                    animate={{ y: [0, 10, 0] }} transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                    style={{ position: 'absolute', bottom: 24, left: '50%', transform: 'translateX(-50%)', color: 'var(--ash-dim)', zIndex: 1 }}
                >
                    <IconArrowDown size={22} />
                </motion.a>
            )}
        </section>
    );
}
