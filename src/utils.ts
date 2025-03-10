import * as fs from "fs-extra";
import * as path from "path";

export function getDirectories(source: string): string[] {
  return fs
    .readdirSync(source, { withFileTypes: true })
    .filter((dirent) => dirent.isDirectory())
    .map((dirent) => dirent.name);
}

export function getZkeyFiles(directory: string): string[] {
  return fs.readdirSync(directory).filter((file) => file.endsWith(".zkey"));
}

export function getContributionFolders(): string[] {
  const folders = getDirectories("./");
  const contributionFolders = folders.filter((f) => f.match(/^\d{4}_/));
  contributionFolders.sort();
  return contributionFolders;
}

export function getCircuitR1cs(initialFolder: string): string {
  const r1csFiles = fs.readdirSync(initialFolder).filter((file) => file.endsWith(".r1cs"));

  if (r1csFiles.length === 0) {
    throw new Error(`No .r1cs files found in ${initialFolder}`);
  }

  return path.join(initialFolder, r1csFiles[0]);
}