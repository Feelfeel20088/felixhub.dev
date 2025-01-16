# FelixHub Website

Welcome to the **FelixHub** website repository. This is a personal website and API project designed to showcase my work, projects, and contributions to the development community.

[**Click here to visit the live website!**](https://felixhub.dev)

## Table of Contents

- [About](#about)
- [Features](#features)
- [Technologies](#technologies)
- [Installation](#installation)
- [Usage](#usage)
- [Contributing](#contributing)
- [License](#license)

## About

FelixHub is a personal web project aimed at providing a platform to share my projects and contributions. It hosts a variety of tools, resources, and information about my journey as a developer. This repository is a part of that project and includes the code and setup used for the website and API.

> **Important**: The AI features on the website require Ollama to be installed. Please ensure that you have Ollama set up to use the AI functionality.

## Features

- Showcase of projects with images and descriptions
- Interactive API to demonstrate functionality
- Clean and responsive design for all devices
- User authentication for secure login and session management
- Show documentation for the project and its APIs

## Technologies

This project is built using the following technologies:

- **Frontend**: HTML, CSS, JavaScript, TypeScript
- **Backend**: Node.js, Fastify
- **Real-time Interaction**: Redis (for message queues)
- **Code Highlighting**: Highlight.js (for displaying code snippets)
- **AI Interaction**: Ollama (for integrating AI models)
- **Ngrok**: For tunneling HTTP requests from felixhub to ngrok url to the local server
- **Containerization**: Docker (for building and deploying the app)
- **Kubernetes**: K3s (for container orchestration)

## Installation

### Option 1: Install Locally

To set up this project locally, follow these steps:

1. Clone the repository:

    ```bash
    git clone https://github.com/Feelfeel20088/felixhub.dev.git
    cd felixhub.dev
    ```

2. Install dependencies using **npm**:

    ```bash
    npm install
    ```

3. Set up environment variables:

    Create a `.env` file at the root of the project and add your necessary API keys, database credentials, etc. Example:

    ```
    DATABASE_URL=your_database_url
    API_KEY=your_api_key
    REDIS_URL=your_redis_url
    ```

4. Start the server:

    ```bash
    npm start
    ```

    The website should now be accessible at `http://localhost:8080`.

### Option 2: Docker Installation

If you prefer using Docker to run the project, you can pull the pre-built container from Docker Hub and run it:

1. Pull the Docker image:

    ```bash
    docker pull feelfeel200088/felixhub
    ```

2. Run the container:

    ```bash
    docker run -p 8080:8080 feelfeel200088/felixhub
    ```

    This will run the project in a Docker container, and the website will be accessible at `http://localhost:8080`.

### Option 3: Kubernetes Installation (with `kubectl`)

For those who want to deploy using Kubernetes, you can use the `deployments.yaml` file.

1. navigate to the deployments directory and apply the Kubernetes configuration:

    ```bash
    cd deployments
    kubectl apply -f ./
    ```

    This will deploy the website to your Kubernetes cluster.

2. view the website:

    `http://<ANY_NODE_IP>:30000/`


    if you understand kuberneties you can modify the `deployment.yaml` file to your liking to even exspose the website to the internet

## Usage

- Navigate through the website to view different projects.
- Use the API to interact with available resources (details of the API are hosted on the website).
- For project contributors, clone this repository, make changes, and submit pull requests for review.

## Contributing

If you'd like to contribute to this project, follow these steps:

1. Fork the repository.
2. Create a new branch (`git checkout -b feature-name`).
3. Make your changes.
4. Commit your changes (`git commit -m "Description of your changes"`).
5. Push to the branch (`git push origin feature-name`).
6. Submit a pull request to the main repository.

Please make sure to follow the coding standards and write tests where applicable.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

Thank you for visiting **FelixHub**! Feel free to explore the projects and contribute to the repository.
