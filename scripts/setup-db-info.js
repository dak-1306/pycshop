#!/usr/bin/env node

console.log("");
console.log("🔧 DATABASE SETUP - Run this ONCE to optimize for 1M+ users:");
console.log("================================================");
console.log("");
console.log("Copy and run this command:");
console.log(
  "mysql -u root -p pycshop < microservice/db/MASTER_OPTIMIZATION.sql"
);
console.log("");
console.log("Or use MySQL Workbench to open and execute:");
console.log("microservice/db/MASTER_OPTIMIZATION.sql");
console.log("");
console.log("Note: Only run this ONCE when setting up the project");
console.log("");
