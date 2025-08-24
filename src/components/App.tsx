@@ .. @@
   React.useEffect(() => {
+    // Handle initial load and authentication check
     checkAuth();
+    
+    // Handle direct dashboard URL access
+    if (window.location.pathname === '/dashboard') {
+      // Wait for auth check to complete
+      const checkAndRedirect = async () => {
+        try {
+          const user = await authService.getCurrentUser();
+          if (user) {
+            window.history.replaceState(null, '', '/#dashboard');
+            window.location.reload(); // Ensure proper state update
+          } else {
+            window.history.replaceState(null, '', '/');
+          }
+        } catch (error) {
+          window.history.replaceState(null, '', '/');
+        }
+      };
+      checkAndRedirect();
+    }
   }, [checkAuth]);