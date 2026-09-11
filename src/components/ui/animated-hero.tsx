import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { MoveRight, PhoneCall } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface HeroProps {
  eyebrow?: string;
  titleLead?: string;
  titles?: string[];
  titleTail?: string;
  description?: string;
  primaryLabel?: string;
  secondaryLabel?: string;
  onPrimary?: () => void;
  onSecondary?: () => void;
  className?: string;
  align?: "left" | "center";
}

function Hero({
  eyebrow = "Read our launch article",
  titleLead = "This is something",
  titles: providedTitles,
  titleTail = "",
  description =
    "Managing a small business today is already tough. Avoid further complications by ditching outdated, tedious trade methods. Our goal is to streamline SMB trade, making it easier and faster than ever.",
  primaryLabel = "Sign up here",
  secondaryLabel = "Jump on a call",
  onPrimary,
  onSecondary,
  className,
  align = "center",
}: HeroProps) {
  const [titleNumber, setTitleNumber] = useState(0);
  const titles = useMemo(
    () => providedTitles ?? ["amazing", "new", "wonderful", "beautiful", "smart"],
    [providedTitles],
  );

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setTitleNumber((current) => (current === titles.length - 1 ? 0 : current + 1));
    }, 2200);

    return () => clearTimeout(timeoutId);
  }, [titleNumber, titles]);

  const isLeft = align === "left";

  return (
    <div className={cn("w-full", className)}>
      <div className={cn("flex flex-col gap-6", isLeft ? "items-start text-left" : "items-center text-center")}>
        <div>
          <Button
            variant="secondary"
            size="sm"
            className="gap-3 rounded-full border border-[#DEC8A7] bg-[#F6EBDD]/90 px-4 text-[#775328] shadow-[0_6px_20px_rgba(91,62,30,.05)] backdrop-blur-sm hover:bg-[#F0E1CA]"
            onClick={onSecondary}
          >
            {eyebrow} <MoveRight className="h-4 w-4" />
          </Button>
        </div>

        <div className={cn("flex max-w-3xl flex-col gap-4", isLeft ? "items-start" : "items-center")}>
          <h1 className={cn("font-display text-[48px] leading-[0.98] tracking-[-0.035em] text-[#21150C] sm:text-[62px] lg:text-[74px]", isLeft ? "text-left" : "text-center")}>
            {titleLead ? <span className="block">{titleLead}</span> : null}
            <span className={cn("relative flex min-h-[1.02em] w-full overflow-hidden pb-2 pt-1", isLeft ? "justify-start" : "justify-center") }>
              {titles.map((title, index) => (
                <motion.span
                  key={`${title}-${index}`}
                  className="absolute font-display font-normal"
                  initial={{ opacity: 0, y: -90 }}
                  transition={{ type: "spring", stiffness: 55, damping: 16 }}
                  animate={
                    titleNumber === index
                      ? { y: 0, opacity: 1 }
                      : { y: titleNumber > index ? -120 : 120, opacity: 0 }
                  }
                >
                  {title}
                </motion.span>
              ))}
              <span className="invisible">{titles.reduce((a, b) => (a.length > b.length ? a : b), titles[0] ?? "")}</span>
            </span>
            {titleTail ? <span className="block">{titleTail}</span> : null}
          </h1>

          <p className={cn("max-w-2xl text-base leading-7 text-[#66594D] sm:text-[17px]", isLeft ? "text-left" : "text-center")}>
            {description}
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <Button
            size="lg"
            variant="outline"
            onClick={onSecondary}
            className="gap-3 rounded-xl border-[#C8A77C] bg-[#FFFDF8]/88 px-6 text-[#49311E] shadow-[0_6px_18px_rgba(72,47,25,.05)] backdrop-blur-sm hover:bg-white"
          >
            {secondaryLabel} <PhoneCall className="h-4 w-4" />
          </Button>
          <Button
            size="lg"
            onClick={onPrimary}
            className="gap-3 rounded-xl bg-[#A97838] px-7 text-white shadow-[0_12px_26px_rgba(169,120,56,.22)] hover:bg-[#8D5D28]"
          >
            {primaryLabel} <MoveRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}

export { Hero };
