# Shopify Integration Guide — QDR Studios

This document explains how this project connects to Shopify so another frontend or LLM can replicate the same integration.

---

## Store Info

| Key | Value |
|-----|-------|
| **Store Domain** | `qdr-studios.myshopify.com` |
| **Storefront API Version** | `2025-01` |
| **Storefront API Endpoint** | `https://qdr-studios.myshopify.com/api/2025-01/graphql.json` |

---

## Environment Variables Required

```env
NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN=qdr-studios.myshopify.com
NEXT_PUBLIC_SHOPIFY_STOREFRONT_TOKEN=<your_public_storefront_token>
SHOPIFY_PRIVATE_TOKEN=<your_private_admin_token>
```

- `NEXT_PUBLIC_SHOPIFY_STOREFRONT_TOKEN` — Public Storefront API token. Used for **products, collections, cart, and customer auth** from the browser or server. Get it from: Shopify Admin → Apps → Develop apps → your app → Storefront API access token.
- `SHOPIFY_PRIVATE_TOKEN` (`shpat_...`) — Private Admin API token. Used for **admin-level operations** (orders, fulfillment, customer management from backend). Get it from: Shopify Admin → Apps → Develop apps → your app → Admin API access token.

---

## Which API Does What

| Use Case | API to Use | Token Needed |
|----------|------------|--------------|
| List/fetch products | Storefront GraphQL | Storefront token |
| Fetch a single product by handle | Storefront GraphQL | Storefront token |
| Fetch collections | Storefront GraphQL | Storefront token |
| Create/manage cart | Storefront GraphQL | Storefront token |
| Customer sign up / login / logout | Storefront GraphQL | Storefront token |
| Get customer orders & addresses | Storefront GraphQL | Storefront token (+ customer access token from login) |
| Read ALL orders (admin) | Admin REST or Admin GraphQL | Private admin token |
| Read ALL customers (admin) | Admin REST or Admin GraphQL | Private admin token |
| Update/fulfill orders | Admin REST or Admin GraphQL | Private admin token |

---

## Storefront API — GraphQL Calls

All Storefront calls go to:

```
POST https://qdr-studios.myshopify.com/api/2025-01/graphql.json
Headers:
  X-Shopify-Storefront-Access-Token: <NEXT_PUBLIC_SHOPIFY_STOREFRONT_TOKEN>
  Content-Type: application/json
```

### Example: Fetch All Products

```graphql
query GetAllProducts($first: Int = 20) {
  products(first: $first) {
    edges {
      node {
        id
        handle
        title
        description
        priceRange {
          minVariantPrice { amount currencyCode }
        }
        images(first: 1) {
          edges { node { url altText } }
        }
        variants(first: 100) {
          edges {
            node {
              id
              title
              availableForSale
              price { amount currencyCode }
            }
          }
        }
      }
    }
  }
}
```

### Example: Customer Login (get access token)

```graphql
mutation customerAccessTokenCreate($input: CustomerAccessTokenCreateInput!) {
  customerAccessTokenCreate(input: $input) {
    customerAccessToken {
      accessToken
      expiresAt
    }
    customerUserErrors { code field message }
  }
}
# Variables: { "input": { "email": "user@example.com", "password": "..." } }
```

### Example: Get Customer Orders & Addresses

After login, use the returned `accessToken`:

```graphql
query getCustomer($customerAccessToken: String!) {
  customer(customerAccessToken: $customerAccessToken) {
    id
    firstName
    lastName
    email
    orders(first: 20, sortKey: PROCESSED_AT, reverse: true) {
      edges {
        node {
          id
          orderNumber
          processedAt
          financialStatus
          fulfillmentStatus
          totalPrice { amount currencyCode }
          lineItems(first: 10) {
            edges {
              node {
                title
                quantity
                variant {
                  title
                  price { amount currencyCode }
                  image { url altText }
                }
              }
            }
          }
        }
      }
    }
    addresses(first: 10) {
      edges {
        node {
          id address1 address2 city country province zip phone
        }
      }
    }
  }
}
```

