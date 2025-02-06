Ticketing Microservice Project
This repository contains a collection of microservices for a ticketing platform. The project is designed to help me enhance my backend development skills, focusing on system design, architecture, and key software engineering concepts like logging, caching, and containerization.

Project Features
Authentication Service: Secure user authentication with session management.
Ticket Service: Manage the creation, updates, and availability of tickets.
Order Service: Handle order creation, status tracking, and validations.
Expiration Service: Automatically expire unpaid orders within a specific timeframe.
Payment Service: Secure payment processing using Stripe.
Client Service: Frontend user interface built with Next.js.
Key Technologies & Tools
Backend: Node.js, Express.js, TypeScript
Frontend: Next.js
Containerization: Docker
Orchestration: Kubernetes
Streaming System: NATS Streaming Server
Load Balancing: NGINX
CI/CD: Automated pipelines for deployment
Payment Integration: Stripe API
Development Tooling: Skaffold
Testing: Comprehensive service tests using npm run test
Logging and Caching: Best practices for system monitoring and optimization
Getting Started
Development Environment Setup
To start the project in development mode:
skaffold dev  
Installing Dependencies
Run the following command for each service to install the required packages:
npm install  
Running Tests
To test a specific service, navigate to its directory and run:
npm run test  
Project Structure
ticketing/  
├── auth  
├── tickets  
├── orders  
├── payments  
├── expiration  
└── client  
Deployment & Orchestration
Docker is used for containerizing the services.
Kubernetes manages service orchestration and scaling.
NGINX acts as a load balancer for better request distribution.
Skaffold simplifies the local development workflow with Kubernetes.
Payment Integration
The project uses Stripe for secure payment handling, ensuring a seamless user experience.

CI/CD
The project incorporates CI/CD pipelines to automate testing, deployment, and monitoring for reliable and continuous delivery of updates.

