# 🚀 Turbopack Tracing in Next.js

This guide explains how to enable and use **Turbopack tracing** to analyze your application's performance during local development in **Next.js 16**.

---

## 1️⃣ Clone the Repository and Install Dependencies

```bash
# Clone the repository
git clone <your-repo-url>
cd <your-repo-name>

# Install dependencies
npm install
# or
yarn install
```

2️⃣ Enable Turbopack Tracing

To generate a trace, run your development server with the environment variable:

NEXT_TURBOPACK_TRACING=1

On Linux/macOS:

```bash
NEXT_TURBOPACK_TRACING=1 npm run dev
```

On Windows (PowerShell):

```bash
$env:NEXT_TURBOPACK_TRACING=1; npm run dev
```

This will make Next.js generate a trace file while you navigate through your app or make changes to your files.

3️⃣ Reproduce the Activity You Want to Analyze

While the development server is running:

Open important pages

Make changes to components

Navigate between routes

✅ All these actions will be captured in the trace file.

4️⃣ Stop the Development Server

Once you’re done interacting:

Stop the server with Ctrl + C

You will now have a file named:

.next/dev/trace-turbopack

Note: If you are using isolatedDevBuild in next.config.js, the location may change.

5️⃣ Analyze the Trace

To interpret the trace file:

npx next internal trace .next/dev/trace-turbopack

In older Next.js versions, the command was turbo-trace-server.

This will start a local trace server and give you a link like:

http://localhost:PORT

Viewing the Trace in Next.js UI

By default, the view shows aggregated timings (“Aggregated in order”)

[![Foto Preview](preview/trace-turbopack.avif)](https://project-1358.vercel.app/)
[![Foto Preview](preview/project-1358.avif)](https://project-1358.vercel.app/)

<div align="center" style="display: flex; justify-content: center;">
  <a  href="https://github.com/20essentials/project-1357" target="_blank">&#8592;</a>
  &nbsp;&nbsp;
  <a  href="https://github.com/20essentials/project-1359" target="_blank">&#8594;</a>
</div>
