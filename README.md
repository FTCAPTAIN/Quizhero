# How to Build the Android APK for QuizHero India

This project uses [Capacitor](https://capacitorjs.com/) to wrap the web application into a native Android project. From there, you can generate a standard Android APK file.

## Prerequisites

Before you begin, you will need the following software installed on your machine:

1.  **Node.js and npm**: [Download and install Node.js](https://nodejs.org/) (npm is included).
2.  **Android Studio**: [Download and install Android Studio](https://developer.android.com/studio). This is required to build the native Android app.

---

## Step-by-Step Build Instructions

Follow these steps in order from your terminal in the project's root directory.

### Step 1: Install Dependencies

This command installs Capacitor and all other necessary packages defined in `package.json`.

```bash
npm install
```

### Step 2: Prepare App Icons and Splash Screen

Capacitor can automatically generate all the required icon and splash screen sizes for you from two source files.

1.  Create a new folder named `assets` in the root of your project.
2.  Inside the `assets` folder, add your source images:
    *   **Icon**: `icon.png` (must be at least 1024x1024 pixels)
    *   **Splash Screen**: `splash.png` (must be at least 2732x2732 pixels)

### Step 3: Generate Native Assets

Run the following command to automatically generate all the different icon and splash screen files for the Android project.

```bash
npm run assets:generate
```

### Step 4: Build Your Web App

Capacitor needs the final, compiled web assets (HTML, CSS, JavaScript) to be placed in a directory named `www`.

**Run your project's build command.** This will compile your TypeScript/React code into plain JavaScript and place all the necessary files into the `www` folder.

*(Note: If you don't have a build command, you will need to create one using a tool like Vite, Create React App, or a simple `tsc` command.)*

### Step 5: Add the Android Platform (First Time Only)

This command creates the native `android` project folder. You only need to run this once for the project. If the `android` folder already exists, you can skip this step.

```bash
npx cap add android
```

### Step 6: Sync Web Assets and Open Android Studio

This final command will copy your web assets (from the `www` folder) into the native Android project and then automatically open it in Android Studio.

```bash
npx cap sync android && npx cap open android
```

### Step 7: Generate the Signed APK in Android Studio

Now that the project is open in Android Studio, you can create the final APK file.

1.  Wait for Android Studio to finish indexing and syncing the project (this can take a few minutes on the first run).
2.  From the top menu bar, go to **Build > Generate Signed Bundle / APK...**.
3.  Select **APK** and click **Next**.
4.  You will be prompted to create or use a "keystore". This is a file that cryptographically signs your app.
    *   If you don't have one, click **Create new...** and fill out the form. **Remember the password you create!**
5.  After selecting your keystore and entering your passwords, click **Next**.
6.  Choose the **release** build variant and click **Create**.

Android Studio will now build your app. Once it's finished, a notification will appear with a link to **locate** the generated `app-release.apk` file on your computer. This is the file you can install on any Android device!