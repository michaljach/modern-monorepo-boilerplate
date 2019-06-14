module.exports = {
  roots: [
    'packages/',
  ],
  "transform": {
    "^.+\\.tsx?$": "ts-jest"
  },
  "moduleNameMapper": {
    "@namespace/(.*)": "<rootDir>/packages/$1/src",
  },
  "setupFilesAfterEnv": ["<rootDir>/setupTests.ts"]
}