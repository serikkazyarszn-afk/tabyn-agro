# TabynAgro (инфо про то как запустить проект ниже ребят)

TabynAgro is a web platform that connects **investors** with **farmers**.

Here is how it works:
- A farmer lists an animal (cow, sheep, horse, etc.) on the platform
- Investors browse the listings and choose which animal to fund
- When the animal is sold, **investors get 70% of the profit** and **farmers get 30%**

This is the full-stack web application behind that platform, built with Next.js and Supabase.

**You can see the live version here:** [tabyn.vercel.app](https://tabyn.vercel.app)

---

## What the App Can Do

- Browse livestock investment listings (cows, sheep, horses, goats, camels)
- Sign up as either an **Investor** or a **Farmer**
- **Investors** can view animal details and invest in available slots
- **Investors** have a personal dashboard showing their portfolio, invested amounts, and expected returns
- **Farmers** can add new animal listings and track how much of each animal has been funded
- The interface is available in **English** and **Russian** — you can switch at any time

---

## What You Need Before Starting

You need to install a few things on your computer before you can run this project. Here is the full list:

### 1. Node.js (version 18 or newer)

Node.js is the engine that runs the project on your computer.

- Go to [https://nodejs.org](https://nodejs.org)
- Download the version that says **LTS** (that means stable/recommended)
- Install it like a normal program

To check it installed correctly, open your terminal and type:

```bash
node -v
```

You should see a number like `v20.11.0`. If the number is 18 or higher, you are good.

---

### 2. Git

Git is the tool used to download the project from GitHub.

- Go to [https://git-scm.com](https://git-scm.com)
- Download and install it for your operating system

To check it installed correctly, open your terminal and type:

```bash
git --version
```

You should see something like `git version 2.43.0`.

---

### 3. A Supabase Account (free)

Supabase handles the login system and the database for this project. You need a free account.

- Go to [https://supabase.com](https://supabase.com)
- Click **Start your project** and sign up (it is free)
- Create a new project (any name, any region)

You will need two values from Supabase later in the setup (your URL and your API key). We will show you exactly where to find them in Step 4.

---

### 4. A Code Editor (optional but recommended)

If you want to look at or edit the code, use **VS Code**:
- Download at [https://code.visualstudio.com](https://code.visualstudio.com)

---

## How to Install and Run the Project

### Step 1 — Download the project to your computer

Open your terminal (on Mac: search "Terminal", on Windows: search "Command Prompt" or "PowerShell") and run this command:

```bash
git clone https://github.com/serikkazyarszn-afk/Tabyn_Project.git
```

This will create a new folder called `Tabyn_Project` on your computer with all the project files inside.

---

### Step 2 — Go into the project folder

```bash
cd Tabyn_Project
```

> Every command from this point on must be run from inside this folder.

---

### Step 3 — Install the project's packages

The project uses many small libraries (packages) to work. Install them all with one command:

```bash
npm install
```

This may take 1–2 minutes. You will see a lot of text scrolling — that is normal. Wait until it finishes and you see the cursor again.

---

### Step 4 — Connect the project to your Supabase database

The project needs to know which Supabase project to connect to. You do this by creating a special file called `.env.local`.

**4a. Create the file:**

Run this command to copy the template:

```bash
cp .env.local.example .env.local
```

> On Windows, if that does not work, just create a new file manually in the `Tabyn_Project` folder and name it `.env.local` (with the dot at the start).

**4b. Get your Supabase values:**

1. Go to [https://supabase.com](https://supabase.com) and log in
2. Click on your project
3. In the left sidebar, click **Project Settings**
4. Then click **API**
5. You will see two values you need:
   - **Project URL** — looks like `https://abcdefgh.supabase.co`
   - **anon / public key** — a long string of letters and numbers

**4c. Open `.env.local`** in your code editor and fill in the values:

```env
NEXT_PUBLIC_SUPABASE_URL=paste_your_project_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=paste_your_anon_key_here
```

It should look something like this when filled in:

```env
NEXT_PUBLIC_SUPABASE_URL=https://abcdefgh.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

Save the file.

> **Important:** Never share this file or upload it to GitHub. The `.gitignore` file already makes sure it stays private.

---

### Step 5 — Start the app

```bash
npm run dev
```

You will see output like:

```
▲ Next.js 16.2.3
- Local: http://localhost:3000
✓ Ready
```

---

### Step 6 — Open the app in your browser

Open your browser and go to:

```
http://localhost:3000
```

The app will automatically redirect you to `http://localhost:3000/en`.

You should see the TabynAgro landing page. The app is running.

---

## How to Use the App

### Creating an account

1. Click **Sign Up** in the top navigation bar
2. Enter your full name, email address, and a password
3. Select your role:
   - Choose **Investor** if you want to fund animals and earn profit
   - Choose **Farmer** if you want to list animals and receive funding
4. Click the sign up button — you will be taken to your dashboard automatically

### Logging in

1. Click **Login** in the top navigation bar
2. Enter your email and password
3. Click login — you will be redirected to the correct dashboard based on your role

### Switching language

Click the **EN** or **RU** button in the top-right corner of the page at any time to switch between English and Russian.

### Pages and what they do

| Page address | What you will find there |
|---|---|
| `http://localhost:3000/en` | The main landing page |
| `http://localhost:3000/en/animals` | Browse all available animal listings |
| `http://localhost:3000/en/animals/[id]` | Details of one animal + invest button |
| `http://localhost:3000/en/signup` | Create a new account |
| `http://localhost:3000/en/login` | Log in to your account |
| `http://localhost:3000/en/dashboard` | Investor dashboard (your portfolio) |
| `http://localhost:3000/en/farmer/dashboard` | Farmer dashboard (your animals) |
| `http://localhost:3000/en/farmer/animals/new` | Add a new animal listing |

> To switch to Russian, replace `/en/` with `/ru/` in any of the addresses above.

---

## Project Folder Overview

Here is a map of the important folders and files:

```
Tabyn_Project/
│
├── app/                    ← All the pages of the website
│   └── [locale]/           ← Language folder (/en or /ru)
│       ├── page.tsx        ← Landing page
│       ├── animals/        ← Browse listings + animal detail
│       ├── dashboard/      ← Investor dashboard
│       ├── farmer/         ← Farmer dashboard and add animal
│       ├── login/          ← Login page
│       └── signup/         ← Sign up page
│
├── components/             ← Reusable pieces of the UI
│   ├── ui/                 ← Buttons, cards, inputs, badges
│   ├── layout/             ← Top navbar and bottom footer
│   ├── landing/            ← Sections on the landing page
│   └── animals/            ← Animal listing card component
│
├── lib/                    ← Helper files
│   ├── supabase.ts         ← Connects to Supabase (browser)
│   ├── supabase-server.ts  ← Connects to Supabase (server)
│   ├── demo-data.ts        ← Fake animals/investments for the demo
│   └── types.ts            ← Data type definitions
│
├── messages/               ← All text in the app
│   ├── en.json             ← English text
│   └── ru.json             ← Russian text
│
├── supabase/migrations/    ← Database table setup (SQL)
├── public/                 ← Images and static files
│
├── .env.local              ← YOUR secret keys (never share this)
├── .env.local.example      ← Template showing what .env.local needs
├── next.config.ts          ← Next.js settings
└── proxy.ts                ← Handles the /en and /ru routing
```

---

## Troubleshooting

If something goes wrong, check this table first:

| Problem | What it probably means | How to fix it |
|---|---|---|
| The page is blank or shows a white error screen | `.env.local` is missing or the keys inside are wrong | Make sure you created `.env.local` and filled in both values from Supabase |
| You see "Invalid API key" | The anon key was copied incorrectly | Go back to Supabase → Project Settings → API and copy the **anon / public** key again carefully |
| `npm install` gives errors | Your Node.js version is too old | Run `node -v` to check — if it is below 18, download a newer version from nodejs.org |
| Port 3000 is already in use | Something else is running on that port | Run this instead: `npm run dev -- -p 3001` then open `http://localhost:3001` |
| Clicking EN/RU does not change the language | Your browser cached the old page | Press `Ctrl + Shift + R` on Windows/Linux or `Cmd + Shift + R` on Mac to do a hard refresh |
| Login says it failed right after signing up | Supabase is asking you to confirm your email | In Supabase go to **Authentication → Providers → Email** and turn off **"Confirm email"** for local development |
| It says `npm: command not found` | Node.js did not install correctly | Restart your terminal after installing Node.js, or reinstall it from nodejs.org |
| It says `cd: no such file or directory` | You are not in the right folder | Make sure you ran `git clone` first and then `cd Tabyn_Project` |

---

## Contributing

If you want to make changes and suggest them for the project, follow these steps.

> **Rule #1: Never push code directly to the `main` branch.** The `main` branch is the stable version. All changes must go through a separate branch and be reviewed first.

### How to contribute

**1. Fork the repository**

Go to the project on GitHub and click the **Fork** button in the top right. This creates your own copy of the project under your GitHub account.

**2. Clone your fork**

```bash
git clone https://github.com/YOUR-USERNAME/Tabyn_Project.git
cd Tabyn_Project
```

Replace `YOUR-USERNAME` with your actual GitHub username.

**3. Create a new branch for your change**

```bash
git checkout -b feature/describe-your-change
```

For example: `git checkout -b feature/add-search-filter`

A branch is like a separate workspace. Your changes here will not affect `main`.

**4. Make your changes, then save them**

After editing files, stage and commit your changes:

```bash
git add .
git commit -m "Brief description of what you changed"
```

**5. Push your branch to GitHub**

```bash
git push origin feature/describe-your-change
```

This pushes **your branch only** — not `main`.

**6. Open a Pull Request**

Go to GitHub, open your forked repository, and you will see a button that says **"Compare & pull request"**. Click it, write a short description of your change, and submit. Someone will review it before it is merged into `main`.

---

## License

This project is licensed under the **MIT License**.

That means you are free to use, copy, modify, and share this code — for personal or commercial use. The only requirement is that you keep the original license notice in your copy.
