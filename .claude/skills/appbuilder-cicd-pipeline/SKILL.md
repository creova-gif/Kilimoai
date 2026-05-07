---
name: appbuilder-cicd-pipeline
description: Set up CI/CD pipelines for Adobe App Builder projects. Generates GitHub Actions workflows, Azure DevOps, or GitLab CI configurations for automated deployment.
---

# App Builder CI/CD Pipeline

Set up automated deployment pipelines for App Builder.

## GitHub Actions
Use `adobe/aio-apps-action@v3` for deployment.
Requires secrets:
- `ADOBE_CLIENT_ID`
- `ADOBE_CLIENT_SECRET`
- `ADOBE_TECHNICAL_ACCOUNT_ID`
- `ADOBE_TECHNICAL_ACCOUNT_EMAIL`
- `ADOBE_ORG_ID`
- `ADOBE_SCOPES`

## Promotion Workflow
1. Stage Workspace: Automatic on push to main.
2. Production Workspace: Manual trigger or release tag.
