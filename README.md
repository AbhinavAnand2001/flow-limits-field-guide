# Flow Limits Field Guide

An interactive Power Apps Code App that demonstrates the limits of automated,
scheduled, and instant Power Automate cloud flows. It includes a daily workload
estimator, license performance profiles, trigger concurrency settings, and
array-loop limits.

The limits are based on the
[Microsoft Learn flow limits and configuration article](https://learn.microsoft.com/en-us/power-automate/limits-and-config).
They are for demonstration and planning; verify current licensing and connector
limits before sizing production workloads.

## Run locally

Requirements: Node.js LTS, Git, and the Power Apps CLI (`pa`).

```bash
npm install
pa app init --display-name "Flow Limits Field Guide" --environment-id <environment-id>
pa app run
```

Open the **Local Play** URL printed by `pa app run` in the same browser profile
used for your Power Platform account. For UI development outside the Power Apps
host, `npm run dev` starts the Vite preview.

## Build and publish

Build the app and publish it to the solution of your choice:

```bash
npm run build
pa app push --solution-id <solution-id>
```

The environment-specific `power.config.json` created during initialization is
intentionally ignored by Git. Initialize the app in your own Power Platform
environment before publishing.
