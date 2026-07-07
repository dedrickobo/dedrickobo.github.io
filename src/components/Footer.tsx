import { IconBrandGithub, IconBrandLinkedin, IconMail } from '@tabler/icons-react';
import { profile } from '../data/profile';

export function Footer() {
    const year = new Date().getFullYear();
    return (
        <footer style={{ borderTop: '1px solid var(--line)' }}>
            <div
                className="container"
                style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: '1.5rem',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    paddingBlock: '2.5rem',
                }}
            >
                <div>
                    <p style={{ color: 'var(--ash-dim)', fontSize: '0.85rem', margin: 0 }}>
                        © {year} {profile.name} · Forged with intent.
                    </p>
                </div>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <a href={profile.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" style={{ color: 'var(--ash)', display: 'flex' }}>
                        <IconBrandLinkedin size={22} />
                    </a>
                    <a href={profile.github} target="_blank" rel="noopener noreferrer" aria-label="GitHub" style={{ color: 'var(--ash)', display: 'flex' }}>
                        <IconBrandGithub size={22} />
                    </a>
                    <a href={`mailto:${profile.email}`} aria-label="Email" style={{ color: 'var(--ash)', display: 'flex' }}>
                        <IconMail size={22} />
                    </a>
                </div>
            </div>
        </footer>
    );
}
