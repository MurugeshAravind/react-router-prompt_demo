import type { Config } from 'jest';

const config: Config = {
    rootDir: './',
    testEnvironment: 'jest-fixed-jsdom',
    setupFilesAfterEnv: ['<rootDir>/test/jest.setup.ts'],
    transform: {
        '^.+\\.(ts|tsx)$': 'ts-jest',  
    },
    moduleNameMapper: {
        '\\.(gif|ttf|eot|png|svg)$': '<rootDir>/test/__mocks__/fileMock.ts',
    }
}

export default config;