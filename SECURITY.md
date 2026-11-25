# Security Policy

## Supported Versions

Security fixes are generally provided for the latest released version of Neram.

| Version | Supported |
| --- | --- |
| Latest release | Yes |
| Older releases | Best effort |
| Unreleased development versions | No |

## Reporting a Vulnerability

Please do not report security vulnerabilities through public GitHub issues.
Report them privately to the project maintainer and include, where possible:

- A description of the vulnerability
- Steps to reproduce it
- Potential impact
- Affected versions
- A proof of concept and suggested mitigation, if available

Please allow reasonable time for investigation and remediation before public
disclosure.

## Sensitive Information

Never include passwords, API keys, authentication tokens, private keys,
production connection strings, personal information, or customer data in a
report. Redact sensitive information from logs and screenshots.

## Current Security Considerations

Neram stores application data locally using SQLite. Users should protect access
to their device and avoid sharing database backups that contain private
productivity or project information.

Neram's updater configuration and release artifacts should be handled as
release infrastructure. Do not commit replacement signing keys or other
credentials to the repository.

## Security Updates

Security-related fixes will be included in releases and documented in release
notes when appropriate.
