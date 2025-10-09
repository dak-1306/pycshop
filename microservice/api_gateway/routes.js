import { createProxyMiddleware } from "http-proxy-middleware";
import authMiddleware from "./middleware/authMiddleware.js";

function setupRoutes(app) {
  console.log("[ROUTES] Setting up proxy routes...");

  // Auth Service
  app.use(
    "/auth",
    (req, res, next) => {
      console.log(
        `[ROUTES] Matched /auth route for ${req.method} ${req.originalUrl}`
      );
      console.log(`[ROUTES] req.user:`, req.user);
      next();
    },
    createProxyMiddleware({
      target: process.env.AUTH_SERVICE_URL || "http://localhost:5001",
      changeOrigin: true,
      pathRewrite: { "^/auth": "" },
      onProxyReq: (proxyReq, req, res) => {
        console.log(`[PROXY] onProxyReq callback triggered`);
        // Truyền thông tin user từ API Gateway xuống auth service
        if (req.user) {
          proxyReq.setHeader("x-user-id", req.user.id);
          proxyReq.setHeader("x-user-role", req.user.role);

          // Only set x-user-type if it exists to avoid undefined header
          if (req.user.userType) {
            proxyReq.setHeader("x-user-type", req.user.userType);
          }

          console.log(
            `[PROXY] Adding user headers for user ID: ${req.user.id}, role: ${
              req.user.role
            }, userType: ${req.user.userType || "undefined"}`
          );
        } else {
          console.log(`[PROXY] No req.user found for this request`);
        }

        console.log(
          `[PROXY] Forwarding ${req.method} ${req.url} to ${
            process.env.AUTH_SERVICE_URL || "http://localhost:5001"
          }${proxyReq.path}`
        );
      },
      onProxyRes: (proxyRes, req, res) => {
        console.log(
          `[PROXY] Response ${proxyRes.statusCode} from Auth Service`
        );

        // Ensure CORS headers are set
        const origin = req.headers.origin;
        if (origin) {
          res.setHeader("Access-Control-Allow-Origin", origin);
          res.setHeader("Access-Control-Allow-Credentials", "true");
        }
      },
      onError: (err, req, res) => {
        console.error(`[PROXY] Error:`, err.message);
        if (!res.headersSent) {
          res.status(500).json({ error: "Proxy error", details: err.message });
        }
      },
    })
  );

  // Static files (uploads) - route to Product Service
  app.use(
    "/uploads",
    (req, res, next) => {
      console.log(
        `[ROUTES] Matched /uploads route for ${req.method} ${req.originalUrl}`
      );
      next();
    },
    createProxyMiddleware({
      target: process.env.PRODUCT_SERVICE_URL || "http://localhost:5002",
      changeOrigin: true,
      // Keep /uploads prefix
      pathRewrite: (path, req) => {
        console.log(`[PROXY] Uploads path rewrite: ${path} -> ${path}`);
        return path;
      },
      onProxyReq: (proxyReq, req, res) => {
        console.log(
          `[PROXY] Forwarding uploads ${req.method} ${req.url} to ${
            process.env.PRODUCT_SERVICE_URL || "http://localhost:5002"
          }${proxyReq.path}`
        );
      },
      onProxyRes: (proxyRes, req, res) => {
        console.log(
          `[PROXY] Response ${proxyRes.statusCode} from Product Service (uploads)`
        );
      },
      onError: (err, req, res) => {
        console.error(`[PROXY] Uploads Service Error:`, err.message);
        if (!res.headersSent) {
          res
            .status(500)
            .json({ error: "Upload service error", details: err.message });
        }
      },
    })
  );

  // Product Service
  app.use(
    "/products",
    (req, res, next) => {
      console.log(
        `[ROUTES] Matched /products route for ${req.method} ${req.originalUrl}`
      );
      next();
    },
    createProxyMiddleware({
      target: process.env.PRODUCT_SERVICE_URL || "http://localhost:5002",
      changeOrigin: true,
      pathRewrite: { "^/products": "" },
      onProxyReq: (proxyReq, req, res) => {
        console.log(
          `[PROXY] Forwarding ${req.method} ${req.url} to ${
            process.env.PRODUCT_SERVICE_URL || "http://localhost:5002"
          }${proxyReq.path}`
        );
      },
      onProxyRes: (proxyRes, req, res) => {
        console.log(
          `[PROXY] Response ${proxyRes.statusCode} from Product Service`
        );
      },
      onError: (err, req, res) => {
        console.error(`[PROXY] Product Service Error:`, err.message);
        if (!res.headersSent) {
          res
            .status(500)
            .json({ error: "Product service error", details: err.message });
        }
      },
    })
  );

  // Seller Service (Product Management for Sellers)
  app.use(
    "/seller",
    (req, res, next) => {
      console.log(
        `[ROUTES] Matched /seller route for ${req.method} ${req.originalUrl}`
      );
      console.log(
        `[ROUTES] Original URL: ${req.originalUrl}, Target path: ${req.url}`
      );
      next();
    },
    createProxyMiddleware({
      target: process.env.PRODUCT_SERVICE_URL || "http://localhost:5002",
      changeOrigin: true,
      // Keep /seller prefix - product service expects it
      pathRewrite: (path, req) => {
        const newPath = `/seller${path}`;
        console.log(`[PROXY] Path rewrite: ${path} -> ${newPath}`);
        return newPath;
      },
      timeout: 60000, // 60 second timeout
      onProxyReq: (proxyReq, req, res) => {
        console.log(
          `[PROXY] Forwarding ${req.method} ${req.url} to ${
            process.env.PRODUCT_SERVICE_URL || "http://localhost:5002"
          }${proxyReq.path}`
        );
        console.log(
          `[PROXY] Original URL: ${req.originalUrl} -> Target: ${proxyReq.path}`
        );
        console.log(`[PROXY] Headers:`, proxyReq.getHeaders());
        console.log(
          `[PROXY] Target URL: ${
            process.env.PRODUCT_SERVICE_URL || "http://localhost:5002"
          }${proxyReq.path}`
        );
      },
      onProxyRes: (proxyRes, req, res) => {
        console.log(
          `[PROXY] Response ${proxyRes.statusCode} from Seller Service`
        );
      },
      onError: (err, req, res) => {
        console.error(`[PROXY] Seller Service Error:`, err.message);
        if (!res.headersSent) {
          res
            .status(500)
            .json({ error: "Seller service error", details: err.message });
        }
      },
    })
  );

  // Cart Service
  app.use(
    "/cart",
    createProxyMiddleware({
      target: process.env.CART_SERVICE_URL,
      changeOrigin: true,
      pathRewrite: { "^/cart": "" },
    })
  );

  // Shop Service - Use function pathRewrite to preserve /shops prefix
  app.use(
    "/shops",
    (req, res, next) => {
      console.log(
        `[ROUTES] Matched /shops route for ${req.method} ${req.originalUrl}`
      );
      next();
    },
    // Add authentication middleware for protected shop routes
    (req, res, next) => {
      // Skip auth for public routes
      if (
        req.path.includes("/categories") ||
        req.path.includes("/search") ||
        req.path.match(/^\/\d+$/) || // /:shopId pattern
        req.path.match(/^\/id\/\d+$/)
      ) {
        // /id/:shopId pattern
        console.log(
          `[ROUTES] Skipping auth for public shop route: ${req.path}`
        );
        return next();
      }

      // Apply auth middleware for protected routes
      console.log(
        `[ROUTES] Applying auth middleware for shop route: ${req.path}`
      );
      authMiddleware(req, res, next);
    },
    // Debug middleware to check req.user before proxy
    (req, res, next) => {
      console.log(`[DEBUG] Before proxy - req.user:`, req.user);
      console.log(`[DEBUG] Before proxy - path:`, req.path);
      console.log(`[DEBUG] Before proxy - originalUrl:`, req.originalUrl);

      // Manually set headers for proxy
      if (req.user) {
        req.headers["x-user-id"] = req.user.id;
        req.headers["x-user-role"] = req.user.role;

        // Only set x-user-type if it exists
        if (req.user.userType) {
          req.headers["x-user-type"] = req.user.userType;
        }

        console.log(
          `[DEBUG] Set headers manually: x-user-id=${
            req.user.id
          }, x-user-role=${req.user.role}, x-user-type=${
            req.user.userType || "undefined"
          }`
        );
      }
      next();
    },
    createProxyMiddleware({
      target: process.env.SHOP_SERVICE_URL || "http://localhost:5003",
      changeOrigin: true,
      // Simple pathRewrite - don't add prefix since shop service expects /shops/info
      pathRewrite: (path, req) => {
        // Remove /shops prefix and keep the rest
        const newPath = req.originalUrl;
        console.log(`[PROXY] Path rewrite: ${path} -> ${newPath}`);
        return newPath;
      },
      onProxyReq: (proxyReq, req, res) => {
        console.log(
          `[PROXY] onProxyReq callback for shop service - URL: ${req.url}`
        );
        console.log(`[PROXY] req.user exists:`, !!req.user);
        console.log(`[PROXY] req.user details:`, req.user);
        console.log(
          `[PROXY] Forwarding ${req.method} ${req.url} to ${
            process.env.SHOP_SERVICE_URL || "http://localhost:5003"
          }${proxyReq.path}`
        );
        // Truyền thông tin user từ API Gateway xuống shop service
        if (req.user) {
          proxyReq.setHeader("x-user-id", req.user.id);
          proxyReq.setHeader("x-user-role", req.user.role);

          // Only set x-user-type if it exists
          if (req.user.userType) {
            proxyReq.setHeader("x-user-type", req.user.userType);
          }
          console.log(
            `[PROXY] Adding user headers for user ID: ${req.user.id}, role: ${req.user.role}`
          );
        } else {
          console.log(`[PROXY] No req.user found for shop request`);
        }
      },
      onProxyRes: (proxyRes, req, res) => {
        console.log(
          `[PROXY] Response ${proxyRes.statusCode} from Shop Service`
        );

        // Ensure CORS headers are set
        const origin = req.headers.origin;
        if (origin) {
          res.setHeader("Access-Control-Allow-Origin", origin);
          res.setHeader("Access-Control-Allow-Credentials", "true");
        }
      },
      onError: (err, req, res) => {
        console.error(`[PROXY] Shop Service Error:`, err.message);
        if (!res.headersSent) {
          res
            .status(500)
            .json({ error: "Shop service error", details: err.message });
        }
      },
    })
  );

  // Admin Service - requires admin auth
  app.use(
    "/admin",
    (req, res, next) => {
      console.log(
        `[ROUTES] Matched /admin route for ${req.method} ${req.originalUrl}`
      );
      next();
    },
    createProxyMiddleware({
      target: process.env.ADMIN_SERVICE_URL || "http://localhost:5005",
      changeOrigin: true,
      pathRewrite: { "^/admin": "" },
      onProxyReq: (proxyReq, req, res) => {
        console.log(
          `[PROXY] Forwarding ${req.method} ${req.url} to ${
            process.env.ADMIN_SERVICE_URL || "http://localhost:5005"
          }${proxyReq.path}`
        );
        // Truyền thông tin user từ API Gateway xuống admin service
        if (req.user) {
          proxyReq.setHeader("x-user-id", req.user.id);
          proxyReq.setHeader("x-user-role", req.user.role);

          // Only set x-user-type if it exists
          if (req.user.userType) {
            proxyReq.setHeader("x-user-type", req.user.userType);
          }

          console.log(
            `[PROXY] Adding user headers for user ID: ${req.user.id}, role: ${
              req.user.role
            }, userType: ${req.user.userType || "undefined"}`
          );
        } else {
          console.log(`[PROXY] No req.user found for this request`);
        }
      },
      onProxyRes: (proxyRes, req, res) => {
        console.log(
          `[PROXY] Response ${proxyRes.statusCode} from Admin Service`
        );
      },
      onError: (err, req, res) => {
        console.error(`[PROXY] Admin Service Error:`, err.message);
        if (!res.headersSent) {
          res
            .status(500)
            .json({ error: "Admin service error", details: err.message });
        }
      },
    })
  );

  // Review Service - For reviews and ratings
  app.use(
    "/api/reviews",
    (req, res, next) => {
      console.log(
        `[ROUTES] Matched /api/reviews route for ${req.method} ${req.originalUrl}`
      );
      next();
    },
    // Apply auth middleware for protected review routes
    (req, res, next) => {
      // Skip auth for GET requests to public review routes (viewing reviews)
      if (req.method === 'GET' && req.path.match(/^\/products\/\d+\/reviews/)) {
        console.log(`[ROUTES] Skipping auth for public review route: ${req.path}`);
        return next();
      }

      // Skip auth for check route if no auth header (will return hasReviewed: false)
      if (req.method === 'GET' && req.path.includes('/check/') && !req.headers.authorization) {
        console.log(`[ROUTES] Skipping auth for check route without token: ${req.path}`);
        return next();
      }

      // Apply auth middleware for POST and protected routes
      console.log(`[ROUTES] Applying auth middleware for review route: ${req.path}`);
      authMiddleware(req, res, next);
    },
    createProxyMiddleware({
      target: process.env.REVIEW_SERVICE_URL || "http://localhost:5005",
      changeOrigin: true,
      pathRewrite: { "^/api/reviews": "/api/reviews" },
      onProxyReq: (proxyReq, req, res) => {
        // Truyền thông tin user từ API Gateway xuống review service
        if (req.user) {
          proxyReq.setHeader("x-user-id", req.user.id);
          proxyReq.setHeader("x-user-role", req.user.role);

          if (req.user.userType) {
            proxyReq.setHeader("x-user-type", req.user.userType);
          }

          console.log(
            `[PROXY] Adding user headers for review service - user ID: ${req.user.id}, role: ${
              req.user.role
            }, userType: ${req.user.userType || "undefined"}`
          );
        }

        console.log(
          `[PROXY] Forwarding ${req.method} ${req.url} to ${
            process.env.REVIEW_SERVICE_URL || "http://localhost:5005"
          }${proxyReq.path}`
        );
      },
      onProxyRes: (proxyRes, req, res) => {
        console.log(
          `[PROXY] Response ${proxyRes.statusCode} from Review Service`
        );

        // Ensure CORS headers are set
        const origin = req.headers.origin;
        if (origin) {
          res.setHeader("Access-Control-Allow-Origin", origin);
          res.setHeader("Access-Control-Allow-Credentials", "true");
        }
      },
      onError: (err, req, res) => {
        console.error(`[PROXY] Review Service Error:`, err.message);
        if (!res.headersSent) {
          res
            .status(500)
            .json({ error: "Review service error", details: err.message });
        }
      },
    })
  );

  // Product reviews route (public access)
  app.use(
    "/api/products",
    (req, res, next) => {
      // Only handle requests that end with /reviews
      if (req.originalUrl.includes('/reviews')) {
        console.log(
          `[ROUTES] Matched product reviews route for ${req.method} ${req.originalUrl}`
        );
        next();
      } else {
        next(); // Pass to other middleware
      }
    },
    createProxyMiddleware({
      target: process.env.REVIEW_SERVICE_URL || "http://localhost:5005",
      changeOrigin: true,
      // Filter only review requests  
      filter: (pathname, req) => {
        return pathname.includes('/reviews');
      },
      pathRewrite: (path, req) => {
        // Keep the path as is since Review Service expects /api/products/:id/reviews
        return path;
      },
      onProxyReq: (proxyReq, req, res) => {
        console.log(
          `[PROXY] Forwarding ${req.method} ${req.url} to ${
            process.env.REVIEW_SERVICE_URL || "http://localhost:5005"
          }${proxyReq.path}`
        );
      },
      onProxyRes: (proxyRes, req, res) => {
        console.log(
          `[PROXY] Response ${proxyRes.statusCode} from Review Service (products route)`
        );
      },
      onError: (err, req, res) => {
        console.error(`[PROXY] Review Service (products) Error:`, err.message);
        if (!res.headersSent) {
          res
            .status(500)
            .json({ error: "Review service error", details: err.message });
        }
      },
    })
  );
}

export default setupRoutes;
