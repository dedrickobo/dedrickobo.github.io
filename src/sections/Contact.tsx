import { Container, Title, Text, Box, Group, SimpleGrid } from '@mantine/core';
import { IconBrandLinkedin, IconBrandGithub, IconMail, IconMapPin } from '@tabler/icons-react';
import { motion } from 'framer-motion';
import { profile } from '../data/profile';

export function Contact() {
    return (
        <Box component="section" id="contact" className="section">
            <Container size="md">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: true }}
                    style={{ textAlign: 'center' }}
                >
                    <Title className="section-title" mb="xl">Get In Touch</Title>
                    <Text c="dimmed" size="lg" maw={600} mx="auto" mb="xl">
                        Interested in working together? Feel free to reach out through any of these channels.
                    </Text>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    viewport={{ once: true }}
                >
                    <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="lg">
                        <Box className="glass-card" p="lg">
                            <Group gap="md">
                                <Box
                                    style={{
                                        width: 48,
                                        height: 48,
                                        borderRadius: 12,
                                        background: 'linear-gradient(135deg, var(--gradient-start), var(--gradient-end))',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                    }}
                                >
                                    <IconMail size={24} color="white" />
                                </Box>
                                <Box>
                                    <Text size="sm" c="dimmed">Email</Text>
                                    <Text
                                        component="a"
                                        href={`mailto:${profile.email}`}
                                        fw={500}
                                        style={{ textDecoration: 'none', color: 'inherit' }}
                                    >
                                        {profile.email}
                                    </Text>
                                </Box>
                            </Group>
                        </Box>

                        <Box className="glass-card" p="lg">
                            <Group gap="md">
                                <Box
                                    style={{
                                        width: 48,
                                        height: 48,
                                        borderRadius: 12,
                                        background: 'linear-gradient(135deg, #0A66C2, #0078D4)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                    }}
                                >
                                    <IconBrandLinkedin size={24} color="white" />
                                </Box>
                                <Box>
                                    <Text size="sm" c="dimmed">LinkedIn</Text>
                                    <Text
                                        component="a"
                                        href={profile.linkedin}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        fw={500}
                                        style={{ textDecoration: 'none', color: 'inherit' }}
                                    >
                                        linkedin.com/in/dedrickk
                                    </Text>
                                </Box>
                            </Group>
                        </Box>

                        <Box className="glass-card" p="lg">
                            <Group gap="md">
                                <Box
                                    style={{
                                        width: 48,
                                        height: 48,
                                        borderRadius: 12,
                                        background: 'linear-gradient(135deg, #333, #666)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                    }}
                                >
                                    <IconBrandGithub size={24} color="white" />
                                </Box>
                                <Box>
                                    <Text size="sm" c="dimmed">GitHub</Text>
                                    <Text
                                        component="a"
                                        href={profile.github}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        fw={500}
                                        style={{ textDecoration: 'none', color: 'inherit' }}
                                    >
                                        github.com/dedrickobo
                                    </Text>
                                </Box>
                            </Group>
                        </Box>

                        <Box className="glass-card" p="lg">
                            <Group gap="md">
                                <Box
                                    style={{
                                        width: 48,
                                        height: 48,
                                        borderRadius: 12,
                                        background: 'linear-gradient(135deg, #00dcea, #0969ff)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                    }}
                                >
                                    <IconMapPin size={24} color="white" />
                                </Box>
                                <Box>
                                    <Text size="sm" c="dimmed">Location</Text>
                                    <Text fw={500}>{profile.location}</Text>
                                </Box>
                            </Group>
                        </Box>
                    </SimpleGrid>
                </motion.div>
            </Container>
        </Box>
    );
}
