import { Container, Text, Group, ActionIcon, Box, useMantineColorScheme } from '@mantine/core';
import { IconBrandGithub, IconBrandLinkedin, IconSun, IconMoon } from '@tabler/icons-react';
import { motion } from 'framer-motion';
import { profile } from '../data/profile';

export function Navbar() {
    const { colorScheme, toggleColorScheme } = useMantineColorScheme();
    const dark = colorScheme === 'dark';

    const navItems = ['About', 'Skills', 'Experience', 'Projects', 'Certifications', 'Contact'];

    return (
        <motion.nav
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                zIndex: 100,
                background: dark ? 'rgba(10, 10, 15, 0.8)' : 'rgba(248, 250, 252, 0.8)',
                backdropFilter: 'blur(10px)',
                borderBottom: '1px solid var(--border-color)',
            }}
        >
            <Container size="lg" py="md">
                <Group justify="space-between" align="center">
                    {/* Left - Spacer for balanced layout */}
                    <Box style={{ minWidth: '120px' }} />

                    {/* Center - Navigation */}
                    <Group gap="xl" visibleFrom="sm" style={{ position: 'absolute', left: '50%', transform: 'translateX(-50%)' }}>
                        {navItems.map((item) => (
                            <Text
                                key={item}
                                component="a"
                                href={`#${item.toLowerCase()}`}
                                size="sm"
                                c="dimmed"
                                style={{
                                    textDecoration: 'none',
                                    transition: 'color 0.2s ease',
                                }}
                                onMouseOver={(e) => e.currentTarget.style.color = 'var(--gradient-start)'}
                                onMouseOut={(e) => e.currentTarget.style.color = ''}
                            >
                                {item}
                            </Text>
                        ))}
                    </Group>

                    {/* Right - Social & Theme Toggle */}
                    <Group gap="xs" style={{ minWidth: '120px', justifyContent: 'flex-end' }}>
                        <ActionIcon
                            variant="subtle"
                            color="gray"
                            component="a"
                            href={profile.linkedin}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="LinkedIn"
                        >
                            <IconBrandLinkedin size={20} />
                        </ActionIcon>
                        <ActionIcon
                            variant="subtle"
                            color="gray"
                            component="a"
                            href={profile.github}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="GitHub"
                        >
                            <IconBrandGithub size={20} />
                        </ActionIcon>
                        <ActionIcon
                            variant="subtle"
                            color="gray"
                            onClick={toggleColorScheme}
                            aria-label="Toggle color scheme"
                        >
                            {dark ? <IconSun size={20} /> : <IconMoon size={20} />}
                        </ActionIcon>
                    </Group>
                </Group>
            </Container>
        </motion.nav>
    );
}
