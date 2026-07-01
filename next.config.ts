import path from "node:path";

import type { NextConfig } from "next";

const posPackages = [
  "webusb-receipt-printer",
  "webbluetooth-receipt-printer",
  "webserial-receipt-printer",
] as const;

const posAliases = Object.fromEntries(
  posPackages.map((pkg) => [
    `@point-of-sale/${pkg}`,
    path.join(
      process.cwd(),
      "node_modules",
      `@point-of-sale/${pkg}`,
      "dist",
      `${pkg}.esm.js`,
    ),
  ]),
);

const nextConfig: NextConfig = {
  transpilePackages: [
    "@gogogo/design-system",
    "@point-of-sale/receipt-printer-encoder",
    ...posPackages.map((pkg) => `@point-of-sale/${pkg}`),
  ],
  webpack: (config) => {
    config.resolve ??= {};
    config.resolve.alias = {
      ...config.resolve.alias,
      ...posAliases,
    };
    config.resolve.conditionNames = [
      "browser",
      "import",
      "require",
      "default",
    ];
    return config;
  },
};

export default nextConfig;
