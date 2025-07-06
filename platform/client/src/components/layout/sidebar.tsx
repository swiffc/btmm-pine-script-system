import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { 
  Code, 
  FolderOpen, 
  Wand2, 
  CheckCircle, 
  Brain, 
  Layers, 
  Clock, 
  BarChart3,
  Bot,
  Wind,
  FileText,
  Book,
  Shield,
  GitBranch,
  Download
} from "lucide-react";

const navigationItems = [
  {
    title: "Development",
    items: [
      { icon: Code, label: "Pine Script Editor", href: "/editor" },
      { icon: FolderOpen, label: "Template Library", href: "/templates" },
      { icon: Wand2, label: "Code Generator", href: "/generator" },
      { icon: CheckCircle, label: "Syntax Validator", href: "/validator" }
    ]
  },
  {
    title: "BTMM Strategy",
    items: [
      { icon: Brain, label: "Market Maker Detection", href: "/btmm/detection" },
      { icon: Layers, label: "4-Phase Structure", href: "/btmm/phases" },
      { icon: Clock, label: "Session Analysis", href: "/btmm/sessions" },
      { icon: BarChart3, label: "Multi-Timeframe", href: "/btmm/timeframes" }
    ]
  },
  {
    title: "Configuration",
    items: [
      { icon: Bot, label: "Cursor Rules", href: "/config/cursor" },
      { icon: Wind, label: "Windsurf Config", href: "/config/windsurf" },
      { icon: FileText, label: "PRD Templates", href: "/config/prd" },
      { icon: Book, label: "Documentation", href: "/documentation" }
    ]
  },
  {
    title: "Tools",
    items: [
      { icon: Shield, label: "Risk Management", href: "/tools/risk" },
      { icon: GitBranch, label: "Version Control", href: "/tools/git" },
      { icon: Download, label: "Export Tools", href: "/tools/export" }
    ]
  }
];

export default function Sidebar() {
  const [location] = useLocation();

  return (
    <aside className="trading-sidebar w-64 overflow-y-auto">
      <nav className="p-4 space-y-2">
        {navigationItems.map((section) => (
          <div key={section.title} className="mb-6">
            <h3 className="text-sm font-semibold text-dark-muted uppercase tracking-wider mb-3">
              {section.title}
            </h3>
            <ul className="space-y-1">
              {section.items.map((item) => {
                const IconComponent = item.icon;
                const isActive = location === item.href || (item.href === "/editor" && location === "/");
                
                return (
                  <li key={item.href}>
                    <Link href={item.href}>
                      <a className={cn(
                        "flex items-center px-3 py-2 text-sm rounded-lg transition-colors",
                        isActive 
                          ? "bg-accent-blue text-dark-bg font-medium" 
                          : "text-dark-text hover:bg-dark-border"
                      )}>
                        <IconComponent className="h-4 w-4 mr-3" />
                        {item.label}
                      </a>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>
    </aside>
  );
}
