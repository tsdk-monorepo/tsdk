# test-config

Usage:

First, add `"@acme/test-config": "*"` to the `package.json` devDependencies:

```json
{
  "devDependencies": {
    "@acme/test-config": "*",
    "test": "cross-env NODE_ENV=test TS_CONFIG_PATHS=true ts-mocha -p tsconfig.json ./**/*.test.ts --parallel --timeout 30000"
  }
}
```

And add the below to the scripts

```json
{
  "scripts": {
    "test": "cross-env NODE_ENV=test TS_CONFIG_PATHS=true ts-mocha -p tsconfig.json ./**/*.test.ts --parallel --timeout 30000"
  }
}
```
