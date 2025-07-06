import { useQuery } from "@tanstack/react-query";
import TemplateCard from "./template-card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Loader2 } from "lucide-react";
import type { PineScriptTemplate } from "@shared/schema";

export default function TemplateLibrary() {
  const { data: templates = [], isLoading } = useQuery({
    queryKey: ["/api/templates", { category: "btmm" }],
  });

  return (
    <div className="p-4 border-b border-dark-border">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-dark-text">BTMM Template Library</h3>
        <Badge variant="secondary" className="text-xs">
          {templates.length} templates
        </Badge>
      </div>
      
      <ScrollArea className="h-64">
        {isLoading ? (
          <div className="flex items-center justify-center h-32">
            <Loader2 className="h-6 w-6 animate-spin text-dark-muted" />
          </div>
        ) : (
          <div className="space-y-2">
            {templates.map((template: PineScriptTemplate) => (
              <div
                key={template.id}
                className="template-card p-3 rounded-lg cursor-pointer"
                onClick={() => {
                  // Load template into editor
                  console.log("Loading template:", template.name);
                }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-medium text-dark-text truncate">
                      {template.name}
                    </h4>
                    <p className="text-xs text-dark-muted mt-1 truncate">
                      {template.description}
                    </p>
                  </div>
                  <div className="ml-2">
                    {template.subcategory === "market-structure" && (
                      <div className="text-accent-blue">
                        <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z"/>
                        </svg>
                      </div>
                    )}
                    {template.subcategory === "session-analysis" && (
                      <div className="text-accent-orange">
                        <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                        </svg>
                      </div>
                    )}
                    {template.subcategory === "risk-management" && (
                      <div className="text-accent-green">
                        <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z"/>
                        </svg>
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex flex-wrap gap-1 mt-2">
                  {template.tags.slice(0, 2).map((tag) => (
                    <Badge key={tag} variant="outline" className="text-xs border-dark-border text-dark-muted">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </ScrollArea>
    </div>
  );
}
