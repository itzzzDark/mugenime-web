"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Share2,
  Copy,
  Check,
  Facebook,
  Twitter,
  Mail,
  MessageCircle,
} from "lucide-react";

interface ShareButtonProps {
  title: string;
  slug: string;
}

export default function ShareButton({
  title,
  slug,
}: Readonly<ShareButtonProps>) {
  const [isOpen, setIsOpen] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [currentUrl, setCurrentUrl] = useState("");

  useEffect(() => {
    if (typeof globalThis.window !== "undefined") {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setCurrentUrl(globalThis.location.href);
    }
  }, []);

  const handleCopy = () => {
    navigator.clipboard.writeText(currentUrl);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const openShareWindow = (url: string) => {
    window.open(url, "_blank", "width=600,height=400");
    setIsOpen(false);
  };

  const shareLinks = [
    {
      name: "WhatsApp",
      icon: <MessageCircle className="w-5 h-5 text-white" />,
      bg: "bg-[#25D366] hover:bg-[#20bd5a]",
      action: () =>
        openShareWindow(
          `https://api.whatsapp.com/send?text=${encodeURIComponent(
            `Nonton ${title} Sub Indo Gratis di sini: ${currentUrl}`,
          )}`,
        ),
    },
    {
      name: "Facebook",
      icon: <Facebook className="w-5 h-5 text-white" />,
      bg: "bg-[#1877F2] hover:bg-[#166fe5]",
      action: () =>
        openShareWindow(
          `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
            currentUrl,
          )}`,
        ),
    },
    {
      name: "Twitter / X",
      icon: <Twitter className="w-5 h-5 text-white" />,
      bg: "bg-black hover:bg-zinc-800",
      action: () =>
        openShareWindow(
          `https://twitter.com/intent/tweet?url=${encodeURIComponent(
            currentUrl,
          )}&text=${encodeURIComponent(`Nonton ${title} Sub Indo`)}`,
        ),
    },
    {
      name: "Telegram",
      icon: (
        <svg viewBox="0 0 24 24" fill="white" className="w-5 h-5">
          <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12.068 12.068 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
        </svg>
      ),
      bg: "bg-[#229ED9] hover:bg-[#1f90c6]",
      action: () =>
        openShareWindow(
          `https://t.me/share/url?url=${encodeURIComponent(
            currentUrl,
          )}&text=${encodeURIComponent(`Nonton ${title}`)}`,
        ),
    },
    {
      name: "Email",
      icon: <Mail className="w-5 h-5 text-white" />,
      bg: "bg-zinc-500 hover:bg-zinc-600",
      action: () =>
        (globalThis.location.href = `mailto:?subject=${encodeURIComponent(
          `Nonton ${title}`,
        )}&body=${encodeURIComponent(`Cek anime ini: ${currentUrl}`)}`),
    },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="w-full rounded-xl gap-2 cursor-pointer"
        >
          <Share2 className="w-4 h-4" /> Bagikan
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md bg-card border-border">
        <DialogHeader>
          <DialogTitle>Bagikan Anime</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Bagikan <strong>{title}</strong> ke teman-temanmu.
          </DialogDescription>
        </DialogHeader>

        {/* Social Icons Grid */}
        <div className="grid grid-cols-5 gap-2 py-4">
          {shareLinks.map((link) => (
            <button
              key={link.name}
              onClick={link.action}
              className="flex flex-col items-center gap-2 group cursor-pointer"
            >
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-transform group-hover:scale-110 shadow-sm ${link.bg}`}
              >
                {link.icon}
              </div>
              <span className="text-[10px] text-muted-foreground font-medium text-center">
                {link.name}
              </span>
            </button>
          ))}
        </div>

        {/* Copy Link Section */}
        <div className="flex items-center space-x-2 bg-muted/50 p-2 rounded-lg border border-border">
          <div className="grid flex-1 gap-1.5">
            <Label htmlFor="link" className="sr-only">
              Link
            </Label>
            <Input
              id="link"
              defaultValue={currentUrl}
              readOnly
              className="h-9 bg-transparent border-0 focus-visible:ring-0 text-foreground"
            />
          </div>
          <Button
            size="sm"
            onClick={handleCopy}
            className={`px-3 transition-all ${
              isCopied ? "bg-green-600 hover:bg-green-700 text-white" : ""
            }`}
          >
            {isCopied ? (
              <>
                <Check className="w-4 h-4 mr-2" />
                Disalin
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 mr-2" />
                Salin
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
