import { Container, Title, Text, Box, Group, Badge, SimpleGrid } from '@mantine/core';
import { IconCertificate, IconCalendar } from '@tabler/icons-react';
import { motion } from 'framer-motion';
import { certifications } from '../data/profile';

const badgeColors: Record<string, { from: string; to: string }> = {
    azure: { from: '#0078D4', to: '#00BCF2' },
    aws: { from: '#FF9900', to: '#FFB84D' },
    redhat: { from: '#EE0000', to: '#FF4D4D' },
    cisco: { from: '#049FD9', to: '#4DC3F0' },
    mikrotik: { from: '#293239', to: '#4A5568' },
};

export function Certifications() {
    return (
        <Box component="section" id="certifications" className="section">
            <Container size="lg">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: true }}
                >
                    <Title className="section-title" mb="xl">Certifications</Title>
                    <Text c="dimmed" size="lg" maw={600} mb="xl">
                        Industry-recognized certifications validating expertise in cloud and infrastructure
                    </Text>
                </motion.div>

                <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing="lg" mt="xl">
                    {certifications.map((cert, index) => (
                        <motion.div
                            key={cert.name}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            viewport={{ once: true }}
                        >
                            <Box
                                className={`glass-card cert-${cert.badge}`}
                                p="lg"
                                h="100%"
                                style={{
                                    borderLeftWidth: '4px',
                                    borderLeftStyle: 'solid',
                                    borderLeftColor: badgeColors[cert.badge]?.from || 'var(--gradient-start)',
                                }}
                            >
                                <Group gap="sm" mb="sm">
                                    <IconCertificate
                                        size={20}
                                        color={badgeColors[cert.badge]?.from || 'var(--gradient-start)'}
                                    />
                                    <Badge
                                        variant="gradient"
                                        gradient={badgeColors[cert.badge]}
                                        size="sm"
                                    >
                                        {cert.issuer}
                                    </Badge>
                                </Group>

                                <Title order={5} mb="sm" fw={600}>
                                    {cert.name}
                                </Title>

                                <Group gap="xs">
                                    <IconCalendar size={14} color="var(--text-muted)" />
                                    <Text size="xs" c="dimmed">
                                        {cert.date}
                                    </Text>
                                </Group>
                            </Box>
                        </motion.div>
                    ))}
                </SimpleGrid>
            </Container>
        </Box>
    );
}