---

## Admin API — REST Calls (Orders, Customers — Full Access)

All Admin REST calls go to:

```
GET/POST https://qdr-studios.myshopify.com/admin/api/2025-01/<resource>.json
Headers:
  X-Shopify-Access-Token: <SHOPIFY_PRIVATE_TOKEN>
  Content-Type: application/json
```

> ⚠️ The private token (`shpat_...`) must NEVER be exposed to the browser. Only call these from a server-side route (e.g. Next.js API route, backend service).

### Example: List All Orders

```
GET https://qdr-studios.myshopify.com/admin/api/2025-01/orders.json?status=any&limit=50
```

Response shape:
```json
{
  "orders": [
    {
      "id": 123456,
      "order_number": 1001,
      "email": "customer@example.com",
      "financial_status": "paid",
      "fulfillment_status": null,
      "total_price": "99.00",
      "line_items": [ ... ],
      "shipping_address": { ... },
      "created_at": "2025-01-01T00:00:00Z"
    }
  ]
}
```

### Example: List All Customers

```
GET https://qdr-studios.myshopify.com/admin/api/2025-01/customers.json?limit=50
```

### Example: Get Single Order

```
GET https://qdr-studios.myshopify.com/admin/api/2025-01/orders/{order_id}.json
```

---

## Cart Flow Summary

1. **Create cart** → `cartCreate` mutation (Storefront API) → returns `cart.id` and `cart.checkoutUrl`
2. **Store `cart.id`** in `localStorage` (key: `shopify_cart_id`)
3. **Add items** → `cartLinesAdd` mutation with `merchandiseId` (variant GID) and `quantity`
4. **Update items** → `cartLinesUpdate` mutation
5. **Remove items** → `cartLinesRemove` mutation
6. **Checkout** → redirect user to `cart.checkoutUrl` (Shopify-hosted checkout)

---

## Customer Auth Flow Summary

1. **Sign up** → `customerCreate` mutation → auto-login after success
2. **Login** → `customerAccessTokenCreate` mutation → store `accessToken` + `expiresAt` in `localStorage`
3. **Load customer** → `getCustomer` query using stored `accessToken`
4. **Logout** → `customerAccessTokenDelete` mutation + clear `localStorage`
5. **Password reset** → `customerRecover` mutation (sends email via Shopify)

Customer token localStorage keys:
- `shopify_customer_token` — the access token string
- `shopify_customer_token_expiry` — ISO expiry date string

---

## GraphQL Node IDs

Shopify uses global IDs (GIDs) in the format:
```
gid://shopify/Product/1234567890
gid://shopify/ProductVariant/1234567890
```

When passing a variant ID to `cartLinesAdd`, use the full GID string exactly as returned by the API.

---

## Quick Checklist for a New Frontend

- [ ] Copy the two env vars: `NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN` and `NEXT_PUBLIC_SHOPIFY_STOREFRONT_TOKEN`
- [ ] Use `POST` to `https://<domain>/api/2025-01/graphql.json` with the storefront token header for all public/customer data
- [ ] For admin data (all orders, all customers), use the Admin REST API with `SHOPIFY_PRIVATE_TOKEN` — server-side only
- [ ] Never expose `SHOPIFY_PRIVATE_TOKEN` (`shpat_...`) in client-side code


IGAAX42hVtA0xBZAFp1Yl80SW9pM0x2NThoTmdyRWh3TGEzYkNZAa1hFdXJDVzF5aDNFUlhMSXdaME9LQllybExxNlBNZAEE4amRfMWpveFdubnZAPR3RuZAkVrRUtKd0I4RlBiYXU3d3RfajJldGE1ZADJGdElwR3I3QllpZA0ZAWMkZADYwZDZD