# LocalCatalog AI project instructions

## Working style

- Work incrementally and preserve working code.
- Keep components focused, reusable, accessible, and mobile first.
- Run formatting, linting, type checking, tests, and production builds at meaningful milestones.
- Prefer complete user flows over disconnected placeholder controls.

## Secrets and API credentials

- Never hard-code credentials.
- Never place credentials in committed files.
- Never output complete secret values in logs or responses.
- Before using OpenAI, check for `OPENAI_API_KEY`.
- When it is missing, ask the user to configure it as an environment variable:
  “Please provide your OpenAI API key as the OPENAI_API_KEY environment variable. Do not paste it into source code.”
- Create and maintain `.env.example` using placeholders only.
- Ensure local environment files are ignored by Git.
- Keep all OpenAI requests server-side.
- Do not prefix secret variables with `NEXT_PUBLIC_`.
- Continue building non-AI features when the key is unavailable.
- Provide a manual-entry or mock-data fallback rather than blocking the application.
