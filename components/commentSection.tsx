"use client";

import { DiscussionEmbed } from "disqus-react";
import { MessageSquare } from "lucide-react";

interface CommentSectionProps {
  identifier?: string; // defaults to slug or a static ID
  title?: string;      // defaults to 'General Discussion' or similar
  slug?: string;       // used to construct the URL
}

export default function CommentSection({
  identifier,
  title,
  slug,
}: Readonly<CommentSectionProps>) {
  const disqusShortname = "mugenime";
  const pageIdentifier = identifier || "general-discussion";
  const pageTitle = title || "Diskusi Umum";
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://www.mugenime.my.id";
  
  // If slug is provided, append it. Otherwise, use the identifier as part of URL or just base.
  // For 'Report Page', you might pass slug="report"
  const url = slug 
    ? (slug.startsWith("http") ? slug : `${baseUrl}/${slug}`)
    : `${baseUrl}/discuss/${pageIdentifier}`;

  const disqusConfig = {
    url: url,
    identifier: pageIdentifier,
    title: pageTitle,
    language: "id", 
  };

  return (
    <div className="relative w-full overflow-hidden rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 shadow-sm">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 pointer-events-none"></div>
      
      <div className="relative z-10 p-6 md:p-8">
        {/* Header Komentar */}
        <div className="flex items-center gap-3 mb-8 border-b border-zinc-200 dark:border-zinc-800 pb-4">
          <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg text-indigo-600 dark:text-indigo-400">
            <MessageSquare className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-zinc-900 dark:text-white">
              Komentar
            </h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              Diskusikan dengan sopan.
            </p>
          </div>
        </div>

        {/* Disqus Embed */}
        <div className="min-h-[200px]">
          <DiscussionEmbed shortname={disqusShortname} config={disqusConfig} />
        </div>
      </div>
    </div>
  );
}