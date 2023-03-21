# vitest-config

Usage:

First, add `"@configs/vitest-config": "*"` to the `package.json` devDependencies:

```json
{
  "devDependencies": {
    "@configs/vitest-config": "*"
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
