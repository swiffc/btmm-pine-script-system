import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertTemplateSchema, insertProjectSchema, insertSnippetSchema, type InsertTemplate, type InsertProject } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Template routes
  app.get("/api/templates", async (req, res) => {
    try {
      const category = req.query.category as string;
      const templates = category 
        ? await storage.getTemplatesByCategory(category)
        : await storage.getAllTemplates();
      res.json(templates);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch templates" });
    }
  });

  app.get("/api/templates/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const template = await storage.getTemplate(id);
      if (!template) {
        return res.status(404).json({ error: "Template not found" });
      }
      return res.json(template);
    } catch (error) {
      return res.status(500).json({ error: "Failed to fetch template" });
    }
  });

  app.post("/api/templates", async (req, res) => {
    try {
      const templateData = insertTemplateSchema.parse(req.body);
      const template = await storage.createTemplate(templateData);
      return res.status(201).json(template);
    } catch (error) {
      return res.status(400).json({ error: "Invalid template data" });
    }
  });

  app.put("/api/templates/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const bodyData = req.body;
      const updateData: Partial<InsertTemplate> = {};
      
      if (bodyData.name !== undefined) updateData.name = bodyData.name;
      if (bodyData.description !== undefined) updateData.description = bodyData.description;
      if (bodyData.category !== undefined) updateData.category = bodyData.category;
      if (bodyData.code !== undefined) updateData.code = bodyData.code;
      if (bodyData.subcategory !== undefined) updateData.subcategory = bodyData.subcategory;
      if (bodyData.version !== undefined) updateData.version = bodyData.version;
      if (bodyData.tags !== undefined) updateData.tags = bodyData.tags;
      if (bodyData.isBuiltIn !== undefined) updateData.isBuiltIn = bodyData.isBuiltIn;
      
      const template = await storage.updateTemplate(id, updateData);
      if (!template) {
        return res.status(404).json({ error: "Template not found" });
      }
      return res.json(template);
    } catch (error) {
      return res.status(400).json({ error: "Invalid template data" });
    }
  });

  app.delete("/api/templates/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.deleteTemplate(id);
      if (!success) {
        return res.status(404).json({ error: "Template not found" });
      }
      return res.status(204).send();
    } catch (error) {
      return res.status(500).json({ error: "Failed to delete template" });
    }
  });

  // Project routes
  app.get("/api/projects", async (req, res) => {
    try {
      const userId = parseInt(req.query.userId as string) || 1; // Default user
      const projects = await storage.getUserProjects(userId);
      return res.json(projects);
    } catch (error) {
      return res.status(500).json({ error: "Failed to fetch projects" });
    }
  });

  app.get("/api/projects/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const project = await storage.getProject(id);
      if (!project) {
        return res.status(404).json({ error: "Project not found" });
      }
      return res.json(project);
    } catch (error) {
      return res.status(500).json({ error: "Failed to fetch project" });
    }
  });

  app.post("/api/projects", async (req, res) => {
    try {
      const projectData = insertProjectSchema.parse(req.body);
      const project = await storage.createProject(projectData);
      return res.status(201).json(project);
    } catch (error) {
      return res.status(400).json({ error: "Invalid project data" });
    }
  });

  app.put("/api/projects/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const bodyData = req.body;
      const updateData: Partial<InsertProject> = {};
      
      if (bodyData.name !== undefined) updateData.name = bodyData.name;
      if (bodyData.description !== undefined) updateData.description = bodyData.description;
      if (bodyData.userId !== undefined) updateData.userId = bodyData.userId;
      if (bodyData.files !== undefined) updateData.files = bodyData.files;
      if (bodyData.settings !== undefined) updateData.settings = bodyData.settings;
      
      const project = await storage.updateProject(id, updateData);
      if (!project) {
        return res.status(404).json({ error: "Project not found" });
      }
      return res.json(project);
    } catch (error) {
      return res.status(400).json({ error: "Invalid project data" });
    }
  });

  app.delete("/api/projects/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.deleteProject(id);
      if (!success) {
        return res.status(404).json({ error: "Project not found" });
      }
      return res.status(204).send();
    } catch (error) {
      return res.status(500).json({ error: "Failed to delete project" });
    }
  });

  // Code snippets routes
  app.get("/api/snippets", async (req, res) => {
    try {
      const category = req.query.category as string;
      const snippets = category 
        ? await storage.getSnippetsByCategory(category)
        : await storage.getAllSnippets();
      res.json(snippets);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch snippets" });
    }
  });

  app.post("/api/snippets", async (req, res) => {
    try {
      const snippetData = insertSnippetSchema.parse(req.body);
      const snippet = await storage.createSnippet(snippetData);
      res.status(201).json(snippet);
    } catch (error) {
      res.status(400).json({ error: "Invalid snippet data" });
    }
  });

  // Pine Script validation endpoint
  app.post("/api/validate-pine-script", async (req, res) => {
    try {
      const { code } = req.body;
      
      // Basic Pine Script v5 validation
      const validationResults = validatePineScript(code);
      res.json(validationResults);
    } catch (error) {
      res.status(500).json({ error: "Validation failed" });
    }
  });

  // Export functionality
  app.post("/api/export-to-tradingview", async (req, res) => {
    try {
      const { code, name } = req.body;
      
      // Generate TradingView-compatible export
      const exportData = {
        name,
        code,
        version: "5",
        timestamp: new Date().toISOString(),
        exportUrl: "https://www.tradingview.com/pine-editor/"
      };
      
      res.json(exportData);
    } catch (error) {
      res.status(500).json({ error: "Export failed" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}

// Pine Script validation helper
function validatePineScript(code: string) {
  const errors: string[] = [];
  const warnings: string[] = [];
  
  // Check for version declaration
  if (!code.includes("//@version=5") && !code.includes("//@version=6")) {
    errors.push("Missing version declaration. Add //@version=5 at the top of your script.");
  }
  
  // Check for basic structure
  if (!code.includes("indicator(") && !code.includes("strategy(") && !code.includes("library(")) {
    errors.push("Script must declare as indicator(), strategy(), or library().");
  }
  
  // Check for common syntax errors
  const lines = code.split('\n');
  lines.forEach((line, index) => {
    const lineNum = index + 1;
    
    // Check for assignment without var/varip in global scope
    if (line.trim().match(/^[a-zA-Z_][a-zA-Z0-9_]*\s*=/) && !line.includes('var') && !line.includes('varip')) {
      if (lineNum < 10) { // Likely global scope
        warnings.push(`Line ${lineNum}: Consider using 'var' for variable declaration in global scope.`);
      }
    }
    
    // Check for deprecated functions
    if (line.includes('study(')) {
      errors.push(`Line ${lineNum}: 'study()' is deprecated. Use 'indicator()' instead.`);
    }
  });
  
  return {
    isValid: errors.length === 0,
    errors,
    warnings,
    suggestions: [
      "Use proper indentation for better readability",
      "Add comments to explain complex logic",
      "Consider using functions for repeated code blocks"
    ]
  };
}
