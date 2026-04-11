import fs from "node:fs/promises";
import path from "node:path";
import os from "node:os";
import { spawnSync } from "node:child_process";

type BackupMode = "move" | "copy";

async function exists(filePath: string): Promise<boolean> {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

async function moveFile(sourcePath: string, targetPath: string): Promise<void> {
  try {
    await fs.rename(sourcePath, targetPath);
    return;
  } catch (error: unknown) {
    const code = (error as { code?: string })?.code;
    if (code !== "EXDEV") {
      throw error;
    }

    await fs.copyFile(sourcePath, targetPath);
    await fs.unlink(sourcePath);
  }
}

async function sleep(ms: number): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, ms));
}

async function copyWithRetries(sourcePath: string, targetPath: string): Promise<void> {
  let attempts = 0;

  while (attempts < 10) {
    try {
      await fs.copyFile(sourcePath, targetPath);
      return;
    } catch (error: unknown) {
      const code = (error as { code?: string })?.code;
      if (code !== "EBUSY" && code !== "EPERM") {
        throw error;
      }

      attempts += 1;
      await sleep(300);
    }
  }

  throw new Error(`Could not copy file after retries: ${sourcePath}`);
}

async function restoreDatabase(backupPath: string, dbPath: string): Promise<void> {
  if (await exists(dbPath)) {
    await fs.unlink(dbPath);
  }

  await moveFile(backupPath, dbPath);
}

async function backupDatabase(dbPath: string, backupPath: string): Promise<BackupMode> {
  try {
    await moveFile(dbPath, backupPath);
    return "move";
  } catch (error: unknown) {
    const code = (error as { code?: string })?.code;
    if (code !== "EBUSY" && code !== "EPERM") {
      throw error;
    }

    await copyWithRetries(dbPath, backupPath);
    return "copy";
  }
}

async function restoreFromCopyBackup(backupPath: string, dbPath: string): Promise<void> {
  await copyWithRetries(backupPath, dbPath);
}

async function main() {
  const projectRoot = process.cwd();
  const dbPath = path.join(projectRoot, "prisma", "dev.db");
  const tempDir = path.join(os.tmpdir(), `blog-devdb-backup-${Date.now()}`);
  const backupPath = path.join(tempDir, "dev.db");

  const buildCommand = process.argv.slice(2).join(" ") || "npm run build";

  await fs.mkdir(tempDir, { recursive: true });

  const hasOriginalDb = await exists(dbPath);
  let backupMode: BackupMode | null = null;

  if (hasOriginalDb) {
    backupMode = await backupDatabase(dbPath, backupPath);

    if (backupMode === "move") {
      console.log(`[db-preserve] Moved prisma/dev.db to temp: ${backupPath}`);
    } else {
      console.log("[db-preserve] dev.db is locked, using copy-backup mode.");
    }
  } else {
    console.log("[db-preserve] No prisma/dev.db found. Running rebuild without backup.");
  }

  const result = spawnSync(buildCommand, {
    cwd: projectRoot,
    stdio: "inherit",
    shell: true,
  });

  if (hasOriginalDb && (await exists(backupPath))) {
    if (backupMode === "copy") {
      await restoreFromCopyBackup(backupPath, dbPath);
    } else {
      await restoreDatabase(backupPath, dbPath);
    }

    console.log("[db-preserve] Restored original prisma/dev.db (replaced generated file if any).");
  }

  await fs.rm(tempDir, { recursive: true, force: true });

  if (typeof result.status === "number" && result.status !== 0) {
    process.exit(result.status);
  }

  if (result.error) {
    throw result.error;
  }
}

main().catch(async (error) => {
  console.error("[db-preserve] Failed:", error);
  process.exit(1);
});
