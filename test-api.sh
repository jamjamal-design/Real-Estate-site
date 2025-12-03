#!/bin/bash

# ZAJHAB Estates API Testing Script
# Run this to test all backend endpoints

echo "================================================"
echo "🧪 ZAJHAB Estates API Testing"
echo "================================================"
echo ""

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

BASE_URL="http://localhost:5000"
ADMIN_TOKEN="Adesinar12345."

# Test counter
PASS=0
FAIL=0

# Function to test endpoint
test_endpoint() {
    local name=$1
    local method=$2
    local url=$3
    local headers=$4
    local data=$5
    
    echo -n "Testing: $name ... "
    
    if [ "$method" = "GET" ]; then
        if [ -n "$headers" ]; then
            response=$(curl -s -w "%{http_code}" -H "$headers" "$url")
        else
            response=$(curl -s -w "%{http_code}" "$url")
        fi
    else
        response=$(curl -s -w "%{http_code}" -X "$method" -H "Content-Type: application/json" -H "$headers" -d "$data" "$url")
    fi
    
    status_code="${response: -3}"
    body="${response:0:${#response}-3}"
    
    if [ "$status_code" = "200" ] || [ "$status_code" = "201" ]; then
        echo -e "${GREEN}✓ PASS${NC} (Status: $status_code)"
        ((PASS++))
        if [ -n "$body" ]; then
            echo "   Response: $(echo $body | jq -r 'if type == "array" then "[\(length) items]" else .message // .title // . end' 2>/dev/null || echo "$body")"
        fi
    else
        echo -e "${RED}✗ FAIL${NC} (Status: $status_code)"
        ((FAIL++))
        echo "   Error: $body"
    fi
    echo ""
}

echo "📡 Testing Backend Endpoints"
echo "================================"
echo ""

# 1. Health Check
test_endpoint "Health Check" "GET" "$BASE_URL/"

# 2. Get All Properties
test_endpoint "Get All Properties" "GET" "$BASE_URL/api/properties"

# 3. Get Single Property (get first property ID)
PROPERTY_ID=$(curl -s "$BASE_URL/api/properties" | jq -r '.[0]._id // .[0].id' 2>/dev/null)
if [ -n "$PROPERTY_ID" ]; then
    test_endpoint "Get Single Property" "GET" "$BASE_URL/api/properties/$PROPERTY_ID"
else
    echo -e "${YELLOW}⚠ SKIP${NC} Get Single Property (No properties in database)"
    echo ""
fi

# 4. Get All Projects
test_endpoint "Get All Projects" "GET" "$BASE_URL/api/projects"

# 5. Create Booking (Public)
BOOKING_DATA='{
  "clientName": "Test User",
  "email": "test@example.com",
  "phone": "1234567890",
  "serviceType": "Consultation",
  "message": "Test booking from automated script"
}'
test_endpoint "Create Booking (Public)" "POST" "$BASE_URL/api/bookings" "" "$BOOKING_DATA"

# 6. Get Bookings (Admin)
test_endpoint "Get Bookings (Admin)" "GET" "$BASE_URL/api/bookings" "x-admin-token: $ADMIN_TOKEN"

# 7. Create Property (Admin)
PROPERTY_DATA='{
  "title": "Test Automated Property",
  "type": "Land",
  "price": 5000000,
  "location": "Test Location, Lagos",
  "size": "2 Acres",
  "description": "Automated test property",
  "images": ["https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800"],
  "status": "Available"
}'
test_endpoint "Create Property (Admin)" "POST" "$BASE_URL/api/properties" "x-admin-token: $ADMIN_TOKEN" "$PROPERTY_DATA"

# 8. Create Project (Admin)
PROJECT_DATA='{
  "title": "Test Automated Project",
  "clientName": "Test Client",
  "description": "Automated test project for API verification",
  "completionDate": "2024-12-01",
  "gallery": ["https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=500"]
}'
test_endpoint "Create Project (Admin)" "POST" "$BASE_URL/api/projects" "x-admin-token: $ADMIN_TOKEN" "$PROJECT_DATA"

# 9. Test unauthorized access (should fail with 401/403)
echo -n "Testing: Admin Endpoint Without Token ... "
response=$(curl -s -w "%{http_code}" "$BASE_URL/api/bookings")
status_code="${response: -3}"
if [ "$status_code" = "401" ] || [ "$status_code" = "403" ]; then
    echo -e "${GREEN}✓ PASS${NC} (Correctly blocked: $status_code)"
    ((PASS++))
else
    echo -e "${RED}✗ FAIL${NC} (Should return 401/403, got: $status_code)"
    ((FAIL++))
fi
echo ""

# Get test booking ID for status update
BOOKING_ID=$(curl -s -H "x-admin-token: $ADMIN_TOKEN" "$BASE_URL/api/bookings" | jq -r '.[0]._id // .[0].id' 2>/dev/null)

if [ -n "$BOOKING_ID" ] && [ "$BOOKING_ID" != "null" ]; then
    # 10. Update Booking Status (Admin)
    STATUS_DATA='{"status": "Completed"}'
    test_endpoint "Update Booking Status (Admin)" "PATCH" "$BASE_URL/api/bookings/$BOOKING_ID/status" "x-admin-token: $ADMIN_TOKEN" "$STATUS_DATA"
else
    echo -e "${YELLOW}⚠ SKIP${NC} Update Booking Status (No bookings to update)"
    echo ""
fi

echo "================================================"
echo "📊 Test Results Summary"
echo "================================================"
echo -e "${GREEN}Passed: $PASS${NC}"
echo -e "${RED}Failed: $FAIL${NC}"
echo "Total: $((PASS + FAIL))"
echo ""

if [ $FAIL -eq 0 ]; then
    echo -e "${GREEN}🎉 All tests passed!${NC}"
    exit 0
else
    echo -e "${RED}⚠️  Some tests failed. Check the output above.${NC}"
    exit 1
fi
