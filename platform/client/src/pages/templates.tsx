import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Header from "@/components/layout/header";
import Sidebar from "@/components/layout/sidebar";
import TemplateCard from "@/components/templates/template-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, Plus } from "lucide-react";
import type { PineScriptTemplate } from "@shared/schema";

export default function Templates() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const { data: templates = [], isLoading } = useQuery({
    queryKey: ["/api/templates"],
  });

  const filteredTemplates = templates.filter((template: PineScriptTemplate) => {
    const matchesSearch = template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesCategory = selectedCategory === "all" || template.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const categories = [
    { value: "all", label: "All Templates" },
    { value: "btmm", label: "BTMM Strategy" },
    { value: "indicators", label: "Technical Indicators" },
    { value: "strategies", label: "Trading Strategies" },
    { value: "utilities", label: "Utilities" }
  ];

  const subcategories = [
    "market-structure",
    "session-analysis", 
    "risk-management",
    "oscillators",
    "trend-following",
    "volume-analysis"
  ];

  return (
    <div className="h-screen flex flex-col bg-dark-bg">
      <Header />
      
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        
        <main className="flex-1 p-6 overflow-y-auto">
          <div className="max-w-7xl mx-auto">
            {/* Header Section */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-dark-text mb-2">Pine Script Template Library</h1>
              <p className="text-dark-muted">
                Professional-grade Pine Script v5 templates for BTMM strategy and technical analysis
              </p>
            </div>

            {/* Filters and Search */}
            <div className="mb-8 space-y-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-dark-muted h-4 w-4" />
                  <Input
                    placeholder="Search templates, tags, or descriptions..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-dark-surface border-dark-border text-dark-text"
                  />
                </div>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="w-48 bg-dark-surface border-dark-border text-dark-text">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-dark-surface border-dark-border">
                    {categories.map((category) => (
                      <SelectItem key={category.value} value={category.value} className="text-dark-text">
                        {category.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button className="bg-accent-blue text-dark-bg hover:bg-accent-blue/90">
                  <Plus className="h-4 w-4 mr-2" />
                  New Template
                </Button>
              </div>

              {/* Popular Tags */}
              <div className="flex flex-wrap gap-2">
                <span className="text-sm text-dark-muted">Popular tags:</span>
                {["btmm", "market-structure", "sessions", "risk-management", "indicators", "strategies"].map((tag) => (
                  <Badge
                    key={tag}
                    variant="secondary"
                    className="cursor-pointer hover:bg-accent-blue hover:text-dark-bg transition-colors"
                    onClick={() => setSearchTerm(tag)}
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
              <div className="bg-dark-surface rounded-lg p-4 border border-dark-border">
                <div className="text-2xl font-bold text-accent-blue">{templates.length}</div>
                <div className="text-sm text-dark-muted">Total Templates</div>
              </div>
              <div className="bg-dark-surface rounded-lg p-4 border border-dark-border">
                <div className="text-2xl font-bold text-accent-green">
                  {templates.filter((t: PineScriptTemplate) => t.category === "btmm").length}
                </div>
                <div className="text-sm text-dark-muted">BTMM Templates</div>
              </div>
              <div className="bg-dark-surface rounded-lg p-4 border border-dark-border">
                <div className="text-2xl font-bold text-accent-orange">
                  {templates.filter((t: PineScriptTemplate) => t.isBuiltIn).length}
                </div>
                <div className="text-sm text-dark-muted">Built-in Templates</div>
              </div>
              <div className="bg-dark-surface rounded-lg p-4 border border-dark-border">
                <div className="text-2xl font-bold text-accent-purple">5</div>
                <div className="text-sm text-dark-muted">Pine Script v5</div>
              </div>
            </div>

            {/* Templates Grid */}
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="bg-dark-surface rounded-lg p-6 border border-dark-border animate-pulse">
                    <div className="h-4 bg-dark-border rounded mb-2"></div>
                    <div className="h-3 bg-dark-border rounded mb-4 w-3/4"></div>
                    <div className="space-y-2">
                      <div className="h-2 bg-dark-border rounded"></div>
                      <div className="h-2 bg-dark-border rounded w-2/3"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : filteredTemplates.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">📄</div>
                <h3 className="text-xl font-semibold text-dark-text mb-2">No templates found</h3>
                <p className="text-dark-muted mb-4">
                  {searchTerm || selectedCategory !== "all" 
                    ? "Try adjusting your search criteria or filters."
                    : "No templates available yet."
                  }
                </p>
                <Button className="bg-accent-blue text-dark-bg hover:bg-accent-blue/90">
                  <Plus className="h-4 w-4 mr-2" />
                  Create First Template
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredTemplates.map((template: PineScriptTemplate) => (
                  <TemplateCard key={template.id} template={template} />
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
