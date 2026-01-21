import { Container, Text, Group, Box, Divider } from '@mantine/core';
import { IconHeart } from '@tabler/icons-react';
import { profile } from '../data/profile';

export function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <Box
            component="footer"
            py="xl"
            style={{
                borderTop: '1px solid var(--border-color)',
            }}
        >
            <Container size="lg">
                <Group justify="space-between" align="center">
                    <Text size="sm" c="dimmed">
                        © {currentYear} {profile.name}. All rights reserved.
                    </Text>
                    <Group gap="xs">
                        <Text size="sm" c="dimmed">
                            Built with
                        </Text>
                        <IconHeart size={14} color="var(--gradient-start)" fill="var(--gradient-start)" />
                        <Text size="sm" c="dimmed">
                            using React & Mantine
                        </Text>
                    </Group>
                </Group>
            </Container>
        </Box>
    );
}
