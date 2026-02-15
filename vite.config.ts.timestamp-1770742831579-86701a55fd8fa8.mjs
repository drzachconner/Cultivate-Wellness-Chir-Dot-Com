// vite.config.ts
import { defineConfig } from "file:///Users/zachconnermba/Documents/Claude%20Code/Cultivate-Wellness-Chir-Dot-Com/node_modules/vite/dist/node/index.js";
import react from "file:///Users/zachconnermba/Documents/Claude%20Code/Cultivate-Wellness-Chir-Dot-Com/node_modules/@vitejs/plugin-react/dist/index.mjs";
var vite_config_default = defineConfig({
  plugins: [
    react(),
    {
      name: "security-headers",
      configureServer(server) {
        server.middlewares.use((req, res, next) => {
          res.setHeader("X-Content-Type-Options", "nosniff");
          res.setHeader("X-DNS-Prefetch-Control", "off");
          res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
          res.setHeader("Permissions-Policy", "camera=(), microphone=(), geolocation=()");
          res.setHeader(
            "Content-Security-Policy",
            "default-src 'self'; img-src 'self' data:; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; font-src 'self' data:; connect-src 'self'; frame-ancestors 'none'"
          );
          next();
        });
      }
    }
  ],
  optimizeDeps: {
    exclude: ["lucide-react"]
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvVXNlcnMvemFjaGNvbm5lcm1iYS9Eb2N1bWVudHMvQ2xhdWRlIENvZGUvQ3VsdGl2YXRlLVdlbGxuZXNzLUNoaXItRG90LUNvbVwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiL1VzZXJzL3phY2hjb25uZXJtYmEvRG9jdW1lbnRzL0NsYXVkZSBDb2RlL0N1bHRpdmF0ZS1XZWxsbmVzcy1DaGlyLURvdC1Db20vdml0ZS5jb25maWcudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL1VzZXJzL3phY2hjb25uZXJtYmEvRG9jdW1lbnRzL0NsYXVkZSUyMENvZGUvQ3VsdGl2YXRlLVdlbGxuZXNzLUNoaXItRG90LUNvbS92aXRlLmNvbmZpZy50c1wiO2ltcG9ydCB7IGRlZmluZUNvbmZpZyB9IGZyb20gJ3ZpdGUnO1xuaW1wb3J0IHJlYWN0IGZyb20gJ0B2aXRlanMvcGx1Z2luLXJlYWN0JztcblxuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKHtcbiAgcGx1Z2luczogW1xuICAgIHJlYWN0KCksXG4gICAge1xuICAgICAgbmFtZTogJ3NlY3VyaXR5LWhlYWRlcnMnLFxuICAgICAgY29uZmlndXJlU2VydmVyKHNlcnZlcikge1xuICAgICAgICBzZXJ2ZXIubWlkZGxld2FyZXMudXNlKChyZXEsIHJlcywgbmV4dCkgPT4ge1xuICAgICAgICAgIHJlcy5zZXRIZWFkZXIoJ1gtQ29udGVudC1UeXBlLU9wdGlvbnMnLCAnbm9zbmlmZicpO1xuICAgICAgICAgIHJlcy5zZXRIZWFkZXIoJ1gtRE5TLVByZWZldGNoLUNvbnRyb2wnLCAnb2ZmJyk7XG4gICAgICAgICAgcmVzLnNldEhlYWRlcignUmVmZXJyZXItUG9saWN5JywgJ3N0cmljdC1vcmlnaW4td2hlbi1jcm9zcy1vcmlnaW4nKTtcbiAgICAgICAgICByZXMuc2V0SGVhZGVyKCdQZXJtaXNzaW9ucy1Qb2xpY3knLCAnY2FtZXJhPSgpLCBtaWNyb3Bob25lPSgpLCBnZW9sb2NhdGlvbj0oKScpO1xuICAgICAgICAgIHJlcy5zZXRIZWFkZXIoXG4gICAgICAgICAgICAnQ29udGVudC1TZWN1cml0eS1Qb2xpY3knLFxuICAgICAgICAgICAgXCJkZWZhdWx0LXNyYyAnc2VsZic7IGltZy1zcmMgJ3NlbGYnIGRhdGE6OyBzY3JpcHQtc3JjICdzZWxmJyAndW5zYWZlLWlubGluZSc7IHN0eWxlLXNyYyAnc2VsZicgJ3Vuc2FmZS1pbmxpbmUnOyBmb250LXNyYyAnc2VsZicgZGF0YTo7IGNvbm5lY3Qtc3JjICdzZWxmJzsgZnJhbWUtYW5jZXN0b3JzICdub25lJ1wiXG4gICAgICAgICAgKTtcbiAgICAgICAgICBuZXh0KCk7XG4gICAgICAgIH0pO1xuICAgICAgfSxcbiAgICB9LFxuICBdLFxuICBvcHRpbWl6ZURlcHM6IHtcbiAgICBleGNsdWRlOiBbJ2x1Y2lkZS1yZWFjdCddLFxuICB9LFxufSk7XG4iXSwKICAibWFwcGluZ3MiOiAiO0FBQWtaLFNBQVMsb0JBQW9CO0FBQy9hLE9BQU8sV0FBVztBQUVsQixJQUFPLHNCQUFRLGFBQWE7QUFBQSxFQUMxQixTQUFTO0FBQUEsSUFDUCxNQUFNO0FBQUEsSUFDTjtBQUFBLE1BQ0UsTUFBTTtBQUFBLE1BQ04sZ0JBQWdCLFFBQVE7QUFDdEIsZUFBTyxZQUFZLElBQUksQ0FBQyxLQUFLLEtBQUssU0FBUztBQUN6QyxjQUFJLFVBQVUsMEJBQTBCLFNBQVM7QUFDakQsY0FBSSxVQUFVLDBCQUEwQixLQUFLO0FBQzdDLGNBQUksVUFBVSxtQkFBbUIsaUNBQWlDO0FBQ2xFLGNBQUksVUFBVSxzQkFBc0IsMENBQTBDO0FBQzlFLGNBQUk7QUFBQSxZQUNGO0FBQUEsWUFDQTtBQUFBLFVBQ0Y7QUFDQSxlQUFLO0FBQUEsUUFDUCxDQUFDO0FBQUEsTUFDSDtBQUFBLElBQ0Y7QUFBQSxFQUNGO0FBQUEsRUFDQSxjQUFjO0FBQUEsSUFDWixTQUFTLENBQUMsY0FBYztBQUFBLEVBQzFCO0FBQ0YsQ0FBQzsiLAogICJuYW1lcyI6IFtdCn0K
