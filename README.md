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
- [Git LFS](https://git-lfs.github.com/) - For handling large files
- Basic familiarity with command-line operations

### Setting Up Git LFS

1. Install Git LFS from [git-lfs.github.com](https://git-lfs.github.com/)
2. Configure Git LFS for your account:
   ```bash
   git lfs install
   ```

> **Important:** This repository uses Git LFS to manage large files generated during the ceremony. Without Git LFS properly configured, you won't be able to clone or contribute to the repository correctly.

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

### 2. Contribute to the Ceremony

Select **one** of the following contribution methods:

#### Option A: Using Pre-built Docker Image

```bash
docker run --rm -it -v $(pwd)/contributions:/app/contributions pantherprotocol/trusted-setup-ceremony:latest contribute
```

#### Option B: Build Docker Image Yourself (Recommended)

```bash
docker build -t trusted-setup-ceremony .
docker run --rm -it -v $(pwd)/contributions:/app/contributions trusted-setup-ceremony contribute
```

#### Option C: Using Node.js Directly

```bash
npm install
npm run contribute
```

### 3. Interactive Contribution Process

During your contribution, you will:
- Provide your GitHub username for attribution
- Generate entropy by typing randomly on your keyboard
- Wait for the process to complete, which creates a new folder containing your contribution and attestation

### 4. Verify Your Contribution

> **Note:** This verification functionality is currently under development.

After contributing, verify that your contribution was processed correctly:

#### Option A: Using Pre-built Docker Image

```bash
docker run --rm -it -v $(pwd)/contributions:/app/contributions pantherprotocol/trusted-setup-ceremony:latest verify
```

#### Option B: Build Docker Image Yourself (Recommended)

```bash
docker build -t trusted-setup-ceremony .
docker run --rm -it -v $(pwd)/contributions:/app/contributions verify
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

Then create a pull request to merge your contribution into the main repository.

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
docker run --rm -it -v ${PWD}/contributions:/app/contributions pantherprotocol/trusted-setup-ceremony contribute
```

**Command Prompt:**
```cmd
docker run --rm -it -v %cd%/contributions:/app/contributions pantherprotocol/trusted-setup-ceremony contribute
```

**For path-related issues**, use absolute paths:
```cmd
docker run --rm -it -v C:\full\path\to\trusted-setup-contributions:/app/contributions pantherprotocol/trusted-setup-ceremony contribute
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

## Coordinator Instructions

If you are coordinating the ceremony:

1. Initialize the repository by copying the r1cs and zkey files to the `contributions/0000_initial` folder
2. Push this initial setup to the repository


