import { Container, Text, Box } from '@mantine/core';
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
                <Text size="sm" c="dimmed" ta="center">
                    © {currentYear} {profile.name}. All rights reserved.
                </Text>
            </Container>
        </Box>
    );
}
