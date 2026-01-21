import { Container, Title, Text, Box, Group, Badge, SimpleGrid, ThemeIcon } from '@mantine/core';
import { IconServer, IconCloud, IconShield, IconDatabase, IconDeviceMobile, IconTopologyStar } from '@tabler/icons-react';
import { motion } from 'framer-motion';

const projects = [
    {
        title: "Multi-Cloud Infrastructure",
        description: "Designed and implemented hybrid cloud architecture spanning Azure and AWS, with automated failover and load balancing.",
        tags: ["Azure", "AWS", "Terraform", "High Availability"],
        icon: IconCloud,
        color: "blue",
        slideNumber: 1, // Links to title slide (no dedicated slide yet)
    },
    {
        title: "CI/CD Pipeline Automation",
        description: "Built end-to-end CI/CD pipelines using Jenkins and Azure DevOps, reducing deployment time by 70% with automated testing.",
        tags: ["Jenkins", "Azure DevOps", "Docker", "Git"],
        icon: IconServer,
        color: "cyan",
        slideNumber: 3,
    },
    {
        title: "Monitoring & Alerting System",
        description: "Implemented comprehensive monitoring solution using Zabbix and Grafana with Discord integration for real-time alerts.",
        tags: ["Zabbix", "Grafana", "ELK Stack"],
        icon: IconDatabase,
        color: "orange",
        slideNumber: 8,
    },
    {
        title: "DevOps Infrastructure Template",
        description: "A production-ready infrastructure template designed to streamline DevOps workflows with AI integration, featuring Docker Compose services, reverse proxies, and monitoring stacks.",
        tags: ["Docker", "AI Integration", "Traefik", "Prometheus", "Template"],
        icon: IconShield,
        color: "green",
        slideNumber: 4,
    },
    {
        title: "Kopitiam Dewi",
        description: "A mobile ordering and cashless payment system for a coffee shop, featuring product menus, order management, and secure payment processing.",
        tags: ["Kotlin", "Android Studio", "Mobile App", "Firebase"],
        icon: IconDeviceMobile,
        color: "violet",
        slideNumber: 2,
    },
    {
        title: "Cloud Architecture Designs",
        description: "Designed enterprise-grade AWS architectures featuring VPCs, Elastic Load Balancers, NAT Gateways, RDS databases, and multi-AZ deployments for high availability.",
        tags: ["AWS", "VPC", "ELB", "RDS", "Architecture"],
        icon: IconTopologyStar,
        color: "teal",
        slideNumber: 7,
    },
];

export function Projects() {
    return (
        <Box component="section" id="projects" className="section">
            <Container size="lg">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: true }}
                >
                    <Title className="section-title" mb="xl">Projects</Title>
                    <Text c="dimmed" size="lg" maw={600} mb="xl">
                        Key projects showcasing DevOps and cloud infrastructure expertise
                    </Text>
                </motion.div>

                <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="lg" mt="xl">
                    {projects.map((project, index) => (
                        <motion.div
                            key={project.title}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            viewport={{ once: true }}
                        >
                            <a
                                href={`https://docs.google.com/presentation/d/1WCqIPD8nUZZ9g2wZEFY3esKntoLp0iAgOOGtHuTY7uI/edit#slide=id.p${project.slideNumber}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{ textDecoration: 'none', color: 'inherit', display: 'block', height: '100%' }}
                            >
                                <Box className="glass-card" p="xl" h="100%" style={{ cursor: 'pointer', transition: 'transform 0.2s, box-shadow 0.2s' }}>
                                    <Group gap="md" mb="md">
                                        <ThemeIcon
                                            size="xl"
                                            radius="md"
                                            variant="gradient"
                                            gradient={{ from: 'brand', to: 'accent', deg: 135 }}
                                        >
                                            <project.icon size={24} />
                                        </ThemeIcon>
                                        <Title order={4}>{project.title}</Title>
                                    </Group>

                                    <Text size="sm" c="dimmed" mb="lg" style={{ lineHeight: 1.7 }}>
                                        {project.description}
                                    </Text>

                                    <Group gap="xs">
                                        {project.tags.map((tag) => (
                                            <Badge key={tag} variant="light" color="brand" size="sm">
                                                {tag}
                                            </Badge>
                                        ))}
                                    </Group>
                                </Box>
                            </a>
                        </motion.div>
                    ))}
                </SimpleGrid>
            </Container>
        </Box>
    );
}
