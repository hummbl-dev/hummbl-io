# Security Policy

## Supported Versions

We release patches for security vulnerabilities. Currently supported versions:

| Version | Supported          |
| ------- | ------------------ |
| 1.x.x   | :white_check_mark: |

## Reporting a Vulnerability

We take the security of HUMMBL seriously. If you believe you have found a security vulnerability, please report it to us as described below.

**Please do not report security vulnerabilities through public GitHub issues.**

Instead, please report them via one of the following methods:

1. **GitHub Security Advisories** (Preferred)
   - Navigate to the [Security tab](https://github.com/hummbl-dev/hummbl-io/security) of this repository
   - Click "Report a vulnerability"
   - Provide detailed information about the vulnerability

2. **Email**
   - Send an email to security@hummbl.io (if available)
   - Include as much information as possible about the vulnerability

### What to Include in Your Report

Please include the following information in your report:

- Type of vulnerability (e.g., XSS, SQL injection, authentication bypass)
- Full paths of source file(s) related to the vulnerability
- Location of the affected source code (tag/branch/commit or direct URL)
- Any special configuration required to reproduce the issue
- Step-by-step instructions to reproduce the issue
- Proof-of-concept or exploit code (if possible)
- Impact of the issue, including how an attacker might exploit it

### What to Expect

- **Acknowledgment**: We will acknowledge receipt of your vulnerability report within 48 hours
- **Updates**: We will provide regular updates about our progress
- **Timeline**: We aim to resolve critical vulnerabilities within 7 days
- **Disclosure**: Once a fix is released, we will coordinate disclosure timing with you

## Security Best Practices

When using this application, we recommend:

1. **Keep Dependencies Updated**: Regularly update dependencies to patch known vulnerabilities
2. **Environment Variables**: Never commit sensitive credentials or API keys to the repository
3. **Use HTTPS**: Always access the application over HTTPS in production
4. **Content Security Policy**: Review and maintain the CSP headers
5. **Input Validation**: Be cautious with user inputs and sanitize appropriately

## Disclosure Policy

- We will coordinate with you on the disclosure timeline
- We prefer responsible disclosure with a 90-day embargo for critical vulnerabilities
- We will credit researchers who responsibly disclose vulnerabilities (unless you prefer to remain anonymous)

## Security Updates

Security updates will be released as patch versions and documented in:
- [CHANGELOG.md](CHANGELOG.md)
- GitHub Security Advisories
- Release notes

## Security-Related Configuration

### Environment Variables

Ensure the following environment variables are properly secured:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`
- `VITE_SENTRY_DSN`
- Any other API keys or secrets

Never expose these in client-side code or commit them to version control.

### Dependencies

We use the following tools to monitor security:

- **npm audit** / **pnpm audit**: Regular dependency vulnerability scanning
- **Dependabot**: Automated security updates for dependencies
- **CodeQL**: Static analysis for security vulnerabilities

## Additional Resources

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Node.js Security Best Practices](https://nodejs.org/en/docs/guides/security/)
- [React Security Best Practices](https://reactjs.org/docs/dom-elements.html#dangerouslysetinnerhtml)

## Questions?

If you have questions about this security policy, please open a GitHub issue or contact the maintainers.

---

**Last Updated**: 2025-01-14
