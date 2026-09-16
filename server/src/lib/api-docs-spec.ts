/** Inline OpenAPI spec — зөвхөн admin docs-д ашиглагдана, тусдаа endpoint байхгүй. */
export const pettiApiDocsSpec = {
  openapi: "3.0.3",
  info: {
    title: "Petti Shop API",
    version: "3",
    description:
      "Дотоод API баримт. Нээлттэй OpenAPI JSON endpoint байхгүй — зөвхөн `x-admin-secret`-тэй `/api/admin/docs` дээр харагдана.",
  },
  servers: [{ url: "/", description: "Current worker" }],
  tags: [
    { name: "Public", description: "Дэлгүүрийн storefront" },
    { name: "Admin", description: "Admin panel — `x-admin-secret` шаардлагатай" },
  ],
  components: {
    securitySchemes: {
      AdminSecret: {
        type: "apiKey",
        in: "header",
        name: "x-admin-secret",
        description: "Admin `.dev.vars` / `ADMIN_SECRET` утга",
      },
    },
    schemas: {
      Error: {
        type: "object",
        properties: { error: { type: "string" } },
        required: ["error"],
      },
      Category: {
        type: "object",
        properties: {
          id: { type: "string", format: "uuid" },
          slug: { type: "string" },
          name: { type: "string" },
          sortOrder: { type: "integer" },
          isActive: { type: "boolean" },
        },
      },
      ProductVariant: {
        type: "object",
        properties: {
          id: { type: "string", format: "uuid" },
          label: { type: "string" },
          priceMnt: { type: "integer" },
          stockQty: { type: "integer" },
          isDefault: { type: "boolean" },
        },
      },
      ProductListItem: {
        type: "object",
        properties: {
          id: { type: "string", format: "uuid" },
          slug: { type: "string" },
          name: { type: "string" },
          priceMnt: { type: "integer" },
          status: { type: "string", enum: ["draft", "active", "archived"] },
          imageSrc: { type: "string" },
          variants: { type: "array", items: { $ref: "#/components/schemas/ProductVariant" } },
        },
      },
      ProductDetail: {
        allOf: [
          { $ref: "#/components/schemas/ProductListItem" },
          {
            type: "object",
            properties: {
              description: { type: "string", nullable: true },
              category: { $ref: "#/components/schemas/Category", nullable: true },
            },
          },
        ],
      },
      OrderLineInput: {
        type: "object",
        required: ["productId", "quantity"],
        properties: {
          productId: { type: "string", format: "uuid" },
          variantId: { type: "string", format: "uuid" },
          quantity: { type: "integer", minimum: 1, maximum: 99 },
        },
      },
      CreateOrderRequest: {
        type: "object",
        required: ["email", "fullName", "items"],
        properties: {
          email: { type: "string", format: "email" },
          fullName: { type: "string" },
          phone: { type: "string" },
          shippingAddress: { type: "object", additionalProperties: true },
          items: {
            type: "array",
            minItems: 1,
            items: { $ref: "#/components/schemas/OrderLineInput" },
          },
          notes: { type: "string" },
        },
      },
      OrderCreated: {
        type: "object",
        properties: {
          id: { type: "string", format: "uuid" },
          orderNumber: { type: "string" },
          totalMnt: { type: "integer" },
          status: { type: "string" },
        },
      },
      DashboardStats: {
        type: "object",
        properties: {
          totalProducts: { type: "integer" },
          activeProducts: { type: "integer" },
          totalOrders: { type: "integer" },
          pendingOrders: { type: "integer" },
          revenueMnt: { type: "integer" },
        },
      },
    },
  },
  paths: {
    "/": {
      get: {
        tags: ["Public"],
        summary: "Service health",
        responses: {
          "200": {
            description: "OK",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    service: { type: "string" },
                    version: { type: "string" },
                  },
                },
              },
            },
          },
        },
      },
    },
    "/api/shop": {
      get: {
        tags: ["Public"],
        summary: "Дэлгүүрийн тохиргоо",
        responses: { "200": { description: "Store config" } },
      },
    },
    "/api/categories": {
      get: {
        tags: ["Public"],
        summary: "Идэвхтэй ангиллууд",
        responses: {
          "200": {
            description: "OK",
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: { $ref: "#/components/schemas/Category" },
                },
              },
            },
          },
        },
      },
    },
    "/api/products": {
      get: {
        tags: ["Public"],
        summary: "Барааны жагсаалт",
        parameters: [
          { name: "q", in: "query", schema: { type: "string" }, description: "Хайлт" },
          {
            name: "cat",
            in: "query",
            schema: { type: "string" },
            description: "Ангиллын slug (category alias)",
          },
          { name: "category", in: "query", schema: { type: "string" } },
        ],
        responses: {
          "200": {
            description: "OK",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    items: {
                      type: "array",
                      items: { $ref: "#/components/schemas/ProductListItem" },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    "/api/products/{slug}": {
      get: {
        tags: ["Public"],
        summary: "Барааны дэлгэрэнгүй",
        parameters: [
          { name: "slug", in: "path", required: true, schema: { type: "string" } },
        ],
        responses: {
          "200": {
            description: "OK",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ProductDetail" },
              },
            },
          },
          "404": {
            description: "Not found",
            content: {
              "application/json": { schema: { $ref: "#/components/schemas/Error" } },
            },
          },
        },
      },
    },
    "/api/orders": {
      post: {
        tags: ["Public"],
        summary: "Захиалга үүсгэх",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/CreateOrderRequest" },
            },
          },
        },
        responses: {
          "201": {
            description: "Created",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/OrderCreated" },
              },
            },
          },
          "400": {
            description: "Validation error",
            content: {
              "application/json": { schema: { $ref: "#/components/schemas/Error" } },
            },
          },
        },
      },
    },
    "/api/orders/lookup": {
      get: {
        tags: ["Public"],
        summary: "Захиалга хайх (захиалгын дугаар + имэйл)",
        parameters: [
          { name: "orderNumber", in: "query", required: true, schema: { type: "string" } },
          { name: "email", in: "query", required: true, schema: { type: "string", format: "email" } },
        ],
        responses: {
          "200": { description: "Order detail" },
          "400": { description: "Missing params" },
          "404": { description: "Not found" },
        },
      },
    },
    "/api/admin/dashboard": {
      get: {
        tags: ["Admin"],
        summary: "Dashboard статистик",
        security: [{ AdminSecret: [] }],
        responses: {
          "200": {
            description: "OK",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/DashboardStats" },
              },
            },
          },
          "401": { description: "Unauthorized" },
        },
      },
    },
    "/api/admin/categories": {
      get: {
        tags: ["Admin"],
        summary: "Бүх ангилал",
        security: [{ AdminSecret: [] }],
        responses: { "200": { description: "OK" } },
      },
    },
    "/api/admin/products": {
      get: {
        tags: ["Admin"],
        summary: "Бүх бараа",
        security: [{ AdminSecret: [] }],
        responses: { "200": { description: "OK" } },
      },
      post: {
        tags: ["Admin"],
        summary: "Бараа нэмэх",
        security: [{ AdminSecret: [] }],
        requestBody: {
          required: true,
          content: { "application/json": { schema: { type: "object" } } },
        },
        responses: {
          "201": { description: "Created" },
          "400": { description: "Validation error" },
          "401": { description: "Unauthorized" },
        },
      },
    },
    "/api/admin/products/{id}": {
      get: {
        tags: ["Admin"],
        summary: "Бараа (ID)",
        security: [{ AdminSecret: [] }],
        parameters: [
          { name: "id", in: "path", required: true, schema: { type: "string", format: "uuid" } },
        ],
        responses: {
          "200": { description: "OK" },
          "404": { description: "Not found" },
        },
      },
      patch: {
        tags: ["Admin"],
        summary: "Бараа засах",
        security: [{ AdminSecret: [] }],
        parameters: [
          { name: "id", in: "path", required: true, schema: { type: "string", format: "uuid" } },
        ],
        requestBody: {
          content: { "application/json": { schema: { type: "object" } } },
        },
        responses: {
          "200": { description: "OK" },
          "404": { description: "Not found" },
        },
      },
    },
    "/api/admin/orders": {
      get: {
        tags: ["Admin"],
        summary: "Захиалгын жагсаалт",
        security: [{ AdminSecret: [] }],
        responses: { "200": { description: "OK" } },
      },
    },
    "/api/admin/orders/{id}": {
      patch: {
        tags: ["Admin"],
        summary: "Захиалгын төлөв шинэчлэх",
        security: [{ AdminSecret: [] }],
        parameters: [
          { name: "id", in: "path", required: true, schema: { type: "string", format: "uuid" } },
        ],
        requestBody: {
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  status: { type: "string" },
                  paymentStatus: { type: "string" },
                },
              },
            },
          },
        },
        responses: {
          "200": { description: "OK" },
          "404": { description: "Not found" },
        },
      },
    },
  },
} as const;
