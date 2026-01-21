import { Container, Title, Text, Box, Group, Badge, List } from '@mantine/core';
import { IconBuilding, IconCalendar, IconCheck } from '@tabler/icons-react';
import { motion } from 'framer-motion';
import { experiences } from '../data/profile';

export function Experience() {
    return (
        <Box component="section" id="experience" className="section">
            <Container size="lg">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: true }}
                >
                    <Title className="section-title" mb="xl">Experience</Title>
                    <Text c="dimmed" size="lg" maw={600} mb="xl">
                        A journey through infrastructure, cloud, and DevOps roles
                    </Text>
                </motion.div>

                <Box className="timeline" mt="xl">
                    {experiences.map((exp, index) => (
                        <motion.div
                            key={`${exp.company}-${exp.title}`}
                            className={`timeline-item ${exp.current ? 'current' : ''}`}
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            viewport={{ once: true }}
                        >
                            <Box className="glass-card" p="xl" ml="md">
                                <Group justify="space-between" align="flex-start" wrap="wrap" mb="sm">
                                    <Box>
                                        <Title order={4} mb={4}>
                                            {exp.title}
                                        </Title>
                                        <Group gap="xs">
                                            <IconBuilding size={16} color="var(--text-muted)" />
                                            <Text size="sm" c="dimmed">{exp.company}</Text>
                                        </Group>
                                    </Box>

                                    <Group gap="xs">
                                        <IconCalendar size={14} color="var(--text-muted)" />
                                        <Badge
                                            variant={exp.current ? 'gradient' : 'light'}
                                            gradient={{ from: 'brand', to: 'accent', deg: 135 }}
                                            color={exp.current ? undefined : 'gray'}
                                        >
                                            {exp.period}
                                        </Badge>
                                    </Group>
                                </Group>

                                <List
                                    spacing="xs"
                                    size="sm"
                                    c="dimmed"
                                    mt="md"
                                    icon={
                                        <IconCheck size={14} color="var(--gradient-start)" />
                                    }
                                >
                                    {exp.description.map((item, i) => (
                                        <List.Item key={i}>{item}</List.Item>
                                    ))}
                                </List>
                            </Box>
                        </motion.div>
                    ))}
                </Box>
            </Container>
        </Box>
    );
}
