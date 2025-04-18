# CodeCamp 2024 Project Setup

This document guides you through the steps to set up and deploy your CodeCamp 2024 project. It includes instructions on running Firebase Emulators locally, deploying the Firebase project, and viewing the client-side website.

## 1. **Setting Up Firebase Emulators (Functions)**

To start the Firebase Emulator for functions locally, follow these steps:

### a. **Start Firebase Emulators**

- Navigate to the functions directory in your project:
  ```bash
  cd ~/codecamp2024/functions
  ```
- Run the Firebase Emulator for functions:
  ```bash
  firebase emulators:start --only functions
  ```

This will start the Firebase Functions Emulator, which will allow you to test your Firebase Functions locally.

## 2. **Deploy Firebase Project**

Once you have finished making changes, you can deploy your Firebase project to the cloud.

### a. **Deploy Firebase Project**

- Navigate back to the root of your project directory:
  ```bash
  cd ~/codecamp2024
  ```
- Deploy your project to Firebase:
  ```bash
  firebase deploy
  ```

This will deploy the database, functions, and hosting components of your Firebase project.

## 3. **Running a Local Server for the Client**

To view the website locally, you'll need to run a simple HTTP server for your client-side application.

### a. **Start a Local Server for Client**

- Navigate to the `client` directory:
  ```bash
  cd ~/codecamp2024/client
  ```
- Start the server using Python:
  ```bash
  python3 -m http.server 8000
  ```

This will serve your client-side application on `http://localhost:8000/`.

## 4. **Access the Deployed Firebase Application**

After deployment, you can access the live version of your application through the Firebase Hosting URL:

- **Deployed Website:** [https://code-camp-showcase.web.app/](https://code-camp-showcase.web.app/)

### 5. **Accessing Functions Locally**

While running the Firebase Emulator for functions, you can access your emulated functions locally at:

- **Local Functions URL:** `http://127.0.0.1:5001/code-camp-showcase/us-central1/app`

## 6. **Deploying the client**

```bash
 ~/codecamp2024 $ firebase use --add
? Which project do you want to add? code-camp-showcase
? What alias do you want to use for this project? (e.g. staging) live


Created alias live for code-camp-showcase.
Now using alias live (code-camp-showcase)

 firebase deploy --only hosting

   ```