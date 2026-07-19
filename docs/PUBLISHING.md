# Publishing twx-react

## Prerequisites
- Create an npm account and generate an automation token.
- Add the token to GitHub Actions secrets as `NPM_TOKEN`.

## Release flow
1. Update the version in `package.json`.
2. Commit and push your changes.
3. Create a git tag matching `vX.Y.Z`.
4. Push the tag to GitHub.

Example:

```bash
git tag v0.1.2
git push origin v0.1.2
```

The GitHub Actions workflow in `.github/workflows/release.yml` will build the package and publish it to npm automatically.
