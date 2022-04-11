/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {
  toMessageRelativeFilePath,
  posixPath,
  escapePath,
  getFileLoaderUtils,
  findAsyncSequential,
} from "@docusaurus/utils";
import visit from "unist-util-visit";
import path from "path";
import url from "url";
import fs from "fs-extra";
import escapeHtml from "escape-html";
import { assetRequireAttributeValue, stringifyContent } from "../utils";
import type { Transformer } from "unified";
import type { Link, Literal } from "mdast";

const {
  loaders: { inlineMarkdownLinkFileLoader },
} = getFileLoaderUtils();

type PluginOptions = {
  staticDirs: string[];
  siteDir: string;
};

type Context = PluginOptions & {
  filePath: string;
};

// transform the link node to a jsx link with a require() call
function toAssetRequireNode(node: Link, assetPath: string, filePath: string) {
  const jsxNode = node as unknown as {
    type: string;
    name: string;
    attributes: any[];
    children: any[];
  };
  const attributes = [];

  let relativeAssetPath = posixPath(
    path.relative(path.dirname(filePath), assetPath)
  );
  // require("assets/file.pdf") means requiring from a package called assets
  relativeAssetPath = `./${relativeAssetPath}`;

  const parsedUrl = url.parse(node.url);
  const hash = parsedUrl.hash ?? "";
  const search = parsedUrl.search ?? "";

  const requireString = `${
    // A hack to stop Webpack from using its built-in loader to parse JSON
    path.extname(relativeAssetPath) === ".json"
      ? `${relativeAssetPath.replace(".json", ".raw")}!=`
      : ""
  }${inlineMarkdownLinkFileLoader}${escapePath(relativeAssetPath) + search}`;

  attributes.push({
    type: "mdxJsxAttribute",
    name: "href",
    value: assetRequireAttributeValue(requireString, hash),
  });

  attributes.push({
    type: "mdxJsxAttribute",
    name: "target",
    value: "_blank",
  });

  if (node.title) {
    attributes.push({
      type: "mdxJsxAttribute",
      name: "title",
      value: escapeHtml(node.title),
    });
  }

  const children = stringifyContent(node);

  Object.keys(jsxNode).forEach(
    (key) => delete jsxNode[key as keyof typeof jsxNode]
  );

  jsxNode.type = "mdxJsxFlowElement";
  jsxNode.name = "a";
  jsxNode.attributes = attributes;
  jsxNode.children = [{ type: "text", value: children }];
}

async function ensureAssetFileExist(assetPath: string, sourceFilePath: string) {
  const assetExists = await fs.pathExists(assetPath);
  if (!assetExists) {
    throw new Error(
      `Asset ${toMessageRelativeFilePath(
        assetPath
      )} used in ${toMessageRelativeFilePath(sourceFilePath)} not found.`
    );
  }
}

async function getAssetAbsolutePath(
  assetPath: string,
  { siteDir, filePath, staticDirs }: Context
) {
  if (assetPath.startsWith("@site/")) {
    const assetFilePath = path.join(siteDir, assetPath.replace("@site/", ""));
    // The @site alias is the only way to believe that the user wants an asset.
    // Everything else can just be a link URL
    await ensureAssetFileExist(assetFilePath, filePath);
    return assetFilePath;
  } else if (path.isAbsolute(assetPath)) {
    const assetFilePath = await findAsyncSequential(
      staticDirs.map((dir) => path.join(dir, assetPath)),
      fs.pathExists
    );
    if (assetFilePath) {
      return assetFilePath;
    }
  } else {
    const assetFilePath = path.join(path.dirname(filePath), assetPath);
    if (await fs.pathExists(assetFilePath)) {
      return assetFilePath;
    }
  }
  return null;
}

async function processLinkNode(node: Link, context: Context) {
  if (!node.url) {
    // try to improve error feedback
    // see https://github.com/facebook/docusaurus/issues/3309#issuecomment-690371675
    const title = node.title || (node.children[0] as Literal)?.value || "?";
    const line = node?.position?.start?.line || "?";
    throw new Error(
      `Markdown link URL is mandatory in "${toMessageRelativeFilePath(
        context.filePath
      )}" file (title: ${title}, line: ${line}).`
    );
  }

  const parsedUrl = url.parse(node.url);
  if (parsedUrl.protocol || !parsedUrl.pathname) {
    // Don't process pathname:// here, it's used by the <Link> component
    return;
  }
  const hasSiteAlias = parsedUrl.pathname.startsWith("@site/");
  const hasAssetLikeExtension =
    path.extname(parsedUrl.pathname) &&
    !parsedUrl.pathname.match(/\.(?:mdx?|html)(?:#|$)/);
  if (!hasSiteAlias && !hasAssetLikeExtension) {
    return;
  }

  const assetPath = await getAssetAbsolutePath(
    decodeURIComponent(parsedUrl.pathname),
    context
  );
  if (assetPath) {
    toAssetRequireNode(node, assetPath, context.filePath);
  }
}

export default function plugin(options: PluginOptions): Transformer {
  return async (root, vfile) => {
    const promises: Promise<void>[] = [];
    visit(root, "link", (node: Link) => {
      promises.push(
        processLinkNode(node, { ...options, filePath: vfile.path! })
      );
    });
    await Promise.all(promises);
  };
}
