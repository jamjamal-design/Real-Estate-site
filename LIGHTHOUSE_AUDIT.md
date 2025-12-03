# Lighthouse Audit Guide

## 🚨 Note: Lighthouse CLI Installation Blocked

Due to network connectivity issues with npm registry, Lighthouse CLI cannot be installed automatically. Use one of the alternative methods below.

## Alternative Audit Methods

### Method 1: Chrome DevTools (Recommended - No Installation Required)

1. **Open Chrome DevTools**:
   - Open your site in Google Chrome: `http://localhost:3000`
   - Press `F12` or right-click → Inspect
   - Go to **Lighthouse** tab

2. **Run Audit**:
   - Select categories: Performance, Accessibility, Best Practices, SEO
   - Choose device: Desktop and Mobile
   - Click **Analyze page load**

3. **Pages to Audit**:
   - Homepage: `http://localhost:3000`
   - Properties: `http://localhost:3000/properties`
   - About: `http://localhost:3000/about`
   - Contact: `http://localhost:3000/contact`
   - Admin Dashboard: `http://localhost:3000/admin` (after login)

### Method 2: Online Tools (For Production URLs)

- **PageSpeed Insights**: https://pagespeed.web.dev/
- **Web.dev Measure**: https://web.dev/measure/
- **GTmetrix**: https://gtmetrix.com/

### Method 3: Install Lighthouse When Network Resolves

```bash
# Check npm connectivity first
curl -I https://registry.npmjs.org

# If proxy needed
npm config set proxy http://proxy-server:port
npm config set https-proxy http://proxy-server:port

# Install Lighthouse globally
npm install -g lighthouse

# Run audits
lighthouse http://localhost:3000 --output html --output-path ./lighthouse-report-home.html
lighthouse http://localhost:3000/properties --output html --output-path ./lighthouse-report-properties.html
lighthouse http://localhost:3000/admin --output html --output-path ./lighthouse-report-admin.html
```

## Expected Performance Targets

### 🎯 Performance Goals

| Metric | Target | Critical |
|--------|--------|----------|
| First Contentful Paint (FCP) | < 1.8s | < 3s |
| Largest Contentful Paint (LCP) | < 2.5s | < 4s |
| Total Blocking Time (TBT) | < 200ms | < 600ms |
| Cumulative Layout Shift (CLS) | < 0.1 | < 0.25 |
| Speed Index | < 3.4s | < 5.8s |

### ♿ Accessibility Goals

- Score: **90+**
- All images have alt text
- Proper heading hierarchy
- Color contrast ratio > 4.5:1
- Keyboard navigation works
- ARIA labels where needed

### ✅ Best Practices Goals

- Score: **90+**
- HTTPS enabled (in production)
- No browser errors
- Images have explicit dimensions
- Secure authentication

### 🔍 SEO Goals

- Score: **90+**
- Meta descriptions present
- Title tags optimized
- Mobile-friendly
- Structured data where applicable

## Current Application Analysis

### Known Optimizations Already Implemented

✅ **Next.js 16 (Turbopack)**:
- Automatic code splitting
- Image optimization
- Built-in compression

✅ **Responsive Design**:
- Mobile-first approach
- Adaptive layouts
- Touch-friendly UI

✅ **Code Organization**:
- Component-based architecture
- API routes optimized
- Minimal bundle size

### Potential Issues to Check

⚠️ **Images**:
- Ensure all images use Next.js Image component
- Check for WebP format usage
- Verify lazy loading is working

⚠️ **API Calls**:
- Check for unnecessary re-renders
- Verify data caching
- Optimize loading states

⚠️ **Third-party Scripts**:
- Minimize external dependencies
- Use async/defer where possible
- Consider self-hosting critical resources

## Manual Performance Testing Checklist

### Desktop Testing (Chrome DevTools)

1. **Network Tab**:
   - [ ] Total page size < 3MB
   - [ ] Number of requests < 50
   - [ ] Time to Interactive < 3s

2. **Performance Tab**:
   - [ ] Record page load
   - [ ] Check for long tasks (> 50ms)
   - [ ] Verify no layout shifts

3. **Coverage Tab**:
   - [ ] Unused CSS < 20%
   - [ ] Unused JavaScript < 20%

### Mobile Testing

1. **Device Emulation**:
   - [ ] Test on iPhone 12 viewport
   - [ ] Test on Pixel 5 viewport
   - [ ] Check touch targets (min 44x44px)

2. **Throttling**:
   - [ ] Test on Slow 3G
   - [ ] Page loads < 10s on 3G
   - [ ] Critical content visible < 5s

### Accessibility Testing

1. **Keyboard Navigation**:
   - [ ] Tab through all interactive elements
   - [ ] Skip links work
   - [ ] Focus indicators visible

2. **Screen Reader**:
   - [ ] Headings structure makes sense
   - [ ] Images have descriptive alt text
   - [ ] Forms have proper labels

3. **Color Contrast**:
   - [ ] Text contrast ratio > 4.5:1
   - [ ] UI elements contrast > 3:1

