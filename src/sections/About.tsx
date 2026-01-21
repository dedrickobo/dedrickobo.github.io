import { Container, Title, Text, Grid, Box, Group, Badge } from '@mantine/core';
import { IconMapPin, IconBriefcase, IconSchool } from '@tabler/icons-react';
import { motion } from 'framer-motion';
import { profile, education } from '../data/profile';

export function About() {
    return (
        <Box component="section" id="about" className="section">
            <Container size="lg">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: true }}
                >
                    <Title className="section-title" mb="xl">About Me</Title>
                </motion.div>

                <Grid gutter="xl" mt="xl">
                    <Grid.Col span={{ base: 12, md: 7 }}>
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            viewport={{ once: true }}
                        >
                            <Text
                                size="lg"
                                c="dimmed"
                                style={{ lineHeight: 1.8 }}
                                mb="xl"
                            >
                                {profile.summary}
                            </Text>

                            <Group gap="lg" wrap="wrap">
                                <Group gap="xs">
                                    <IconMapPin size={18} color="var(--gradient-start)" />
                                    <Text size="sm" c="dimmed">{profile.location}</Text>
                                </Group>
                                <Group gap="xs">
                                    <IconBriefcase size={18} color="var(--gradient-start)" />
                                    <Text size="sm" c="dimmed">DevOps Engineer @ OneByOne</Text>
                                </Group>
                            </Group>
                        </motion.div>
                    </Grid.Col>

                    <Grid.Col span={{ base: 12, md: 5 }}>
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.4 }}
                            viewport={{ once: true }}
                        >
                            <Box className="glass-card" p="xl">
                                <Group gap="sm" mb="md">
                                    <IconSchool size={24} color="var(--gradient-start)" />
                                    <Title order={4}>Education</Title>
                                </Group>

                                <Text fw={600} mb={4}>{education.institution}</Text>
                                <Text size="sm" c="dimmed" mb={4}>
                                    {education.degree} in {education.field}
                                </Text>
                                <Group gap="sm" mt="sm">
                                    <Badge variant="light" color="brand">
                                        {education.period}
                                    </Badge>
                                    <Badge variant="light" color="accent">
                                        GPA: {education.gpa}
                                    </Badge>
                                </Group>
                            </Box>
                        </motion.div>
                    </Grid.Col>
                </Grid>
            </Container>
        </Box>
    );
}
