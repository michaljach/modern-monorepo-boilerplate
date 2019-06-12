module.exports = {
  roots: [
    'packages/',
  ],
  "transform": {
    "^.+\\.tsx?$": "ts-jest"
  },
  "setupFilesAfterEnv": ["<rootDir>/setupTests.ts"]
}