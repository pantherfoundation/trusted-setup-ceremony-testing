# Panther Protocol Trusted Setup Ceremony

## Overview

This repository manages a trusted setup ceremony for a zero-knowledge circuit. Each participant contributes randomness to ensure that no single person knows the "toxic waste" that could compromise the system's security.

The ceremony is sequential - each participant builds upon the previous contribution. This approach ensures the security of the final parameters as long as at least one participant is honest.

## Time Requirements

- **Preparation time**: ~5-15 minutes to set up your environment
- **Contribution time**: ~5-10 minutes of uninterrupted time when it's your turn
- **Availability**: You should be responsive in the communication channel during your turn to avoid delays for other participants

## Prerequisites

- [Docker](https://docs.docker.com/get-docker/) installed on your system
- [Git](https://git-scm.com/downloads) for cloning the repository
- [Git LFS](https://git-lfs.github.com/) (Large File Storage) for handling large files
- Familiarity with running commands from the command line

### Installing Git LFS

1. Download and install Git LFS from [git-lfs.github.com](https://git-lfs.github.com/)
2. Set up Git LFS for your user account:
   ```bash
   git lfs install
   ```

This repository uses Git LFS to manage large files generated during the ceremony. Without Git LFS, you won't be able to properly clone or contribute to the repository.

## Security Recommendations

For maximum security of the ceremony, we recommend:

- Use a freshly installed operating system
- Disconnect from the internet after downloading the necessary files
- Use a computer with a hardware random number generator
- Securely delete or physically destroy storage media after participating

However, any contribution is valuable and appreciated, even if it doesn't follow all these recommendations.

## Participation Process

### 1. Fork and Clone the Repository

1. Fork this repository to your GitHub account
2. Clone your forked repository:
   ```bash
   git clone https://github.com/<Your-GitHub-Username>/trusted-setup-ceremony.git
   cd trusted-setup-ceremony
   ```

### 2. Contribute to the Ceremony

Choose **one** of the following methods to contribute:

#### Option A: Using Pre-built Docker Image

```bash
docker run --rm -it -v $(pwd)/contibutions:/app/contibutions pantherprotocol/trusted-setup-ceremony:latest contribute
```

#### Option B: Build Docker Image Yourself (Recommended)

```bash
docker build -t trusted-setup-ceremony .
docker run --rm -it -v $(pwd)/contibutions:/app/contibutions trusted-setup-ceremony contribute
```

#### Option C: Using Node.js Directly

```bash
npm install
npm run contribute
```

### 3. Follow the Interactive Prompts

During the contribution process, you will be asked to:
- Enter your GitHub username
- Provide random entropy (by typing randomly on your keyboard)
- Wait for the process to complete, which will create a new folder with your contribution and attestation

### 4. Verify Your Contribution (THIS STEP IS NOT WORKING YET)

After contributing, verify that your contribution was processed correctly:

#### Option A: Using Pre-built Docker Image

```bash
docker run --rm -it -v $(pwd)/contibutions:/app/contibutions pantherprotocol/trusted-setup-ceremony:latest verify
```

#### Option B: Build Docker Image Yourself (Recommended)

```bash
docker build -t trusted-setup-ceremony .
docker run --rm -it -v $(pwd)/contibutions:/app/contibutions verify
```

#### Option C: Using Node.js Directly

```bash
npm install
npm run verify
```

### 5. Submit Your Contribution

Commit and push your changes to your forked repository:

```bash
git add .
git commit -m "Add contribution from YOUR_GITHUB_USERNAME"
git push origin main
```

Then create a pull request to merge your contribution back to the main repository.

## Troubleshooting

### Network Connectivity Issues

If you encounter issues with the contribution process:

1. Ensure your firewall allows the required connections
2. If using a NAT router, consider enabling UPnP or setting up port forwarding
3. Try the alternative contribution methods listed in section 2

### Contingency Plans for File Sharing

If the standard contribution method fails, you can try:

1. Submitting a PR with your contribution files
2. Uploading files to cloud storage (Google Drive, Dropbox) and sharing the link
3. Using a secure file transfer tool like [Magic-Wormhole](https://magic-wormhole.readthedocs.io/)

## Platform-Specific Instructions

### Linux and macOS

The commands shown above work as-is on Linux and macOS systems.

### Windows

On Windows, use one of these command formats:

**PowerShell:**
```powershell
docker run --rm -it -v ${PWD}/contibutions:/app/contibutions pantherprotocol/trusted-setup-ceremony contribute
```

**Command Prompt:**
```cmd
docker run --rm -it -v %cd%/contibutions:/app/contibutions pantherprotocol/trusted-setup-ceremony contribute
```

**If you encounter path issues**, use absolute paths:
```cmd
docker run --rm -it -v C:\full\path\to\trusted-setup-contrubutions:/app/contibutions pantherprotocol/trusted-setup-ceremony contribute
```

## Technical Details

### Docker Image Information

The official ceremony Docker image is available on Docker Hub:

```bash
docker pull pantherprotocol/trusted-setup-ceremony:latest
```

You can use a specific version by replacing `:latest` with a version tag like `:0.1`.

### Understanding Docker Commands

- `-v $(pwd)/contributions:/app/contributions` mounts the `contributions` folder in your current directory to the container
- `-it` enables interactive input required for the contribution
- `--rm` removes the container after execution
- The Docker image supports both AMD64 (x86_64) and ARM64 architectures

## For Coordinators Only

If you are coordinating the ceremony:

1. Initialize the repository by copying r1cs and zkey files to the `0000_initial` folder
2. Push this initial setup to the repository


