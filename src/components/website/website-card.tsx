"use client";

import { motion } from "framer-motion";
import { useAtomValue } from "jotai";
import { Card } from "@/ui/common/card";
import { Button } from "@/ui/common/button";
import { Badge } from "@/ui/common/badge";
import {
  ExternalLink,
  ThumbsUp,
  ThumbsDown,
  Globe,
  ArrowUpRight,
  Heart,
} from "lucide-react";
import { cn } from "@/lib/utils/utils";
import {
  cardHoverVariants,
  sharedLayoutTransition,
} from "@/ui/animation/variants/animations";
import type { Website, Category } from "@/lib/types";
import { useState, useEffect, useRef } from "react";
import { WebsiteThumbnail } from "./website-thumbnail";
import { toast } from "@/hooks/use-toast";
import { useCardTilt } from "@/hooks/use-card-tilt";

interface WebsiteCardProps {
  website: Website;
  category?: Category;
  isAdmin: boolean;
  onVisit: (website: Website) => void;
  onStatusUpdate: (id: number, status: Website["status"]) => void;
}

export function WebsiteCard({
  website,
  category,
  isAdmin,
  onVisit,
  onStatusUpdate,
}: WebsiteCardProps) {
  const [likes, setLikes] = useState(website.likes);
  const { cardRef, tiltProps } = useCardTilt();
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const mouseMoveThrottleRef = useRef<number>();

  const statusColors: Record<Website["status"], string> = {
    pending: "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400",
    approved: "bg-green-500/10 text-green-600 dark:text-green-400",
    rejected: "bg-red-500/10 text-red-600 dark:text-red-400",
    all: "",
  };

  const statusText: Record<Website["status"], string> = {
    pending: "待审核",
    approved: "已通过",
    rejected: "已拒绝",
    all: "",
  };

  const handleLike = async () => {
    const key = `website-${website.id}-liked`;
    const lastLiked = localStorage.getItem(key);
    const now = new Date().getTime();

    if (lastLiked) {
      const lastLikedTime = parseInt(lastLiked);
      const oneDay = 24 * 60 * 60 * 1000; // 24小时的毫秒数

      if (now - lastLikedTime < oneDay) {
        toast({
          title: "已点赞",
          description: "每天只能点赞一次哦，明天再来吧 (｡•́︿•̀｡)",
        });
        return;
      }
    }

    const method = "POST";
    fetch(`/api/websites/${website.id}/like`, { method });
    localStorage.setItem(key, now.toString());
    setLikes(likes + 1);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (mouseMoveThrottleRef.current) return;

    mouseMoveThrottleRef.current = window.setTimeout(() => {
      mouseMoveThrottleRef.current = undefined;
    }, 16); // 约60fps的节流

    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setMousePosition({ x, y });
  };

  useEffect(() => {
    return () => {
      if (mouseMoveThrottleRef.current) {
        clearTimeout(mouseMoveThrottleRef.current);
      }
    };
  }, []);

  return (
    <div
      ref={cardRef}
      onMouseMove={(e) => {
        handleMouseMove(e);
        tiltProps.onMouseMove?.(e);
      }}
      onMouseEnter={(e) => {
        setIsHovered(true);
        tiltProps.onMouseEnter?.(e);
      }}
      onMouseLeave={(e) => {
        setIsHovered(false);
        tiltProps.onMouseLeave?.(e);
      }}
      className="card-container relative [perspective:1000px]"
    >
      <motion.div
        variants={cardHoverVariants}
        initial="initial"
        whileHover="hover"
        whileTap="tap"
        layoutId={`website-${website.id}`}
        transition={sharedLayoutTransition}
        className="h-full"
      >
        <Card
          className={cn(
            "group relative flex flex-col overflow-hidden",
            "bg-background/10 backdrop-blur-2xl backdrop-saturate-150",
            "border-white/5 dark:border-white/10",
            "hover:bg-background/15 hover:backdrop-blur-3xl hover:backdrop-saturate-200",
            "shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)]",
            "dark:shadow-[0_8px_30px_rgb(0,0,0,0.08)] dark:hover:shadow-[0_8px_30px_rgb(0,0,0,0.15)]",
            "transition-all duration-500 ease-out",
            "rounded-2xl sm:rounded-lg",
            "before:absolute before:inset-[1px] before:rounded-[inherit] before:bg-white/[0.02] before:backdrop-blur-xl before:backdrop-saturate-150 before:z-[1]"
          )}
        >
          {/* Mouse Light Effect */}
          <div
            className={cn(
              "absolute inset-[-2px] z-[2]",
              "rounded-[inherit]",
              "transition-opacity duration-300",
              "pointer-events-none overflow-hidden",
              "bg-[radial-gradient(200px_circle_at_var(--mouse-x)_var(--mouse-y),rgba(59,130,246,0.15),transparent_70%)]",
              isHovered ? "opacity-100" : "opacity-0"
            )}
            style={
              {
                transform: "translateZ(0)",
                "--mouse-x": `${mousePosition.x}%`,
                "--mouse-y": `${mousePosition.y}%`,
              } as React.CSSProperties
            }
          />

          {/* Background Gradient */}
          <div className="absolute inset-0 z-[3]">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background/5 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-700" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(120,119,198,0.1),rgba(255,255,255,0))] dark:bg-[radial-gradient(circle_at_50%_120%,rgba(120,119,198,0.15),rgba(255,255,255,0))]" />
          </div>

          {/* Card Content Container */}
          <div className="relative z-[4] flex flex-col flex-1">
            {/* Website Icon and Status */}
            <div className="relative p-2 sm:p-3 flex items-center justify-between card-content">
              <div className="flex items-center gap-2 sm:gap-3 max-w-[75%]">
                <WebsiteThumbnail
                  url={website.url}
                  thumbnail={website.thumbnail}
                  title={website.title}
                />
                <div className="space-y-0.5 min-w-0">
                  <h3 className="text-sm sm:text-base font-medium truncate group-hover:text-primary transition-colors">
                    {website.title}
                  </h3>
                  <Badge
                    variant="secondary"
                    className={cn(
                      "font-normal text-[10px] sm:text-xs",
                      statusColors[website.status]
                    )}
                  >
                    {statusText[website.status]}
                  </Badge>
                </div>
              </div>
              <Badge
                variant="outline"
                className={cn(
                  "text-[10px] sm:text-xs font-normal",
                  "bg-background/50 backdrop-blur-sm shrink-0",
                  "absolute top-1.5 right-1.5 sm:static",
                  "rounded-xl sm:rounded-lg"
                )}
              >
                {category?.name || "未分类"}
              </Badge>
            </div>

            {/* Description */}
            <div className="relative px-2 py-1.5 sm:px-3 sm:py-2 flex-1">
              <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2">
                {website.description}
              </p>
            </div>

            {/* Stats and Actions */}
            <div className="relative px-2 py-1.5 sm:px-3 sm:py-2 flex items-center justify-between border-t border-border/5">
              {/* Stats */}
              <div className="flex items-center gap-3 text-[10px] sm:text-xs text-muted-foreground">
                <span>{website.visits} 次访问</span>
                <div className="flex items-center gap-1">
                  <Heart className="w-3 h-3" />
                  <span>{likes}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-1.5 sm:gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onVisit(website)}
                  className={cn(
                    "h-7 sm:h-8 px-3 sm:flex-1 text-xs sm:text-sm",
                    "bg-white/[0.02] backdrop-blur-xl border-white/10",
                    "hover:bg-white/[0.04] hover:border-white/20 hover:text-primary",
                    "dark:bg-white/[0.01] dark:hover:bg-white/[0.02]",
                    "transition-all duration-300"
                  )}
                >
                  <span className="hidden sm:inline">访问网站</span>
                  <ArrowUpRight className="h-3 w-3 sm:h-4 sm:w-4" />
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleLike}
                  className={cn(
                    "h-7 w-7 sm:h-8 sm:w-8 p-0",
                    "bg-white/[0.02] backdrop-blur-xl border-white/10",
                    "hover:bg-red-500/5 hover:border-red-500/20 hover:text-red-500",
                    "dark:bg-white/[0.01] dark:hover:bg-red-500/10",
                    "transition-all duration-300"
                  )}
                >
                  <motion.div
                    whileTap={{ scale: 1.4 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Heart className="h-3 w-3 sm:h-4 sm:w-4" />
                  </motion.div>
                </Button>

                {isAdmin && website.status !== "approved" && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onStatusUpdate(website.id, "approved")}
                    className={cn(
                      "h-7 sm:h-8 px-1.5 sm:px-2",
                      "bg-white/[0.02] backdrop-blur-xl border-white/10",
                      "hover:bg-green-500/5 hover:border-green-500/20 hover:text-green-500",
                      "dark:bg-white/[0.01] dark:hover:bg-green-500/10",
                      "transition-all duration-300"
                    )}
                  >
                    <ThumbsUp className="h-3 w-3 sm:h-4 sm:w-4" />
                  </Button>
                )}

                {isAdmin && website.status !== "rejected" && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      onStatusUpdate(website.id, "rejected");
                    }}
                    className={cn(
                      "h-7 sm:h-8 px-1.5 sm:px-2",
                      "bg-white/[0.02] backdrop-blur-xl border-white/10",
                      "hover:bg-red-500/5 hover:border-red-500/20 hover:text-red-500",
                      "dark:bg-white/[0.01] dark:hover:bg-red-500/10",
                      "transition-all duration-300"
                    )}
                  >
                    <ThumbsDown className="h-3 w-3 sm:h-4 sm:w-4" />
                  </Button>
                )}
              </div>
            </div>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}