## Optimization Recommendations

### High Priority

1. **Image Optimization**:
   ```jsx
   // Use Next.js Image component
   import Image from 'next/image'
   
   <Image 
     src="/property.jpg"
     alt="Property description"
     width={800}
     height={600}
     loading="lazy"
     placeholder="blur"
   />
   ```

2. **Font Optimization**:
   ```tsx
   // In layout.tsx
   import { Inter } from 'next/font/google'
   
   const inter = Inter({ 
     subsets: ['latin'],
     display: 'swap',
   })
   ```

3. **API Response Caching**:
   ```typescript
   // In api.ts
   axios.get('/properties', {
     headers: { 'Cache-Control': 'max-age=300' }
   })
   ```

### Medium Priority

1. **Code Splitting**:
   ```tsx
   // Dynamic imports for heavy components
   const AdminModal = dynamic(() => import('./AdminModal'), {
     loading: () => <LoadingSpinner />
   })
   ```

2. **Preload Critical Resources**:
   ```tsx
   // In layout.tsx head
   <link rel="preload" href="/logo.png" as="image" />
   <link rel="preconnect" href="https://api.yourdomain.com" />
   ```

3. **Minimize JavaScript**:
   - Remove console.logs in production
   - Tree-shake unused exports
   - Use production build

### Low Priority

1. **Service Worker** (for PWA):
   ```typescript
   // Add offline support
   // Cache static assets
   // Background sync for bookings
   ```

2. **Resource Hints**:
   ```tsx
   <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
   ```

## Monitoring in Production

### Continuous Performance Monitoring

1. **Real User Monitoring (RUM)**:
   - Use Vercel Analytics
   - Track Core Web Vitals
   - Monitor by geography

2. **Synthetic Monitoring**:
   - Schedule regular Lighthouse audits
   - Set performance budgets
   - Alert on regressions

3. **Key Metrics Dashboard**:
   - LCP trends over time
   - CLS incidents
   - FID percentiles

## Sample Lighthouse Audit Results (Expected)

### Homepage (`/`)

| Category | Score | Notes |
|----------|-------|-------|
| Performance | 85-95 | Next.js optimization |
| Accessibility | 90-100 | Good semantic HTML |
| Best Practices | 90-100 | Modern framework |
| SEO | 85-95 | Meta tags present |

### Properties Page (`/properties`)

| Category | Score | Notes |
|----------|-------|-------|
| Performance | 80-90 | Many images to optimize |
| Accessibility | 90-100 | Alt text on images |
| Best Practices | 90-100 | Proper image dimensions |
| SEO | 85-95 | Dynamic content |

### Admin Dashboard (`/admin`)

| Category | Score | Notes |
|----------|-------|-------|
| Performance | 85-95 | Interactive components |
| Accessibility | 85-95 | Complex forms |
| Best Practices | 90-100 | Auth implemented |
| SEO | N/A | Private page |

## Action Items

### Immediate (Do Now)

1. **Run Manual Chrome DevTools Audit**:
   - Open `http://localhost:3000` in Chrome
   - F12 → Lighthouse tab
   - Run audit on all pages
   - Document results

2. **Check Current Performance**:
   - Network tab analysis
   - Performance tab recording
   - Note any issues

### When Network Issue Resolves

1. **Install Lighthouse CLI**:
   ```bash
   npm install -g lighthouse
   ```

2. **Run Automated Audits**:
   ```bash
   ./run-lighthouse-audits.sh
   ```

3. **Generate Reports**:
   - HTML reports for each page
   - Compare before/after optimizations

### Ongoing

1. **Set Performance Budget**:
   - Max bundle size: 500KB
   - Max image size: 200KB
   - LCP < 2.5s

2. **Regular Audits**:
   - Weekly during development
   - Before each deployment
   - After major changes

## Troubleshooting

### Low Performance Score

- Check image sizes and formats
- Review JavaScript bundle size
- Test on slower network (3G)
- Check for render-blocking resources

### Low Accessibility Score

- Verify alt text on all images
- Check color contrast
- Test keyboard navigation
- Review ARIA labels

### Low Best Practices Score

- Update dependencies
- Fix console errors
- Use HTTPS in production
- Implement CSP headers

## Resources

- [Web.dev Performance Guide](https://web.dev/performance/)
- [Next.js Performance](https://nextjs.org/docs/advanced-features/measuring-performance)
- [Chrome DevTools](https://developer.chrome.com/docs/devtools/)
- [Lighthouse Scoring](https://developer.chrome.com/docs/lighthouse/performance/performance-scoring/)

## Summary

Since npm connectivity is currently blocked, use Chrome DevTools Lighthouse (Method 1) to run audits immediately. This requires no installation and provides the same comprehensive analysis as the CLI tool.

**To run audit now**:
1. Open Chrome
2. Navigate to `http://localhost:3000`
3. Press F12
4. Click "Lighthouse" tab
5. Select all categories
6. Click "Analyze page load"
7. Review recommendations
