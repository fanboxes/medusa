curl -X POST '{backend_url}/auth/customer/emailpass/update' \
-H 'Content-Type: application/json' \
-H 'Authorization: Bearer {token}' \
--data-raw '{
  "email": "customer@gmail.com",
  "password": "supersecret"
}'