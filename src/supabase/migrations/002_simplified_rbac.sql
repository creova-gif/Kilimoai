-- ============================================================================
-- KILIMO AGRI-AI SUITE - Simplified RBAC (Backend Source of Truth)
-- ============================================================================
-- Migration: 002_simplified_rbac
-- Purpose: Backend-controlled feature access + dynamic onboarding schemas
-- UI IMPACT: NONE - Only data layer changes
-- ============================================================================

-- ============================================================================
-- 1. ROLE FEATURES TABLE (SOURCE OF TRUTH)
-- ============================================================================
CREATE TABLE IF NOT EXISTS role_features (
  role_name TEXT PRIMARY KEY,
  features JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

COMMENT ON TABLE role_features IS 'Backend source of truth for role-based feature access';

-- ============================================================================
-- 2. SEED ALL 7 ROLES (FULL BACKEND CONTROL)
-- ============================================================================

INSERT INTO role_features (role_name, features) VALUES

-- Smallholder Farmer (0-5 acres, Basic features)
('smallholder_farmer', '[
  "crop_planning",
  "yield_forecast",
  "soil_health",
  "livestock_monitor",
  "ai_chat",
  "voice_ai",
  "family_farm_planner",
  "sms_alerts",
  "weather",
  "calendar",
  "market_prices",
  "field_notes"
]'),

-- Farmer Manager (5+ acres, Independent)
('farmer_manager', '[
  "crop_planning",
  "yield_forecast",
  "soil_health",
  "livestock_management",
  "task_management",
  "digital_farm_twin",
  "farm_graph_dashboard",
  "inventory",
  "ai_recommendations",
  "weather",
  "calendar",
  "market_prices",
  "expense_tracking",
  "field_notes"
]'),

-- Farm Manager (Multi-field operations)
('farm_manager', '[
  "crop_planning",
  "yield_forecast",
  "soil_health",
  "livestock_management",
  "task_management",
  "digital_farm_twin",
  "farm_graph_dashboard",
  "inventory",
  "ai_recommendations",
  "team_management",
  "analytics_dashboard",
  "weather",
  "calendar",
  "expense_tracking",
  "field_notes"
]'),

-- Commercial Farm Admin (Enterprise - has EVERYTHING)
('commercial_farm_admin', '[
  "everything",
  "crop_planning",
  "yield_forecast",
  "soil_health",
  "livestock_management",
  "task_management",
  "digital_farm_twin",
  "farm_graph_dashboard",
  "inventory",
  "ai_recommendations",
  "team_management",
  "analytics_dashboard",
  "finance",
  "contract_farming",
  "input_supply",
  "marketplace",
  "enterprise_reports",
  "export_management",
  "mobile_money",
  "insurance",
  "quality_control"
]'),

-- Agribusiness Operations (Buyer/Supplier)
('agribusiness_ops', '[
  "agribusiness_dashboard",
  "marketplace",
  "input_supply",
  "contract_farming",
  "finance",
  "analytics",
  "supply_chain",
  "quality_control",
  "procurement",
  "ai_chat"
]'),

-- Extension Officer (NGO/Government)
('extension_officer', '[
  "extension_tools",
  "farmer_lab",
  "sms_broadcast",
  "impact_reports",
  "cooperative_dashboard",
  "ai_recommendations",
  "field_notes",
  "training_modules",
  "ai_chat"
]'),

-- Cooperative Leader (Multi-farmer management)
('cooperative_leader', '[
  "cooperative_dashboard",
  "marketplace",
  "member_management",
  "analytics",
  "sms_alerts",
  "group_sales",
  "finance",
  "ai_chat"
]')

ON CONFLICT (role_name) DO UPDATE SET
  features = EXCLUDED.features,
  updated_at = NOW();

-- ============================================================================
-- 3. ROLE ONBOARDING SCHEMA TABLE (DYNAMIC DATA, SAME SCREENS)
-- ============================================================================
CREATE TABLE IF NOT EXISTS role_onboarding_schema (
  role_name TEXT PRIMARY KEY,
  schema JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

COMMENT ON TABLE role_onboarding_schema IS 'Dynamic onboarding schemas - same UI, different data';

-- ============================================================================
-- 4. SEED ONBOARDING SCHEMAS FOR ALL ROLES
-- ============================================================================

INSERT INTO role_onboarding_schema (role_name, schema) VALUES

-- Smallholder Farmer (3 steps, basic info)
('smallholder_farmer', '{
  "steps": [
    {
      "id": 1,
      "title": "Farm Details",
      "title_sw": "Maelezo ya Shamba",
      "fields": [
        {
          "name": "farm_size",
          "type": "number",
          "label": "Farm size (acres)",
          "label_sw": "Ukubwa wa shamba (ekari)",
          "required": true,
          "min": 0,
          "max": 5
        },
        {
          "name": "main_crop",
          "type": "select",
          "label": "Main crop",
          "label_sw": "Zao kuu",
          "required": true,
          "options": ["Maize", "Rice", "Beans", "Cassava", "Sweet Potato"],
          "options_sw": ["Mahindi", "Mchele", "Maharagwe", "Mihogo", "Viazi vitamu"]
        }
      ]
    },
    {
      "id": 2,
      "title": "Livestock & Location",
      "title_sw": "Mifugo na Eneo",
      "fields": [
        {
          "name": "has_livestock",
          "type": "checkbox",
          "label": "Do you raise livestock?",
          "label_sw": "Je, unafuga mifugo?"
        },
        {
          "name": "livestock_type",
          "type": "multiselect",
          "label": "Livestock type",
          "label_sw": "Aina ya mifugo",
          "depends_on": "has_livestock",
          "options": ["Cattle", "Goats", "Sheep", "Chickens", "Ducks"],
          "options_sw": ["Ng''ombe", "Mbuzi", "Kondoo", "Kuku", "Bata"]
        },
        {
          "name": "region",
          "type": "select",
          "label": "Region",
          "label_sw": "Mkoa",
          "required": true,
          "options": ["Arusha", "Dar es Salaam", "Dodoma", "Iringa", "Kilimanjaro", "Mbeya", "Morogoro", "Mwanza", "Tanga"]
        }
      ]
    },
    {
      "id": 3,
      "title": "Preferences",
      "title_sw": "Mapendeleo",
      "fields": [
        {
          "name": "preferred_language",
          "type": "select",
          "label": "Preferred language",
          "label_sw": "Lugha unayopendelea",
          "required": true,
          "options": ["English", "Swahili"],
          "options_sw": ["Kiingereza", "Kiswahili"]
        },
        {
          "name": "sms_opt_in",
          "type": "checkbox",
          "label": "Receive SMS alerts?",
          "label_sw": "Pokea SMS za tahadhari?"
        }
      ]
    }
  ]
}'),

-- Farmer Manager (5+ acres)
('farmer_manager', '{
  "steps": [
    {
      "id": 1,
      "title": "Farm Details",
      "title_sw": "Maelezo ya Shamba",
      "fields": [
        {
          "name": "farm_size",
          "type": "number",
          "label": "Farm size (acres)",
          "label_sw": "Ukubwa wa shamba (ekari)",
          "required": true,
          "min": 5
        },
        {
          "name": "num_fields",
          "type": "number",
          "label": "Number of fields",
          "label_sw": "Idadi ya mashamba",
          "required": true
        },
        {
          "name": "main_crops",
          "type": "multiselect",
          "label": "Main crops",
          "label_sw": "Mazao makuu",
          "required": true,
          "options": ["Maize", "Rice", "Beans", "Coffee", "Cotton", "Sunflower"]
        }
      ]
    },
    {
      "id": 2,
      "title": "Operations",
      "title_sw": "Shughuli",
      "fields": [
        {
          "name": "has_livestock",
          "type": "checkbox",
          "label": "Raise livestock?",
          "label_sw": "Unafuga mifugo?"
        },
        {
          "name": "has_irrigation",
          "type": "checkbox",
          "label": "Have irrigation system?",
          "label_sw": "Una mfumo wa umwagiliaji?"
        },
        {
          "name": "region",
          "type": "select",
          "label": "Region",
          "label_sw": "Mkoa",
          "required": true,
          "options": ["Arusha", "Dodoma", "Kilimanjaro", "Mbeya", "Morogoro", "Mwanza"]
        }
      ]
    },
    {
      "id": 3,
      "title": "Preferences",
      "title_sw": "Mapendeleo",
      "fields": [
        {
          "name": "preferred_language",
          "type": "select",
          "label": "Preferred language",
          "label_sw": "Lugha unayopendelea",
          "required": true,
          "options": ["English", "Swahili"]
        }
      ]
    }
  ]
}'),

-- Commercial Farm Admin (Enterprise operations)
('commercial_farm_admin', '{
  "steps": [
    {
      "id": 1,
      "title": "Company Details",
      "title_sw": "Maelezo ya Kampuni",
      "fields": [
        {
          "name": "company_name",
          "type": "text",
          "label": "Company/Farm name",
          "label_sw": "Jina la kampuni/shamba",
          "required": true
        },
        {
          "name": "total_acreage",
          "type": "number",
          "label": "Total farm acreage",
          "label_sw": "Jumla ya ekari",
          "required": true,
          "min": 50
        },
        {
          "name": "num_farms",
          "type": "number",
          "label": "Number of farms managed",
          "label_sw": "Idadi ya mashamba",
          "required": true
        }
      ]
    },
    {
      "id": 2,
      "title": "Operations",
      "title_sw": "Shughuli",
      "fields": [
        {
          "name": "crops",
          "type": "multiselect",
          "label": "Crops produced",
          "label_sw": "Mazao yanayozalishwa",
          "required": true,
          "options": ["Maize", "Rice", "Coffee", "Tea", "Cotton", "Tobacco", "Cashew"]
        },
        {
          "name": "livestock_units",
          "type": "number",
          "label": "Livestock units (if any)",
          "label_sw": "Vitengo vya mifugo",
          "min": 0
        },
        {
          "name": "has_export",
          "type": "checkbox",
          "label": "Export products?",
          "label_sw": "Unasafirisha bidhaa nje?"
        }
      ]
    },
    {
      "id": 3,
      "title": "Tools & Preferences",
      "title_sw": "Zana na Mapendeleo",
      "fields": [
        {
          "name": "finance_tools",
          "type": "checkbox",
          "label": "Need finance management tools?",
          "label_sw": "Unahitaji zana za usimamizi wa fedha?"
        },
        {
          "name": "market_access",
          "type": "checkbox",
          "label": "Need marketplace access?",
          "label_sw": "Unahitaji upatikanaji wa soko?"
        },
        {
          "name": "preferred_language",
          "type": "select",
          "label": "Preferred language",
          "label_sw": "Lugha unayopendelea",
          "required": true,
          "options": ["English", "Swahili"]
        }
      ]
    }
  ]
}'),

-- Agribusiness Operations
('agribusiness_ops', '{
  "steps": [
    {
      "id": 1,
      "title": "Business Details",
      "fields": [
        {"name": "business_name", "type": "text", "label": "Business name", "required": true},
        {"name": "business_type", "type": "select", "label": "Business type", "required": true, "options": ["Input Supplier", "Buyer/Aggregator", "Processor", "Exporter"]},
        {"name": "annual_volume", "type": "select", "label": "Annual trade volume", "options": ["< 100 tons", "100-500 tons", "500-1000 tons", "> 1000 tons"]}
      ]
    },
    {
      "id": 2,
      "title": "Products & Regions",
      "fields": [
        {"name": "products_traded", "type": "multiselect", "label": "Products traded", "required": true, "options": ["Seeds", "Fertilizers", "Machinery", "Grains", "Vegetables", "Fruits"]},
        {"name": "operates_regions", "type": "multiselect", "label": "Operating regions", "required": true, "options": ["Arusha", "Dar es Salaam", "Dodoma", "Mwanza", "Tanga"]}
      ]
    },
    {
      "id": 3,
      "title": "Preferences",
      "fields": [
        {"name": "preferred_language", "type": "select", "label": "Preferred language", "required": true, "options": ["English", "Swahili"]}
      ]
    }
  ]
}'),

-- Extension Officer
('extension_officer', '{
  "steps": [
    {
      "id": 1,
      "title": "Organization",
      "fields": [
        {"name": "organization_name", "type": "text", "label": "Organization name", "required": true},
        {"name": "organization_type", "type": "select", "label": "Organization type", "required": true, "options": ["Government", "NGO", "Private Sector", "Research Institution"]},
        {"name": "farmers_served", "type": "number", "label": "Farmers you serve", "min": 0}
      ]
    },
    {
      "id": 2,
      "title": "Expertise",
      "fields": [
        {"name": "specialization", "type": "multiselect", "label": "Specialization", "required": true, "options": ["Crop Production", "Livestock", "Irrigation", "Soil Management", "Pest Control"]},
        {"name": "operates_regions", "type": "multiselect", "label": "Operating regions", "required": true, "options": ["Arusha", "Dodoma", "Kilimanjaro", "Mbeya", "Morogoro"]}
      ]
    },
    {
      "id": 3,
      "title": "Preferences",
      "fields": [
        {"name": "preferred_language", "type": "select", "label": "Preferred language", "required": true, "options": ["English", "Swahili"]}
      ]
    }
  ]
}'),

-- Cooperative Leader
('cooperative_leader', '{
  "steps": [
    {
      "id": 1,
      "title": "Cooperative Details",
      "fields": [
        {"name": "cooperative_name", "type": "text", "label": "Cooperative name", "required": true},
        {"name": "num_members", "type": "number", "label": "Number of members", "required": true, "min": 10},
        {"name": "total_member_acreage", "type": "number", "label": "Total members acreage", "min": 0}
      ]
    },
    {
      "id": 2,
      "title": "Products & Facilities",
      "fields": [
        {"name": "primary_products", "type": "multiselect", "label": "Primary products", "required": true, "options": ["Coffee", "Tea", "Cotton", "Cashew", "Maize", "Rice"]},
        {"name": "has_storage", "type": "checkbox", "label": "Have cooperative storage?"},
        {"name": "region", "type": "select", "label": "Region", "required": true, "options": ["Arusha", "Kilimanjaro", "Mbeya", "Mwanza"]}
      ]
    },
    {
      "id": 3,
      "title": "Preferences",
      "fields": [
        {"name": "preferred_language", "type": "select", "label": "Preferred language", "required": true, "options": ["English", "Swahili"]}
      ]
    }
  ]
}')

ON CONFLICT (role_name) DO UPDATE SET
  schema = EXCLUDED.schema,
  updated_at = NOW();

-- ============================================================================
-- 5. USER SETTINGS TABLE (GLOBAL LANGUAGE)
-- ============================================================================
CREATE TABLE IF NOT EXISTS user_settings (
  user_id TEXT PRIMARY KEY,
  language TEXT DEFAULT 'en' CHECK (language IN ('en', 'sw')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

COMMENT ON TABLE user_settings IS 'Global user settings - language is consistent across entire session';

-- ============================================================================
-- 6. HELPER FUNCTIONS
-- ============================================================================

-- Get features for a role
CREATE OR REPLACE FUNCTION get_role_features(p_role_name TEXT)
RETURNS JSONB AS $$
BEGIN
  RETURN (
    SELECT features
    FROM role_features
    WHERE role_name = p_role_name
  );
END;
$$ LANGUAGE plpgsql;

-- Check if role has feature (handles "everything" permission)
CREATE OR REPLACE FUNCTION has_feature(p_role_name TEXT, p_feature TEXT)
RETURNS BOOLEAN AS $$
DECLARE
  role_features JSONB;
BEGIN
  role_features := get_role_features(p_role_name);
  
  -- Check for "everything" permission or specific feature
  RETURN (
    role_features ? 'everything' OR
    role_features ? p_feature
  );
END;
$$ LANGUAGE plpgsql;

-- Get onboarding schema for a role
CREATE OR REPLACE FUNCTION get_onboarding_schema(p_role_name TEXT)
RETURNS JSONB AS $$
BEGIN
  RETURN (
    SELECT schema
    FROM role_onboarding_schema
    WHERE role_name = p_role_name
  );
END;
$$ LANGUAGE plpgsql;

-- Get user language setting
CREATE OR REPLACE FUNCTION get_user_language(p_user_id TEXT)
RETURNS TEXT AS $$
BEGIN
  RETURN (
    SELECT COALESCE(language, 'en')
    FROM user_settings
    WHERE user_id = p_user_id
  );
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- 7. TRIGGERS (AUTO-UPDATE TIMESTAMPS)
-- ============================================================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_role_features_timestamp
  BEFORE UPDATE ON role_features
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_role_onboarding_schema_timestamp
  BEFORE UPDATE ON role_onboarding_schema
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_settings_timestamp
  BEFORE UPDATE ON user_settings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- END OF MIGRATION
-- ============================================================================
-- UI IMPACT: NONE
-- All logic happens at data layer before reaching UI
-- ============================================================================
