import * as fs from "fs-extra";
import * as path from "path";
import { execSync } from "child_process";
import dotenv from "dotenv";

// Load environment variables from .env file
dotenv.config();

export const contributionRootFolder = './contributions';

// Get S3 configuration from environment variables
const S3_BUCKET_PATH = process.env.S3BUCKET || 's3://pp-trusted-test';
export const S3_BUCKET_NAME = S3_BUCKET_PATH.replace('s3://', '');
export const AWS_REGION = process.env.AWS_DEFAULT_REGION || 'us-east-2';
export const AWS_ENDPOINT = process.env.AWS_ENDPOINT_URL || `https://s3.${AWS_REGION}.amazonaws.com`;

// Use environment variables for AWS credentials
const AWS_ENV_VARS = {
  AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID,
  AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY,
  AWS_DEFAULT_REGION: AWS_REGION,
  AWS_ENDPOINT_URL: AWS_ENDPOINT
};

export function getDirectories(source: string): string[] {
  return fs
    .readdirSync(source, { withFileTypes: true })
    .filter((dirent) => dirent.isDirectory())
    .map((dirent) => dirent.name);
}

export function getZkeyFiles(directory: string): string[] {
  const zkFilesFolder = path.join(contributionRootFolder, directory);
  return fs.readdirSync(zkFilesFolder).filter((file) => file.endsWith(".zkey"));
}

export function getContributionFolders(): string[] {
  const folders = getDirectories(contributionRootFolder);
  const contributionFolders = folders.filter((f) => f.match(/^\d{4}_/));
  contributionFolders.sort();
  return contributionFolders;
}

export function getCircuitR1cs(initialFolder: string): string {
  const folder = path.join(contributionRootFolder, initialFolder);
  const r1csFiles = fs.readdirSync(folder).filter((file) => file.endsWith(".r1cs"));

  if (r1csFiles.length === 0) {
    throw new Error(`No .r1cs files found in ${initialFolder}`);
  }

  return path.join(initialFolder, r1csFiles[0]);
}

// Check if AWS CLI is available
function isAwsCliAvailable(): boolean {
  try {
    execSync('aws --version', { stdio: 'ignore' });
    return true;
  } catch (error) {
    return false;
  }
}

// Run AWS CLI commands with environment variables
function runAwsCommand(command: string, stdio: 'inherit' | 'pipe' | 'ignore' = 'inherit'): string {
  if (!isAwsCliAvailable()) {
    console.warn("AWS CLI not available or not compatible with current environment.");
    if (command.includes('s3 cp') && command.includes('--recursive')) {
      throw new Error("AWS CLI not available or not compatible with current environment.");
    }
    return '';
  }

  const envVars = { ...process.env, ...AWS_ENV_VARS };

  try {
    return execSync(command, { env: envVars, stdio, encoding: 'utf8' });
  } catch (error) {
    if (stdio === 'ignore') {
      return '';
    }
    console.warn(`Command failed: ${command}`);
    console.warn("This may be due to architecture compatibility issues in Docker.");
    return '';
  }
}

// S3 functions for downloading and uploading files
export function downloadFromS3(prefix?: string): boolean {
  try {
    const s3Path = prefix ? `${S3_BUCKET_PATH}/${prefix}` : S3_BUCKET_PATH;
    const localPath = prefix
      ? path.join(contributionRootFolder, prefix)
      : contributionRootFolder;

    // Ensure the local directory exists
    fs.ensureDirSync(localPath);

    if (!isAwsCliAvailable()) {
      console.warn("AWS CLI not available. Skipping S3 download.");
      return false;
    }

    console.log(`Downloading files from ${s3Path} to ${localPath}...`);
    const result = runAwsCommand(`aws s3 cp ${s3Path} ${localPath} --recursive`);

    if (result !== '') {
      console.log('Download complete!');
      return true;
    } else {
      console.warn('S3 download was not successful. Proceeding with local files only.');
      return false;
    }
  } catch (error) {
    console.error('Error downloading files from S3:', error);
    console.warn('Proceeding with local files only.');
    return false;
  }
}

export function uploadToS3(folderName: string): boolean {
  try {
    if (!isAwsCliAvailable()) {
      console.warn("AWS CLI not available. Skipping S3 upload.");
      return false;
    }

    const localPath = path.join(contributionRootFolder, folderName);
    const s3Path = `${S3_BUCKET_PATH}/${folderName}`;

    console.log(`Uploading files from ${localPath} to ${s3Path}...`);
    const result = runAwsCommand(`aws s3 cp ${localPath} ${s3Path} --recursive`);

    if (result !== '') {
      console.log('Upload complete!');
      return true;
    } else {
      console.warn('S3 upload was not successful.');
      return false;
    }
  } catch (error) {
    console.error('Error uploading files to S3:', error);
    return false;
  }
}

// Function to download the latest contribution folder
export function downloadLatestContribution(): string | null {
  try {
    if (!isAwsCliAvailable()) {
      console.warn("AWS CLI not available. Skipping S3 download check.");
      return null;
    }

    // List folders in S3 bucket and get the latest contribution folder
    const output = runAwsCommand(`aws s3 ls ${S3_BUCKET_PATH}/ | grep -o "[0-9]\\{4\\}_[^/]*/" | sort | tail -1`, 'pipe');

    if (!output) {
      console.log('No contribution folders found in S3 bucket or S3 access failed.');
      return null;
    }

    // Remove trailing slash
    const folderName = output.trim().replace(/\/$/, '');
    console.log(`Latest contribution folder in S3: ${folderName}`);

    // Check if the folder already exists locally
    const localPath = path.join(contributionRootFolder, folderName);
    if (fs.existsSync(localPath) && fs.readdirSync(localPath).length > 0) {
      console.log(`Folder ${folderName} already exists locally. Skipping download.`);
    } else {
      // Download the folder only if it doesn't exist locally
      const success = downloadFromS3(folderName);
      if (!success) {
        console.warn(`Could not download ${folderName} from S3. Will proceed with local files only.`);
      }
    }

    return folderName;
  } catch (error) {
    console.error('Error getting latest contribution from S3:', error);
    console.warn('Will proceed with local files only.');
    return null;
  }
}

// Download initial setup if not available locally
export function ensureInitialSetup(): void {
  const initialFolder = '0000_initial';
  const localPath = path.join(contributionRootFolder, initialFolder);

  // Create contributions root directory if it doesn't exist
  fs.ensureDirSync(contributionRootFolder);

  if (!fs.existsSync(localPath) || fs.readdirSync(localPath).length === 0) {
    console.log(`Initial setup folder not found locally. Attempting to download from S3...`);
    const success = downloadFromS3(initialFolder);

    if (!success) {
      console.warn(`
⚠️  WARNING: Could not download initial setup from S3.
If this is your first time running the tool, you need either:
1. A working AWS configuration to download the initial setup from S3
2. The initial setup files in ./contributions/0000_initial
3. To run in a supported environment (x86_64 or ARM with compatible AWS CLI)

If the initial folder doesn't exist, you can try manually downloading it or
check the README for alternative methods to get the initial files.
`);
    }
  } else {
    console.log(`Initial setup folder already exists locally.`);
  }
}