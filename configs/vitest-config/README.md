# vitest-config

Usage:

First, add `"@configs/vitest-config": "workspace:*"` to the `package.json` devDependencies:

```json
{
  "devDependencies": {
    "@configs/vitest-config": "workspace:*"
  }
}
```

And add the below to the scripts

```json
{
  "scripts": {
    "test": "vitest",
    "test:ui": "vitest --ui",
    "test:run": "vitest run"
  }
}
```
