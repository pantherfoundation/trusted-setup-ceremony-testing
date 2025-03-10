import * as fs from "fs-extra";
import { execSync } from "child_process";
import * as readlineSync from "readline-sync";
import * as path from "path";
import * as crypto from "crypto";
import { getContributionFolders, getZkeyFiles } from "./utils";

interface ContributionConfig {
  contributionNumber: string;
  githubUsername: string;
  folderName: string;
  timestamp: string;
}

interface ZkeyContribution {
  filename: string;
  hash: string;
}

interface ContributionResult {
  config: ContributionConfig;
  contributions: ZkeyContribution[];
}

function generateSecureEntropy(): string {
  return crypto.randomBytes(128).toString("hex");
}

function generateSystemEntropy(): string {
  try {
    const systemEntropy = execSync("LC_ALL=C tr -dc 'A-F0-9' < /dev/urandom | head -c32", {
      encoding: 'utf8'
    });
    console.log("System entropy added from /dev/urandom");
    return systemEntropy;
  } catch (error) {
    // First fallback using hexdump if available
    try {
      const systemEntropy = execSync("head -c16 /dev/urandom | xxd -p | tr -d '\\n'", {
        encoding: 'utf8'
      });
      console.log("System entropy added using /dev/urandom and xxd");
      return systemEntropy;
    } catch (innerError) {
      console.log("Could not generate system entropy. Skipping.");
      return "";
    }
  }
}

function collectAdditionalEntropy(): string {
  if (readlineSync.keyInYN("Would you like to add additional entropy by typing random keys?")) {
    const additionalEntropy = readlineSync.question("Please mash your keyboard randomly (hidden input): ", {
      hideEchoBack: true,
    });
    console.log("Additional entropy received");
    return additionalEntropy;
  }
  return "";
}

function setupContribution(): ContributionConfig {
  const contributionFolders = getContributionFolders();
  const lastFolder = contributionFolders[contributionFolders.length - 1];
  const lastContribution = parseInt(lastFolder.substring(0, 4));
  const contributionNumber = (lastContribution + 1).toString().padStart(4, "0");

  const githubUsername = readlineSync.question("Enter your GitHub username: ");
  const folderName = `${contributionNumber}_${githubUsername}`;

  fs.mkdirSync(folderName);

  return {
    contributionNumber,
    githubUsername,
    folderName,
    timestamp: new Date().toISOString(),
  };
}

function contributeToZkey(zkeyFile: string, lastFolder: string, config: ContributionConfig, baseEntropy: string): ZkeyContribution {
  console.log(`\nProcessing ${zkeyFile}...`);

  const latestZkey = path.join(lastFolder, zkeyFile);
  const newZkey = path.join(config.folderName, zkeyFile);

  console.log(`Contributing to ${zkeyFile}...`);
  const contributionName = `Contribution #${config.contributionNumber} from ${config.githubUsername}`;

  const uniqueEntropy = crypto.createHash("sha512").update(baseEntropy, "utf8").digest("hex");
  const command = `echo ${uniqueEntropy} | snarkjs zkey contribute -v ${latestZkey} ${newZkey} --name="${contributionName}"`;

  console.log(`Executing contribution command (not showing entropy for security)...`);
  execSync(command, { stdio: "inherit" });

  const vkeyName = zkeyFile.replace(".zkey", "_verification_key.json");
  const vkey = path.join(config.folderName, vkeyName);
  execSync(`snarkjs zkey export verificationkey ${newZkey} ${vkey}`, { stdio: "inherit" });

  const transcriptPath = path.join(config.folderName, `${zkeyFile}_transcript.txt`);
  fs.writeFileSync(transcriptPath, `Contribution to ${zkeyFile} by ${config.githubUsername}\nTimestamp: ${config.timestamp}\n`);

  console.log(`✅ Contribution to ${zkeyFile} complete!`);

  const hash = crypto.createHash("sha256").update(fs.readFileSync(newZkey)).digest("hex");

  return {
    filename: zkeyFile,
    hash,
  };
}

function createMetadataFiles(config: ContributionConfig, contributions: ZkeyContribution[]): void {
  fs.writeFileSync(
    path.join(config.folderName, "contribution.txt"),
    `Contribution by ${config.githubUsername}\nTimestamp: ${config.timestamp}\n\nEntropy was generated using a secure method and has been deleted.`
  );

  console.log("\nGenerating attestation file...");
  const attestationPath = path.join(config.folderName, "attestation.json");

  const attestationData = {
    contributor: config.githubUsername,
    contributionNumber: config.contributionNumber,
    timestamp: config.timestamp,
    files: contributions,
  };

  fs.writeFileSync(attestationPath, JSON.stringify(attestationData, null, 2));

  console.log(`✅ Attestation generated at ${attestationPath}`);
}

function performContributions(config: ContributionConfig, lastFolder: string): ZkeyContribution[] {
  const zkeyFiles = getZkeyFiles(lastFolder);

  if (zkeyFiles.length === 0) {
    throw new Error(`No .zkey files found in ${lastFolder}`);
  }

  console.log(`Found ${zkeyFiles.length} zkey files to contribute to.`);

  const systemEntropy = generateSystemEntropy();
  const additionalEntropy = collectAdditionalEntropy();
  const mainEntropy = generateSecureEntropy();
  const baseEntropy = mainEntropy + additionalEntropy + systemEntropy;
  console.log("Secure entropy generated (not displayed for security)");

  return zkeyFiles.map((zkeyFile) => {
    const fileSpecificEntropy = baseEntropy + zkeyFile;
    return contributeToZkey(zkeyFile, lastFolder, config, fileSpecificEntropy);
  });
}

function runContributionCeremony(): ContributionResult {
  const config = setupContribution();

  const contributionFolders = getContributionFolders();
  const lastFolder = contributionFolders[contributionFolders.length - 2];

  const contributions = performContributions(config, lastFolder);

  createMetadataFiles(config, contributions);

  return { config, contributions };
}

function main(): void {
  try {
    const result = runContributionCeremony();

    console.log(`\nAll contributions complete! Your contributions are in the ${result.config.folderName} folder.`);
    console.log("Please commit and push this folder to the repository.");
    console.log("\n⚠️ IMPORTANT: For security, entropy values were NOT saved anywhere and should now be gone from memory.");
  } catch (error) {
    console.error("Error during contribution process:", error);
    process.exit(1);
  }
}

main();
