import { Container, Title, Text, Group, Button, Box, Stack } from '@mantine/core';
import { IconArrowDown, IconBrandLinkedin } from '@tabler/icons-react';
import { motion } from 'framer-motion';
import { profile } from '../data/profile';

export function Hero() {
    return (
        <Box
            component="section"
            id="hero"
            style={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                position: 'relative',
                overflow: 'hidden',
            }}
        >
            <Container size="lg">
                <Stack align="center" gap="xl" ta="center">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                    >
                        <Text
                            size="sm"
                            tt="uppercase"
                            fw={600}
                            c="dimmed"
                            mb="md"
                            style={{ letterSpacing: '2px' }}
                        >
                            Welcome to my portfolio
                        </Text>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.4 }}
                    >
                        <Title
                            order={1}
                            size="4rem"
                            fw={700}
                            style={{ lineHeight: 1.1 }}
                        >
                            Hi, I'm{' '}
                            <span className="gradient-text">{profile.name}</span>
                        </Title>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.6 }}
                    >
                        <Title
                            order={2}
                            size="1.75rem"
                            fw={500}
                            c="dimmed"
                            maw={700}
                        >
                            DevOps Engineer & Cloud Architect
                        </Title>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.8 }}
                    >
                        <Text
                            size="lg"
                            c="dimmed"
                            maw={600}
                            style={{ lineHeight: 1.7 }}
                        >
                            {profile.tagline}
                        </Text>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 1 }}
                    >
                        <Group justify="center" gap="md" mt="xl">
                            <Button
                                component="a"
                                href="#contact"
                                size="lg"
                                radius="xl"
                                variant="gradient"
                                gradient={{ from: 'brand', to: 'accent', deg: 135 }}
                                leftSection={<IconBrandLinkedin size={20} />}
                            >
                                Get in touch
                            </Button>
                            <Button
                                component="a"
                                href="#about"
                                size="lg"
                                radius="xl"
                                variant="outline"
                                color="gray"
                            >
                                Learn more
                            </Button>
                        </Group>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.6, delay: 1.5 }}
                        style={{
                            position: 'absolute',
                            bottom: 40,
                            left: '50%',
                            transform: 'translateX(-50%)',
                        }}
                    >
                        <motion.a
                            href="#about"
                            animate={{ y: [0, 10, 0] }}
                            transition={{ duration: 2, repeat: Infinity }}
                            style={{ color: 'var(--text-muted)' }}
                        >
                            <IconArrowDown size={24} />
                        </motion.a>
                    </motion.div>
                </Stack>
            </Container>
        </Box>
    );
}
