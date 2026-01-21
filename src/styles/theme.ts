import { createTheme } from '@mantine/core';
import type { MantineColorsTuple } from '@mantine/core';

const brandBlue: MantineColorsTuple = [
    '#e5f4ff',
    '#cde2ff',
    '#9bc2ff',
    '#64a0ff',
    '#3984fe',
    '#1d72fe',
    '#0969ff',
    '#0058e4',
    '#004ecc',
    '#0043b5',
];

const brandCyan: MantineColorsTuple = [
    '#e0fcff',
    '#bbf7fd',
    '#8df0f9',
    '#5ce9f5',
    '#35e3f2',
    '#1adfef',
    '#00dcea',
    '#00c4d1',
    '#00aeba',
    '#00969f',
];

export const theme = createTheme({
    primaryColor: 'brand',
    colors: {
        brand: brandBlue,
        accent: brandCyan,
    },
    fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    headings: {
        fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        fontWeight: '700',
    },
    defaultRadius: 'md',
    cursorType: 'pointer',
    other: {
        transitionDuration: '200ms',
    },
});
