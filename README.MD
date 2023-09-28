# @flex/framework

A GraphQL API and Serverless Backend for Flex Framework.

## Installation

```bash
npm install -g serverless
npm install --save-dev serverless-bundle
npm install --save-dev serverless-add-api-key
npm i --save-dev serverless-offline
npm i --save-dev serverless-offline-aws-eventbridge
```


## Scripts

- `prepare` - Installs husky and creates a mongo-data directory
- `test` - Runs Jest tests
- `test:coverage` - Runs Jest tests and generates a coverage report
- `precommit` - Runs lint-staged
- `dev` - Runs serverless-offline

## Adding Data Models

- Schema + Graph in packages/db/schemas/<NAME>
- import and use in packages/db/models.js
- import and use in packages/db/graph/buildGraphSchema.js


