// Cross-platform delay script for Docker services
const delay = parseInt(process.argv[2]) || 10;
const service = process.argv[3] || "services";

console.log(`⏳ Waiting ${delay} seconds for ${service} to start...`);

const timer = setInterval(() => {
  process.stdout.write(".");
}, 1000);

setTimeout(() => {
  clearInterval(timer);
  console.log(`\n✅ ${service} should be ready now!`);
  process.exit(0);
}, delay * 1000);
