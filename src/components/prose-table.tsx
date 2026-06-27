"use client";

import {
  Children,
  cloneElement,
  createContext,
  isValidElement,
  useContext,
  useMemo,
  type ComponentPropsWithoutRef,
  type ReactElement,
} from "react";
import type { Element, ElementContent, Text } from "hast";

const TableHeadersContext = createContext<string[]>([]);

function hastToText(node: ElementContent): string {
  if (node.type === "text") return (node as Text).value;
  if (node.type === "element") {
    return (node as Element).children.map(hastToText).join("");
  }
  return "";
}

function getHeaderLabels(tableNode: Element): string[] {
  const thead = tableNode.children.find(
    (child): child is Element =>
      child.type === "element" && child.tagName === "thead",
  );
  const headerRow = thead?.children.find(
    (child): child is Element =>
      child.type === "element" && child.tagName === "tr",
  );
  if (!headerRow) return [];

  return headerRow.children
    .filter(
      (child): child is Element =>
        child.type === "element" && child.tagName === "th",
    )
    .map(hastToText);
}

export function ProseTable({
  node,
  children,
  ...props
}: ComponentPropsWithoutRef<"table"> & { node?: Element }) {
  const headers = useMemo(
    () => (node ? getHeaderLabels(node) : []),
    [node],
  );

  return (
    <TableHeadersContext.Provider value={headers}>
      <div className="prose-table-wrap">
        <table {...props}>{children}</table>
      </div>
    </TableHeadersContext.Provider>
  );
}

export function ProseTr({
  children,
  ...props
}: ComponentPropsWithoutRef<"tr">) {
  const headers = useContext(TableHeadersContext);
  const multiColumn = headers.length > 2;
  let colIndex = 0;

  const labeledChildren = Children.map(children, (child) => {
    if (!isValidElement(child)) return child;

    const index = colIndex++;
    const label =
      multiColumn && index > 0 && headers[index]
        ? headers[index]
        : undefined;

    return cloneElement(child as ReactElement<{ "data-label"?: string }>, {
      "data-label": label,
    });
  });

  return <tr {...props}>{labeledChildren}</tr>;
}
