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
      next();
    },
    createProxyMiddleware({
      target: process.env.AUTH_SERVICE_URL || "http://localhost:5001",
      changeOrigin: true,
      pathRewrite: { "^/auth": "" },
      onProxyReq: (proxyReq, req, res) => {
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
    createProxyMiddleware({
      target: process.env.PRODUCT_SERVICE_URL,
      changeOrigin: true,
      pathRewrite: { "^/products": "" },
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
