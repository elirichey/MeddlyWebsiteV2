require('@testing-library/jest-dom');

// Mock Next.js Image component
jest.mock('next/image', () => ({
  __esModule: true,
  default: ({ src, alt, ...props }) => {
    // eslint-disable-next-line @next/next/no-img-element
    return require('react').createElement('img', { src, alt, ...props });
  },
})); 