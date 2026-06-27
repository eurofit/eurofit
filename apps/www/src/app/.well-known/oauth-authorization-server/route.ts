import { site } from "@/const/site"

// RFC 8414 OAuth 2.0 Authorization Server Metadata + agent_auth extension
export function GET() {
  return Response.json(
    {
      issuer: site.url,
      authorization_endpoint: `${site.url}/login`,
      token_endpoint: `${site.url}/payload/api/users/login`,
      grant_types_supported: ["password"],
      response_types_supported: ["token"],
      scopes_supported: ["profile", "email"],
      token_endpoint_auth_methods_supported: ["client_secret_post"],
      agent_auth: {
        register_uri: `${site.url}/sign-up`,
        supported_identity_types: ["email"],
        supported_credential_types: ["password"],
        claim_uri: null,
        revocation_uri: null,
      },
    },
    {
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "public, max-age=86400",
      },
    }
  )
}
