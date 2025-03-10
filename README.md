# Trusted Setup Ceremony

This repository manages a trusted setup ceremony for a zero-knowledge circuit. Each participant contributes randomness to ensure that no single person knows the "toxic waste" that could compromise the system.

## Coordinator Instructions

1. Initialize the repository with:
   - Copy r1cs and zkey files to the `0000_initial` folder

2. Push this initial setup to the repository.

## Participant Instructions

1. Clone this repository:
   ```
   git clone https://github.com/your-username/trusted-setup.git
   cd trusted-setup
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Contribute randomness:
   ```
   npm run contribute
   ```
   - Enter your GitHub username when prompted
   - Provide some random entropy when asked (type randomly on your keyboard)
   - The script will create a new folder with your contribution

4. Commit and push your changes:
   ```
   git add .
   git commit -m "Add contribution from YOUR_GITHUB_USERNAME"
   git push origin main
   ```

## Verification

To verify all contributions in the ceremony:

## Using Docker

This trusted setup ceremony for the Panther Protocol can be run using Docker, which ensures a consistent environment regardless of your local setup.

### Using the Docker Image from Docker Hub

The ceremony Docker image is available on Docker Hub:

```bash
docker pull pantherprotocol/trusted-setup-ceremony:latest
```

You can also use a specific version with a tag like `:0.1` instead of `:latest`.

### Running the Ceremony with Docker

Use Docker to run the contribution or verification process:

#### To Contribute

```bash
docker run --rm -it -v $(pwd):/app pantherprotocol/trusted-setup-ceremony contribute
```

#### To Verify All Contributions

```bash
docker run --rm -v $(pwd):/app pantherprotocol/trusted-setup-ceremony verify
```

### Using Docker Compose

You can also use Docker Compose for a simpler command interface:

```bash
# To contribute
docker compose run --rm ceremony contribute

# To verify
docker compose run --rm ceremony verify
```

### Notes on Docker Usage

- The `-v $(pwd):/app` option mounts your current directory to the container, allowing the container to read and write files directly in your project folder
- The `-it` flag is needed for the contribute command as it requires interactive input
- All contributions will be saved to your local filesystem
- The `--rm` flag ensures the container is removed after execution
- The Docker image supports both AMD64 (x86_64) and ARM64 architectures
- You don't need to install Node.js or any dependencies on your host machine

### Platform-Specific Notes

#### Linux/macOS
The commands shown above work as-is on Linux and macOS systems.

#### Windows
On Windows, there are two options:

1. **Using PowerShell**:
   ```powershell
   docker run --rm -it -v ${PWD}:/app pantherprotocol/trusted-setup-ceremony contribute
   ```

2. **Using Command Prompt**:
   ```cmd
   docker run --rm -it -v %cd%:/app pantherprotocol/trusted-setup-ceremony contribute
   ```

3. **If you encounter path issues**, use absolute paths:
   ```
   docker run --rm -it -v C:\full\path\to\ceremony:/app pantherprotocol/trusted-setup-ceremony contribute
   ```

When using Docker Compose on Windows, the volume mounting is handled in the docker-compose.yml file, so the commands remain the same across platforms:
```bash
docker compose run --rm ceremony contribute
```
