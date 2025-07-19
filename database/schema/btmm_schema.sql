-- BTMM TradingView Script Manager Database Schema
-- For PostgreSQL/Neon Database

-- Users table for authentication and progress tracking
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    username VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_login TIMESTAMP WITH TIME ZONE,
    is_active BOOLEAN DEFAULT true,
    subscription_tier VARCHAR(20) DEFAULT 'free' -- free, pro, premium
);

-- BTMM Workbook chapters
CREATE TABLE workbook_chapters (
    id INTEGER PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    content TEXT NOT NULL, -- Markdown content
    difficulty VARCHAR(20) DEFAULT 'beginner', -- beginner, intermediate, advanced
    estimated_time INTEGER DEFAULT 30, -- minutes
    order_index INTEGER NOT NULL,
    category VARCHAR(100), -- 'ema-system', 'session-analysis', etc.
    prerequisites INTEGER[], -- array of chapter IDs
    learning_objectives TEXT[],
    is_published BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User progress in workbook chapters
CREATE TABLE user_chapter_progress (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    chapter_id INTEGER NOT NULL REFERENCES workbook_chapters(id) ON DELETE CASCADE,
    status VARCHAR(20) DEFAULT 'not_started', -- not_started, in_progress, completed
    started_at TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE,
    time_spent INTEGER DEFAULT 0, -- minutes
    progress_percentage INTEGER DEFAULT 0,
    notes TEXT,
    is_bookmarked BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, chapter_id)
);

-- Pine Script templates
CREATE TABLE pine_script_templates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(100) NOT NULL, -- 'ema-system', 'session-analysis', 'pattern-detection', etc.
    difficulty VARCHAR(20) DEFAULT 'beginner',
    code TEXT NOT NULL, -- Pine Script code
    preview_description TEXT,
    tags TEXT[],
    download_count INTEGER DEFAULT 0,
    rating DECIMAL(3,2) DEFAULT 0.0,
    rating_count INTEGER DEFAULT 0,
    is_built_in BOOLEAN DEFAULT false,
    author_id UUID REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    is_published BOOLEAN DEFAULT true
);

-- User's custom Pine Scripts
CREATE TABLE user_pine_scripts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    code TEXT NOT NULL,
    category VARCHAR(100) DEFAULT 'indicator', -- indicator, strategy, library
    is_private BOOLEAN DEFAULT true,
    last_modified TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    version INTEGER DEFAULT 1,
    parent_template_id UUID REFERENCES pine_script_templates(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Script versions for version control
CREATE TABLE script_versions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    script_id UUID NOT NULL REFERENCES user_pine_scripts(id) ON DELETE CASCADE,
    version_number INTEGER NOT NULL,
    code TEXT NOT NULL,
    change_notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(script_id, version_number)
);

-- User template downloads/usage tracking
CREATE TABLE user_template_usage (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    template_id UUID NOT NULL REFERENCES pine_script_templates(id) ON DELETE CASCADE,
    action VARCHAR(50) NOT NULL, -- 'download', 'copy', 'rate', 'favorite'
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    downloaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, template_id, action)
);

-- System analytics and performance tracking
CREATE TABLE system_analytics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    date DATE NOT NULL,
    metric_name VARCHAR(100) NOT NULL,
    metric_value DECIMAL(15,4),
    metric_data JSONB, -- flexible data storage
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(date, metric_name)
);

-- Trading performance data (for dashboard)
CREATE TABLE trading_performance (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    script_id UUID REFERENCES user_pine_scripts(id),
    date DATE NOT NULL,
    signal_accuracy DECIMAL(5,2),
    win_rate DECIMAL(5,2),
    profit_factor DECIMAL(8,4),
    total_return DECIMAL(8,4),
    max_drawdown DECIMAL(5,2),
    sharpe_ratio DECIMAL(6,4),
    trades_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User settings and preferences
CREATE TABLE user_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE UNIQUE,
    theme VARCHAR(20) DEFAULT 'dark', -- dark, light
    editor_preferences JSONB DEFAULT '{}', -- Monaco editor settings
    notification_preferences JSONB DEFAULT '{}',
    dashboard_layout JSONB DEFAULT '{}',
    timezone VARCHAR(50) DEFAULT 'UTC',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for better performance
CREATE INDEX idx_user_chapter_progress_user_id ON user_chapter_progress(user_id);
CREATE INDEX idx_user_chapter_progress_chapter_id ON user_chapter_progress(chapter_id);
CREATE INDEX idx_user_pine_scripts_user_id ON user_pine_scripts(user_id);
CREATE INDEX idx_pine_script_templates_category ON pine_script_templates(category);
CREATE INDEX idx_pine_script_templates_difficulty ON pine_script_templates(difficulty);
CREATE INDEX idx_workbook_chapters_order ON workbook_chapters(order_index);
CREATE INDEX idx_trading_performance_user_date ON trading_performance(user_id, date);
CREATE INDEX idx_system_analytics_date_metric ON system_analytics(date, metric_name);

-- Triggers for updating timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_workbook_chapters_updated_at BEFORE UPDATE ON workbook_chapters 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_chapter_progress_updated_at BEFORE UPDATE ON user_chapter_progress 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_pine_script_templates_updated_at BEFORE UPDATE ON pine_script_templates 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_pine_scripts_updated_at BEFORE UPDATE ON user_pine_scripts 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_trading_performance_updated_at BEFORE UPDATE ON trading_performance 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_settings_updated_at BEFORE UPDATE ON user_settings 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();