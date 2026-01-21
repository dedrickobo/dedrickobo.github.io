import { Container, Title, Text, Box, Group, SimpleGrid } from '@mantine/core';
import {
    IconCloud,
    IconGitBranch,
    IconBox,
    IconSettings,
    IconChartBar,
    IconServer,
    IconNetwork,
    IconTools
} from '@tabler/icons-react';
import { motion } from 'framer-motion';
import { skills } from '../data/profile';

const categoryIcons: Record<string, React.ReactNode> = {
    'Cloud Providers': <IconCloud size={24} />,
    'CI/CD & Version Control': <IconGitBranch size={24} />,
    'Containers & Orchestration': <IconBox size={24} />,
    'Infrastructure as Code': <IconSettings size={24} />,
    'Monitoring & Logging': <IconChartBar size={24} />,
    'Systems & OS': <IconServer size={24} />,
    'Networking': <IconNetwork size={24} />,
    'Tools & Platforms': <IconTools size={24} />,
};

export function Skills() {
    return (
        <Box component="section" id="skills" className="section">
            <Container size="lg">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: true }}
                >
                    <Title className="section-title" mb="xl">Skills & Expertise</Title>
                    <Text c="dimmed" size="lg" maw={600} mb="xl">
                        A comprehensive toolkit for building and maintaining modern cloud infrastructure
                    </Text>
                </motion.div>

                <SimpleGrid cols={{ base: 1, sm: 2, lg: 4 }} spacing="lg" mt="xl">
                    {Object.entries(skills).map(([category, skillList], index) => (
                        <motion.div
                            key={category}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            viewport={{ once: true }}
                        >
                            <Box className="glass-card" p="lg" h="100%">
                                <Group gap="sm" mb="md" wrap="nowrap" align="flex-start">
                                    <Box
                                        style={{
                                            color: 'var(--gradient-start)',
                                            flexShrink: 0,
                                        }}
                                    >
                                        {categoryIcons[category]}
                                    </Box>
                                    <Title order={5} fw={600} style={{ lineHeight: 1.3 }}>{category}</Title>
                                </Group>

                                <Box>
                                    {skillList.map((skill) => (
                                        <Box
                                            key={skill}
                                            className="skill-badge"
                                            mr="xs"
                                            mb="xs"
                                        >
                                            {skill}
                                        </Box>
                                    ))}
                                </Box>
                            </Box>
                        </motion.div>
                    ))}
                </SimpleGrid>
            </Container>
        </Box>
    );
}
