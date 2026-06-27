import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import { ProseTable, ProseTr } from "@/components/prose-table";

export function Markdown({ content }: { content: string }) {
  return (
    <div className="prose-lab min-w-0 max-w-full">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          table: ProseTable,
          tr: ProseTr,
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
