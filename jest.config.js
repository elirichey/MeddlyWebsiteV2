module.exports = {
	testEnvironment: 'jsdom',
	setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
	moduleNameMapper: {
		'^@/(.*)$': '<rootDir>/src/$1',
		'^@icons/(.*)$': '<rootDir>/src/components/Icons/$1',
		'\\.(css|less|scss|sass)$': 'identity-obj-proxy',
	},
	testMatch: ['**/__tests__/**/*.(ts|tsx|js)', '**/*.(test|spec).(ts|tsx|js)'],
	transform: {
		'^.+\\.(ts|tsx)$': [
			'ts-jest',
			{
				tsconfig: {
					jsx: 'react-jsx',
				},
			},
		],
	},
	collectCoverageFrom: ['src/**/*.{ts,tsx}', '!src/**/*.d.ts', '!src/**/*.stories.{ts,tsx}'],
	coverageThreshold: {
		global: {
			branches: 80,
			functions: 80,
			lines: 80,
			statements: 80,
		},
	},
	transformIgnorePatterns: ['node_modules/(?!(next|@next)/)'],
};
