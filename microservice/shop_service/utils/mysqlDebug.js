import db from "../../db/index.js";

export const checkMySQLStatus = async () => {
  try {
    console.log("\n=== MySQL Status Debug ===");

    // Check active connections
    const [processlist] = await db.execute("SHOW PROCESSLIST");
    console.log("Active Connections:", processlist.length);

    processlist.forEach((proc, index) => {
      if (proc.Command !== "Sleep") {
        console.log(
          `[${index}] ID: ${proc.Id}, User: ${proc.User}, DB: ${proc.db}, Command: ${proc.Command}, Time: ${proc.Time}s, State: ${proc.State}`
        );
      }
    });

    // Check innodb status
    const [innodbStatus] = await db.execute("SHOW ENGINE INNODB STATUS");
    const statusText = innodbStatus[0].Status;

    // Extract lock information
    const lockSection = statusText.match(/TRANSACTIONS\n([\s\S]*?)(?=\n---)/);
    if (lockSection) {
      console.log("\n=== InnoDB Lock Info ===");
      console.log(lockSection[1].substring(0, 1000) + "...");
    }

    // Check current settings
    const [lockTimeout] = await db.execute(
      "SHOW VARIABLES LIKE 'innodb_lock_wait_timeout'"
    );
    const [isolation] = await db.execute(
      "SHOW VARIABLES LIKE 'transaction_isolation'"
    );

    console.log("\n=== Settings ===");
    console.log("Lock wait timeout:", lockTimeout[0].Value, "seconds");
    console.log("Transaction isolation:", isolation[0].Value);

    console.log("=== End Debug ===\n");
  } catch (error) {
    console.error("Error checking MySQL status:", error);
  }
};

export const killLongRunningQueries = async (maxTimeSeconds = 60) => {
  try {
    const [processlist] = await db.execute("SHOW PROCESSLIST");

    const longRunning = processlist.filter(
      (proc) =>
        proc.Time > maxTimeSeconds &&
        proc.Command !== "Sleep" &&
        proc.User !== "root"
    );

    console.log(
      `Found ${longRunning.length} long-running queries (>${maxTimeSeconds}s)`
    );

    for (const proc of longRunning) {
      console.log(`Killing process ${proc.Id}: ${proc.Info}`);
      await db.execute(`KILL ${proc.Id}`);
    }
  } catch (error) {
    console.error("Error killing long-running queries:", error);
  }
};

export default { checkMySQLStatus, killLongRunningQueries };
