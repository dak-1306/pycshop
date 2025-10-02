import { createProxyMiddleware } from "http-proxy-middleware";

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
          proxyReq.setHeader("x-user-type", req.user.userType);
          console.log(
            `[PROXY] Adding user headers for user ID: ${req.user.id}, role: ${req.user.role}`
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
      },
      onError: (err, req, res) => {
        console.error(`[PROXY] Error:`, err.message);
        if (!res.headersSent) {
          res.status(500).json({ error: "Proxy error", details: err.message });
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
      // Add /seller prefix back since Express strips it
      pathRewrite: { "^/": "/seller/" },
      onProxyReq: (proxyReq, req, res) => {
        console.log(
          `[PROXY] Forwarding ${req.method} ${req.url} to ${
            process.env.PRODUCT_SERVICE_URL || "http://localhost:5002"
          }${proxyReq.path}`
        );
        console.log(
          `[PROXY] Original URL: ${req.originalUrl} -> Target: ${proxyReq.path}`
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
}

export default setupRoutes;
