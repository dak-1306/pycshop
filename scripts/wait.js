// Cross-platform delay script
const delay = parseInt(process.argv[2]) || 10;

console.log(`⏳ Waiting ${delay} seconds for Kafka to start...`);

const timer = setInterval(() => {
  process.stdout.write(".");
}, 1000);

setTimeout(() => {
  clearInterval(timer);
  console.log("\n✅ Kafka should be ready now!");
  process.exit(0);
}, delay * 1000);
