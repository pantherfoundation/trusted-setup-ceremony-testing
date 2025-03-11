# Panther Protocol Trusted Setup Ceremony

## Overview

This repository facilitates the trusted setup ceremony for a zero-knowledge circuit. Each participant contributes randomness to the process, ensuring no single entity possesses the complete "toxic waste" that could potentially compromise the system's security.

The ceremony is sequential - each participant builds upon the previous contribution. This approach ensures the security of the final parameters as long as at least one participant is honest.

## Time Commitment

- **Preparation time**: ~5-15 minutes to set up your environment
- **Contribution time**: ~5-10 minutes of uninterrupted time when it's your turn
- **Availability**: You should be responsive in the communication channel during your turn to avoid delays for other participants

## Prerequisites

Before participating, ensure you have:

- [Docker](https://docs.docker.com/get-docker/) - For running the contribution environment
- [Git](https://git-scm.com/downloads) - For repository management
- [AWS CLI](https://aws.amazon.com/cli/) - For interacting with S3 storage
- Basic familiarity with command-line operations

### Setting Up S3 Access


1. Copy the `.env.example` file to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Edit the `.env` file and fill in your AWS credentials:
   ```
   AWS_ACCESS_KEY_ID=your_access_key_here
   AWS_SECRET_ACCESS_KEY=your_secret_key_here
   AWS_DEFAULT_REGION="us-east-2"
   AWS_ENDPOINT_URL="https://s3.us-east-2.amazonaws.com"
   S3BUCKET="s3://pp-trusted-test"
   ```


## Security Best Practices

For maximum security of the ceremony, we recommend:

- Use a freshly installed operating system
- Disconnect from the internet after downloading the necessary files
- Utilize a computer with a hardware random number generator
- Securely wipe or physically destroy storage media after participating

While following these recommendations provides maximum security, any contribution remains valuable even if all security measures cannot be implemented.

## Participation Guide

### 1. Fork and Clone the Repository

1. Fork this repository to your GitHub account
2. Clone your fork:
   ```bash
   git clone https://github.com/<Your-GitHub-Username>/trusted-setup-ceremony.git
   cd trusted-setup-ceremony
   ```

### 2. Set Up Environment Variables (Optional)

You can customize the S3 bucket used for file storage by setting environment variables:

```bash
export S3_BUCKET_NAME=your-custom-bucket-name
export S3_REGION=your-aws-region
```

By default, the ceremony uses the bucket `trusted-setup-files` in the `us-east-1` region.

### 3. Contribute to the Ceremony

Select **one** of the following contribution methods:

#### Option A: Using Pre-built Docker Image

```bash
docker run --user $(id -u):$(id -g) --rm -it -v $(pwd)/contributions:/app/contributions pantherprotocol/trusted-setup-ceremony:latest contribute
```

#### Option B: Build Docker Image Yourself (Recommended)

```bash
docker build -t trusted-setup-ceremony .
docker run --user $(id -u):$(id -g) --rm -it -v $(pwd)/contributions:/app/contributions trusted-setup-ceremony contribute
```

#### Option C: Using Node.js Directly

```bash
npm install
npm run contribute
```

### 4. Interactive Contribution Process

During your contribution, you will:
- Provide your GitHub username for attribution
- Generate entropy by typing randomly on your keyboard
- Wait for the process to complete, which creates a new folder containing your contribution and attestation
- Your contribution will automatically be uploaded to the S3 bucket

### 5. Verify Your Contribution

After contributing, you should verify that your contribution was processed correctly. The verification tool will automatically download any necessary files that aren't present locally.

Select **one** of the following verification methods:

#### Option A: Using Pre-built Docker Image

```bash
docker run --user $(id -u):$(id -g) --rm -it -v $(pwd)/contributions:/app/contributions pantherprotocol/trusted-setup-ceremony:latest verify
```

#### Option B: Build Docker Image Yourself (Recommended)

```bash
docker build -t trusted-setup-ceremony .
docker run --user $(id -u):$(id -g) --rm -it -v $(pwd)/contributions:/app/contributions trusted-setup-ceremony verify
```

#### Option C: Using Node.js Directly

```bash
npm install
npm run verify
```

For more detailed information about the verification process, see the [Verification Guide](#verification-guide) section below.

### 6. Submit Your Contribution

After your contribution is complete, follow these steps to submit it:

```bash
# Add all changes to git
git add .

# Commit your changes with a descriptive message
git commit -m "feat: add contribution"

# Push to your fork
git push origin main
```

Then create a pull request:

1. Go to the main repository on GitHub
2. Click on "Pull requests" tab
3. Click the "New pull request" button
4. Select your fork and branch
5. Add a title and description explaining your contribution
6. Click "Create pull request"

The maintainers will review your contribution and merge it into the main branch after verification.

## Troubleshooting

### Network Issues

If you encounter connectivity problems:

1. Verify your firewall settings allow the required connections
2. For NAT router users, enable UPnP or configure port forwarding
3. Try an alternative contribution method from Section 2

### Alternative File Sharing Methods

If standard contribution methods fail, consider:

1. Submitting a pull request with your contribution files
2. Sharing files via secure cloud storage (Google Drive, Dropbox)
3. Using [Magic-Wormhole](https://magic-wormhole.readthedocs.io/) for secure file transfer

## Platform-Specific Instructions

### Linux and macOS

The commands provided in this guide work natively on Linux and macOS systems.

### Windows

For Windows users, adjust commands as follows:

**PowerShell:**
```powershell
docker run--user $(id -u):$(id -g) --rm -it -v ${PWD}/contributions:/app/contributions pantherprotocol/trusted-setup-ceremony contribute
```

**Command Prompt:**
```cmd
docker run --user $(id -u):$(id -g) --rm -it -v %cd%/contributions:/app/contributions pantherprotocol/trusted-setup-ceremony contribute
```

**For path-related issues**, use absolute paths:
```cmd
docker run --user $(id -u):$(id -g) --rm -it -v C:\full\path\to\trusted-setup-contributions:/app/contributions pantherprotocol/trusted-setup-ceremony contribute
```

## Verification Guide

This section provides detailed information about the verification process, including automatic file downloads, understanding results, and troubleshooting.

### Automatic File Downloads

When running verification, the following will happen automatically if files are missing:

- **PTAU File**: The Powers of Tau file (powersOfTau28_hez_final_17.ptau) will be downloaded from S3 if not found locally
- **Initial Setup**: If the initial setup folder (0000_initial) isn't present locally, it will be downloaded
- **Contribution Folders**:
  - If you have no contribution folders or only the initial setup folder, **all** contributions will be downloaded from S3
  - If you already have multiple contribution folders, the verification will use your existing local files
  - To force a fresh download of all contributions, delete the contributions folder first

### Understanding Verification Results

After the verification completes, a summary table will be displayed showing:

- A table with each circuit and contribution combination
- The status (PASS/FAIL) for each verified circuit
- Overall statistics showing total verifications, passed tests, and failed tests
- Details of any failed verifications for troubleshooting

Example output:
```
=== VERIFICATION SUMMARY ===

Contribution           | zAccountRegistration | zAccountRenewal    | zSwap             | zTransaction
---------------------- | ------------------- | ----------------- | ----------------- | -----------------
0001_pycckuu           | ✅ PASS             | ✅ PASS           | ✅ PASS           | ✅ PASS
0002_pycckuu           | ✅ PASS             | ✅ PASS           | ✅ PASS           | ✅ PASS
0003_pycckuu           | ✅ PASS             | ✅ PASS           | ✅ PASS           | ✅ PASS

=== OVERALL RESULTS ===
Total verification tests: 12
Passed: 12
Failed: 0
```

#### Troubleshooting Verification

If verification fails, check:

- Network connectivity to download required files
- S3 credentials if files can't be downloaded
- Free disk space for downloaded files
- Whether the initial zkey files match the contribution files being verified

## Platform-Specific Instructions

### Linux and macOS

The commands provided in this guide work natively on Linux and macOS systems.

### Windows

For Windows users, adjust commands as follows:

**PowerShell:**
```powershell
docker run--user $(id -u):$(id -g) --rm -it -v ${PWD}/contributions:/app/contributions pantherprotocol/trusted-setup-ceremony contribute
```

**Command Prompt:**
```cmd
docker run --user $(id -u):$(id -g) --rm -it -v %cd%/contributions:/app/contributions pantherprotocol/trusted-setup-ceremony contribute
```

**For path-related issues**, use absolute paths:
```cmd
docker run --user $(id -u):$(id -g) --rm -it -v C:\full\path\to\trusted-setup-contributions:/app/contributions pantherprotocol/trusted-setup-ceremony contribute
```

## Technical Details

### Docker Image Information

The official ceremony Docker image is available on Docker Hub:

```bash
docker pull pantherprotocol/trusted-setup-ceremony:latest
```
You can specify a version by replacing `:latest` with a version tag (e.g., `:0.1`).

### Docker Command Parameters Explained

- `-v $(pwd)/contributions:/app/contributions` - Mounts your local contributions directory to the container
- `-it` - Enables interactive mode required for entropy input
- `--rm` - Automatically removes the container after execution
- The image supports both AMD64 (x86_64) and ARM64 architectures

### Verification Technical Details

The verification process:
1. Uses snarkjs `zkvi` command to verify each contribution
2. Compares each contribution against the initial setup using the PTAU file
3. Requires approximately 8GB RAM for verification
4. Can take 5-15 minutes to complete depending on hardware

## Coordinator Instructions

If you are coordinating the ceremony:

1. Initialize the repository by copying the r1cs and zkey files to the `contributions/0000_initial` folder
2. Push this initial setup to the repository
3. Regular verification helps ensure the integrity of each contribution
4. Monitor the verification summary table for any failed verifications



