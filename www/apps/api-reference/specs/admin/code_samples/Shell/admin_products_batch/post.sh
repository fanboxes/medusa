curl -X POST '{backend_url}/admin/products/batch' \
-H 'Authorization: Bearer {access_token}' \
--data-raw '{
  "delete": [
    "prod_123"
  ]
}'