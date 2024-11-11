# Getting Started with "Oshinoko"

1. install volta. See [this page](https://docs.volta.sh/guide/getting-started).

2. install node
`volta install node@22.11.0`.
3. check node version
```
node --version
v22.11.0
```
4. install pnpm
`volta install pnpm`
5. install project dependencies
`cd {project_root}/TS/ochinoko`
`pnpm install`
6. run server
`pnpm dev`
7. check the page with your browser.
http://localhost:3000/

# Development
## Formatter
- prettier, `pnpm prettier app --write app` でformatできる. VSCodeの機能でもよい.
- `pnpm prettier --check app` でformatが正しいか確認できる.
## Linter
- ESLint, `pnpm lint` で走る.

## Unit test
- Jest, `pnpm jest` でテストできる.



<!-- 
This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details. -->
