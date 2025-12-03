#!/bin/bash
# Lighthouse Audit Script (run when Lighthouse CLI is installed)

echo "🔍 Running Lighthouse Audits..."
echo "================================"

# Create reports directory
mkdir -p lighthouse-reports

# Pages to audit
declare -A pages=(
  ["home"]="http://localhost:3000"
  ["properties"]="http://localhost:3000/properties"
  ["about"]="http://localhost:3000/about"
  ["contact"]="http://localhost:3000/contact"
)

# Run audits for each page
for page in "${!pages[@]}"; do
  url="${pages[$page]}"
  echo ""
  echo "📊 Auditing: $page ($url)"
  
  lighthouse "$url" \
    --output html \
    --output json \
    --output-path "./lighthouse-reports/lighthouse-$page" \
    --chrome-flags="--headless" \
    --only-categories=performance,accessibility,best-practices,seo \
    --quiet
  
  if [ $? -eq 0 ]; then
    echo "✅ $page audit complete"
  else
    echo "❌ $page audit failed"
  fi
done

echo ""
echo "================================"
echo "✅ All audits complete!"
echo "📁 Reports saved to: ./lighthouse-reports/"
echo ""
echo "View reports:"
for page in "${!pages[@]}"; do
  echo "  - $page: ./lighthouse-reports/lighthouse-$page.html"
done
