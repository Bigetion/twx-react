# Publishing twx-react

## Prerequisites
- Create an npm account and generate an automation token.
- Add the token to GitHub Actions secrets as `NPM_TOKEN`.

## Release flow
1. Update the version in `package.json`.
2. Run the relevant verification steps locally: `npm run type-check`, `npm test -- --runInBand`, and `npm run build`.
3. Commit and push your changes.
4. Create a git tag matching `vX.Y.Z`.
5. Push the tag to GitHub.

Example:

```bash
npm version 0.1.4
git push origin master
git tag v0.1.4
git push origin v0.1.4
```

The GitHub Actions workflow in `.github/workflows/release.yml` will build the package and publish it to npm automatically.
