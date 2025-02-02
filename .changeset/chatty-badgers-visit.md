---
"create-medusa-app": patch
---

Fix issue where create-medusa-app repeatedly asked for database credentials even when --db-url was specified. The logic in MedusaProjectCreator->create()->initializeProject()->setupDatabase() always defines a dbName. Updated the getDbClientAndCredentials() method to check db-url first
