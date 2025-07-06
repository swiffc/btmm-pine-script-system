import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, Download, Copy, Star } from "lucide-react";
import type { PineScriptTemplate } from "@shared/schema";

interface TemplateCardProps {
  template: PineScriptTemplate;
  onPreview?: (template: PineScriptTemplate) => void;
  onUse?: (template: PineScriptTemplate) => void;
}

export default function TemplateCard({ template, onPreview, onUse }: TemplateCardProps) {
  const getCategoryColor = (category: string) => {
    switch (category) {
      case "btmm": return "accent-blue";
      case "indicators": return "accent-green";
      case "strategies": return "accent-orange";
      case "utilities": return "accent-purple";
      default: return "accent-blue";
    }
  };

  const getSubcategoryIcon = (subcategory: string | null) => {
    switch (subcategory) {
      case "market-structure":
        return <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z"/>
        </svg>;
      case "session-analysis":
        return <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
        </svg>;
      case "risk-management":
        return <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z"/>
        </svg>;
      default:
        return <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M9 11H7v2h2v-2zm4 0h-2v2h2v-2zm4 0h-2v2h2v-2zm2-7h-1V2h-2v2H8V2H6v2H5c-1.1 0-1.99.9-1.99 2L3 20c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V9h14v11z"/>
        </svg>;
    }
  };

  return (
    <Card className="template-card group">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <div className={`p-2 rounded-lg bg-${getCategoryColor(template.category)}/20 text-${getCategoryColor(template.category)}`}>
              {getSubcategoryIcon(template.subcategory)}
            </div>
            <div className="flex-1 min-w-0">
              <CardTitle className="text-dark-text text-base truncate">
                {template.name}
              </CardTitle>
              <p className="text-sm text-dark-muted mt-1">
                {template.description}
              </p>
            </div>
          </div>
          {template.isBuiltIn && (
            <Star className="h-4 w-4 text-accent-yellow fill-current" />
          )}
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        <div className="flex flex-wrap gap-1 mb-4">
          <Badge 
            variant="secondary" 
            className={`text-xs bg-${getCategoryColor(template.category)}/20 text-${getCategoryColor(template.category)} border-${getCategoryColor(template.category)}/30`}
          >
            {template.category.toUpperCase()}
          </Badge>
          {template.subcategory && (
            <Badge variant="outline" className="text-xs border-dark-border text-dark-muted">
              {template.subcategory}
            </Badge>
          )}
          <Badge variant="outline" className="text-xs border-dark-border text-dark-muted">
            v{template.version}
          </Badge>
        </div>
        
        <div className="flex flex-wrap gap-1 mb-4">
          {template.tags.slice(0, 3).map((tag) => (
            <Badge key={tag} variant="outline" className="text-xs border-dark-border text-dark-muted">
              #{tag}
            </Badge>
          ))}
          {template.tags.length > 3 && (
            <Badge variant="outline" className="text-xs border-dark-border text-dark-muted">
              +{template.tags.length - 3} more
            </Badge>
          )}
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex space-x-2">
            <Button
              size="sm"
              variant="outline"
              className="border-dark-border text-dark-text hover:bg-dark-border"
              onClick={() => onPreview?.(template)}
            >
              <Eye className="h-3 w-3 mr-1" />
              Preview
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="border-dark-border text-dark-text hover:bg-dark-border"
            >
              <Copy className="h-3 w-3 mr-1" />
              Copy
            </Button>
          </div>
          <Button
            size="sm"
            className="bg-accent-blue text-dark-bg hover:bg-accent-blue/90"
            onClick={() => onUse?.(template)}
          >
            Use Template
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
