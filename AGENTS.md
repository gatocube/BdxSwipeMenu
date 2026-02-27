We keep to maitan code clean and simple and develop in fast pace.

So we will not support old versions of the code, deprecated code and don't write compatibility layers for the project and items that are below the 1.0.0 version.

Deprecation policy: see [`agents/DEPRECATION-POLICY.md`](agents/DEPRECATION-POLICY.md)

After code changes deploy the project locally, see [`agents/DEPLOYMENT.md`](agents/DEPLOYMENT.md)

## Rules

- Agents should not edit AGENTS.md and files in agents/ directory until explicitly asked
- Any docs files should be saved in docs/ folder
- Do not hardcode urls and ports in code, use env vars instead
- Do not hardcode paths that are outside of the project folder, use env vars instead