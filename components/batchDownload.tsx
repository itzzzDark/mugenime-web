"use client";

import { useState } from "react";
import {
  Download,
  ChevronDown,
  ChevronUp,
  Package,
  HardDrive,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { BatchResponse } from "@/lib/types";
import { Badge } from "@/components/ui/badge";

export default function BatchDownload({
  batchData,
}: Readonly<{
  batchData: BatchResponse;
}>) {
  const [isOpen, setIsOpen] = useState(false);
  const formats = batchData.downloadUrl.formats[0];

  if (!formats) return null;

  return (
    <div className="mt-8">
      <Collapsible
        open={isOpen}
        onOpenChange={setIsOpen}
        className="w-full border border-border rounded-xl bg-card overflow-hidden shadow-sm cursor-pointer hover:shadow-md transition-all group"
      >
        <CollapsibleTrigger asChild>
          <div className="flex items-center justify-between p-4 bg-muted/40 hover:bg-muted/60 transition-colors">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                <Package className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-sm md:text-base text-foreground group-hover:text-primary transition-colors">
                  Download Batch (Tamat)
                </h3>
                <p className="text-xs text-muted-foreground">
                  Unduh semua episode dalam satu paket (Zip/Rar).
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="w-9 h-9 p-0 rounded-full text-muted-foreground"
            >
              {isOpen ? (
                <ChevronUp className="w-4 h-4" />
              ) : (
                <ChevronDown className="w-4 h-4" />
              )}
              <span className="sr-only">Toggle Batch</span>
            </Button>
          </div>
        </CollapsibleTrigger>

        <CollapsibleContent className="animate-collapsible-down">
          <div className="p-4 space-y-6 border-t border-border">
            {formats.qualities.map((quality) => (
              <div key={quality.title} className="space-y-3">
                {/* Header Kualitas & Ukuran */}
                <div className="flex items-center gap-2">
                  <Badge
                    variant="outline"
                    className="bg-primary/10 text-primary border-primary/20 font-bold"
                  >
                    {quality.title}
                  </Badge>
                  <span className="text-xs text-muted-foreground font-mono flex items-center gap-1">
                    <HardDrive className="w-3 h-3" /> {quality.size}
                  </span>
                </div>

                {/* Grid Tombol Download */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 gap-2">
                  {quality.urls.map((link) => (
                    <Button
                      key={link.title}
                      variant="outline"
                      size="sm"
                      asChild
                      className="text-xs h-9 bg-background hover:bg-primary/10 hover:text-primary hover:border-primary/30 transition-colors"
                    >
                      <a
                        href={link.url}
                        target="_blank"
                        rel="noreferrer noopener"
                        className="flex items-center justify-start"
                      >
                        <Download className="w-3 h-3 mr-1 ml-3" />
                        {link.title}
                      </a>
                    </Button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
}