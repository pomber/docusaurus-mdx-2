import visit from "unist-util-visit";
import type { Transformer, Processor } from "unified";
import type { Code } from "mdast";

// To make theme-classic/src/theme/MDXComponents/Pre work
// we need to fill two properties that mdx v2 doesn't provide anymore
export default function plugin(this: Processor): Transformer {
  return (root) => {
    visit(root, "code", (node: Code) => {
      node.data = node.data || {};
      node.data.hProperties = node.data.hProperties || {};
      (node.data.hProperties as any)["originalType"] = "code";
      (node.data.hProperties as any)["metastring"] = node.meta;
    });
  };
}
