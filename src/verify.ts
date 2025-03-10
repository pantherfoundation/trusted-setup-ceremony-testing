import { execSync } from "child_process";
import * as path from "path";
import * as fs from "fs-extra";
import { contributionRootFolder, getContributionFolders, getCircuitR1cs, getZkeyFiles } from "./utils";

function verifyZkeyContribution(circuitR1cs: string, prevZkey: string, currentZkey: string, zkeyFile: string): boolean {
  try {
    execSync(`snarkjs zkey verify ${circuitR1cs} ${prevZkey} ${currentZkey}`, {
      stdio: "inherit",
    });
    console.log(`✅ ${zkeyFile} verification successful!`);
    return true;
  } catch (error) {
    console.error(`❌ Failed to verify ${zkeyFile}`);
    if (error instanceof Error) {
      console.error(error.message);
    }
    return false;
  }
}

function verifyAllContributions(contributionFolders: string[], circuitR1cs: string): void {
  for (let i = 1; i < contributionFolders.length; i++) {
    const prevFolder = contributionFolders[i - 1];
    const currentFolder = contributionFolders[i];

    console.log(`\nVerifying contributions in ${currentFolder}...`);

    const zkeyFiles = getZkeyFiles(prevFolder);
    if (zkeyFiles.length === 0) {
      console.error(`No .zkey files found in ${prevFolder}`);
      continue;
    }

    for (const zkeyFile of zkeyFiles) {
      const prevZkey = path.join(contributionRootFolder, prevFolder, zkeyFile);
      const currentZkey = path.join(contributionRootFolder, currentFolder, zkeyFile);

      if (!fs.existsSync(currentZkey)) {
        console.error(`Corresponding zkey file ${zkeyFile} not found in ${currentFolder}`);
        continue;
      }

      console.log(`\nVerifying ${zkeyFile}...`);
      verifyZkeyContribution(circuitR1cs, prevZkey, currentZkey, zkeyFile);
    }
  }
}

function main(): void {
  try {
    const contributionFolders = getContributionFolders();
    console.log(`Found ${contributionFolders.length} contributions`);

    if (contributionFolders.length < 2) {
      console.log("At least two contributions are needed for verification.");
      console.log("There's only the initial setup folder. Nothing to verify yet.");
      return;
    }

    const initialFolder = contributionFolders[0];
    const circuitR1cs = getCircuitR1cs(initialFolder);
    console.log(`Using circuit definition: ${circuitR1cs}`);

    verifyAllContributions(contributionFolders, circuitR1cs);
  } catch (error) {
    if (error instanceof Error) {
      console.error(`Error: ${error.message}`);
    } else {
      console.error(`Unknown error occurred: ${error}`);
    }
    process.exit(1);
  }
}

main();
