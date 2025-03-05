curl -X POST '{backend_url}/auth/user/emailpass/update' \
-H 'Content-Type: application/json' \
-H 'Authorization: Bearer {token}' \
--data-raw '{
  "email": "admin@medusa-test.com",
  "password": "supersecret"
}'