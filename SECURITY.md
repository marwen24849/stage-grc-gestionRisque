# Security

## Architecture

The API is stateless. Angular sends a JWT in the `Authorization: Bearer <token>` header. Spring Security validates the signature and expiration before the request reaches the controllers.

`POST /api/auth/login` is the only public API endpoint. All other endpoints require authentication.

## Authentication

Passwords are validated and stored only as BCrypt hashes. Login responses contain the access token and the public user profile, never a password or password hash.

JWTs contain the user email as `sub`, the user ID, the role, `iat`, and `exp`. The signing key and expiration are configured through environment variables.

## Roles

- `ADMIN`: global client, user, and platform access.
- `CONSULTANT`: access to assigned clients and their GRC data.
- `CLIENT`: access only to the client associated with the account.

`POST /api/users` and `GET /api/users` are restricted to `ADMIN`. Public registration is intentionally not enabled; an administrator creates accounts and assigns roles.

## Data isolation

Client access is checked in backend services, not only in Angular. Activities and assets are authorized through their parent chain back to the client. A client ID in a URL is never trusted by itself.

Consultant access is checked against the `consultant_clients` association table.

## HTTP security

- CSRF is disabled because authentication uses a bearer header and the API is stateless, not a browser authentication cookie.
- CORS allows only `APP_CORS_ORIGIN` (default development origin: `http://localhost:4200`).
- `401` means missing, invalid, expired, or unusable authentication.
- `403` means an authenticated user lacks the role or client ownership required.
- Security headers include content type protection, frame denial, referrer policy, and a restrictive API CSP.

## Environment variables

Copy `.env.example` to a local environment configuration and provide real values outside Git:

- `JWT_SECRET`: random secret with at least 32 characters; use a different value per environment.
- `JWT_EXPIRATION`: token lifetime in milliseconds.
- `SPRING_DATASOURCE_USERNAME` and `SPRING_DATASOURCE_PASSWORD`.
- `OPENROUTER_API_KEY`.
- `ADMIN_EMAIL` and `ADMIN_PASSWORD`: optional initial admin account; the password must satisfy the password policy.
- `APP_CORS_ORIGIN`.

The OpenRouter key previously present in the repository must be revoked and replaced because it should be considered compromised.

## Development

Set the environment variables before starting the backend. Start Angular with `npm start`. The frontend keeps the JWT only in `sessionStorage` and clears it on logout or a `401` response.

## Testing

Security tests should cover login success/failure, missing/invalid/expired JWTs, role restrictions, client ownership, and consultant assignments. The current implementation has the security hooks in place; integration test coverage should be expanded with the test database configuration used by the project.
