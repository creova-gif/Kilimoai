-- ============================================================================
-- KILIMO AGRI-AI SUITE - Role-Based Features & Dynamic Onboarding Schema
-- ============================================================================
-- Migration: 001_role_features_and_forms
-- Created: January 2026
-- Purpose: Create role_features and role_forms tables for dynamic RBAC
-- ============================================================================

-- ============================================================================
-- 1. ROLE FEATURES TABLE
-- ============================================================================
-- Stores which features each role has access to
CREATE TABLE IF NOT EXISTS role_features (
  id SERIAL PRIMARY KEY,
  role_name TEXT NOT NULL UNIQUE,
  features JSONB NOT NULL DEFAULT '[]',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add index for faster role lookups
CREATE INDEX idx_role_features_role_name ON role_features(role_name);

-- Add comment
COMMENT ON TABLE role_features IS 'Stores feature access permissions for each user role';

-- ============================================================================
-- 2. ROLE FORMS TABLE
-- ============================================================================
-- Stores dynamic onboarding form schemas for each role
CREATE TABLE IF NOT EXISTS role_forms (
  id SERIAL PRIMARY KEY,
  role_name TEXT NOT NULL UNIQUE,
  form_schema JSONB NOT NULL DEFAULT '[]',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add index for faster role lookups
CREATE INDEX idx_role_forms_role_name ON role_forms(role_name);

-- Add comment
COMMENT ON TABLE role_forms IS 'Stores dynamic onboarding form schemas for each user role';

-- ============================================================================
-- 3. SEED DATA - ROLE FEATURES
-- ============================================================================
-- Insert all 7 roles with their feature access permissions

INSERT INTO role_features (role_name, features) VALUES
-- Smallholder Farmer (0-5 acres, Basic features)
('smallholder_farmer', '[
  "crop_planning",
  "livestock_monitor",
  "family_farm_planner",
  "yield_forecast",
  "calendar_overview",
  "soil_health_tracking",
  "ai_chatbot",
  "sms_alerts",
  "weather_forecasts",
  "market_prices",
  "field_notes"
]'),

-- Farmer (5+ acres, Independent farmer)
('farmer', '[
  "crop_planning",
  "livestock_monitor",
  "yield_forecast",
  "calendar_overview",
  "soil_health_tracking",
  "farm_mapping",
  "task_management",
  "resource_inventory",
  "ai_chatbot",
  "weather_forecasts",
  "market_prices",
  "field_notes",
  "expense_tracking"
]'),

-- Farm Manager (Multi-field operations)
('farm_manager', '[
  "crop_planning",
  "livestock_monitor",
  "farm_mapping",
  "digital_farm_twin",
  "calendar_overview",
  "task_management",
  "resource_inventory",
  "analytics_dashboard",
  "ai_chatbot",
  "team_management",
  "field_notes",
  "expense_tracking",
  "yield_forecast",
  "soil_health_tracking"
]'),

-- Commercial Farm Admin (Enterprise operations)
('commercial_farm_admin', '[
  "crop_planning",
  "livestock_monitor",
  "farm_mapping",
  "digital_farm_twin",
  "yield_forecast",
  "calendar_overview",
  "task_management",
  "resource_inventory",
  "marketplace",
  "input_supply",
  "contract_farming",
  "ai_chatbot",
  "analytics_dashboard",
  "team_management",
  "finance_management",
  "mobile_money",
  "insurance",
  "export_management"
]'),

-- Agribusiness Operations (Buyer/Supplier)
('agribusiness_ops', '[
  "crop_planning",
  "farm_mapping",
  "digital_farm_twin",
  "analytics_dashboard",
  "marketplace",
  "input_supply",
  "contract_farming",
  "finance_management",
  "mobile_money",
  "insurance",
  "ai_chatbot",
  "supply_chain",
  "quality_control",
  "export_management",
  "procurement"
]'),

-- Extension Officer (NGO/Government advisor)
('extension_officer', '[
  "crop_planning",
  "livestock_monitor",
  "farm_mapping",
  "cooperative_dashboard",
  "analytics_dashboard",
  "ai_recommendations",
  "sms_alerts",
  "field_notes",
  "farmer_lab",
  "training_modules",
  "impact_reporting",
  "farmer_support"
]'),

-- Cooperative Leader (Multi-farmer management)
('cooperative_leader', '[
  "cooperative_dashboard",
  "marketplace",
  "contract_farming",
  "input_supply",
  "analytics_dashboard",
  "sms_alerts",
  "ai_chatbot",
  "member_management",
  "group_sales",
  "finance_management",
  "mobile_money"
]')

ON CONFLICT (role_name) DO UPDATE SET
  features = EXCLUDED.features,
  updated_at = NOW();

-- ============================================================================
-- 4. SEED DATA - ROLE FORMS
-- ============================================================================
-- Insert dynamic onboarding form schemas for each role

INSERT INTO role_forms (role_name, form_schema) VALUES
-- Smallholder Farmer Onboarding Form
('smallholder_farmer', '[
  {
    "field": "farm_size",
    "type": "number",
    "label": "Farm size (acres)",
    "label_sw": "Ukubwa wa shamba (ekari)",
    "required": true,
    "min": 0,
    "max": 5,
    "placeholder": "e.g., 2.5"
  },
  {
    "field": "main_crop",
    "type": "select",
    "label": "Main crop",
    "label_sw": "Zao kuu",
    "required": true,
    "options": ["Maize", "Rice", "Beans", "Cassava", "Sweet Potato", "Vegetables", "Fruits"],
    "options_sw": ["Mahindi", "Mchele", "Maharagwe", "Mihogo", "Viazi vitamu", "Mboga", "Matunda"]
  },
  {
    "field": "has_livestock",
    "type": "checkbox",
    "label": "Do you raise livestock?",
    "label_sw": "Je, unafuga mifugo?",
    "required": false
  },
  {
    "field": "livestock_type",
    "type": "multiselect",
    "label": "Livestock type",
    "label_sw": "Aina ya mifugo",
    "required": false,
    "depends_on": "has_livestock",
    "options": ["Cattle", "Goats", "Sheep", "Chickens", "Ducks"],
    "options_sw": ["Ng''ombe", "Mbuzi", "Kondoo", "Kuku", "Bata"]
  },
  {
    "field": "region",
    "type": "select",
    "label": "Region",
    "label_sw": "Mkoa",
    "required": true,
    "options": ["Arusha", "Dar es Salaam", "Dodoma", "Iringa", "Kagera", "Kilimanjaro", "Mbeya", "Morogoro", "Mwanza", "Tanga"]
  },
  {
    "field": "preferred_language",
    "type": "select",
    "label": "Preferred language",
    "label_sw": "Lugha unayopendelea",
    "required": true,
    "options": ["English", "Swahili"],
    "options_sw": ["Kiingereza", "Kiswahili"]
  }
]'),

-- Farmer Onboarding Form
('farmer', '[
  {
    "field": "farm_size",
    "type": "number",
    "label": "Farm size (acres)",
    "label_sw": "Ukubwa wa shamba (ekari)",
    "required": true,
    "min": 5,
    "placeholder": "e.g., 10"
  },
  {
    "field": "num_fields",
    "type": "number",
    "label": "Number of fields",
    "label_sw": "Idadi ya mashamba",
    "required": true,
    "min": 1,
    "placeholder": "e.g., 3"
  },
  {
    "field": "main_crops",
    "type": "multiselect",
    "label": "Main crops (select multiple)",
    "label_sw": "Mazao makuu (chagua mengi)",
    "required": true,
    "options": ["Maize", "Rice", "Beans", "Coffee", "Cotton", "Sunflower", "Tobacco", "Cashew"]
  },
  {
    "field": "has_livestock",
    "type": "checkbox",
    "label": "Do you raise livestock?",
    "label_sw": "Je, unafuga mifugo?",
    "required": false
  },
  {
    "field": "has_irrigation",
    "type": "checkbox",
    "label": "Do you have irrigation system?",
    "label_sw": "Je, una mfumo wa umwagiliaji?",
    "required": false
  },
  {
    "field": "region",
    "type": "select",
    "label": "Region",
    "label_sw": "Mkoa",
    "required": true,
    "options": ["Arusha", "Dar es Salaam", "Dodoma", "Iringa", "Kagera", "Kilimanjaro", "Mbeya", "Morogoro", "Mwanza", "Tanga"]
  },
  {
    "field": "preferred_language",
    "type": "select",
    "label": "Preferred language",
    "label_sw": "Lugha unayopendelea",
    "required": true,
    "options": ["English", "Swahili"]
  }
]'),

-- Farm Manager Onboarding Form
('farm_manager', '[
  {
    "field": "team_size",
    "type": "number",
    "label": "Number of farm workers",
    "label_sw": "Idadi ya wafanyakazi wa shamba",
    "required": true,
    "min": 1,
    "placeholder": "e.g., 15"
  },
  {
    "field": "num_fields",
    "type": "number",
    "label": "Number of fields managed",
    "label_sw": "Idadi ya mashamba unayosimamia",
    "required": true,
    "min": 1,
    "placeholder": "e.g., 5"
  },
  {
    "field": "total_acreage",
    "type": "number",
    "label": "Total acreage managed",
    "label_sw": "Jumla ya ekari unazosimamia",
    "required": true,
    "min": 10,
    "placeholder": "e.g., 100"
  },
  {
    "field": "multi_crop",
    "type": "checkbox",
    "label": "Do you manage multiple crops?",
    "label_sw": "Je, unasimamia mazao mengi?",
    "required": false
  },
  {
    "field": "has_machinery",
    "type": "checkbox",
    "label": "Do you manage farm machinery?",
    "label_sw": "Je, unasimamia mashine za kilimo?",
    "required": false
  },
  {
    "field": "region",
    "type": "select",
    "label": "Region",
    "label_sw": "Mkoa",
    "required": true,
    "options": ["Arusha", "Dar es Salaam", "Dodoma", "Iringa", "Kagera", "Kilimanjaro", "Mbeya", "Morogoro", "Mwanza", "Tanga"]
  },
  {
    "field": "preferred_language",
    "type": "select",
    "label": "Preferred language",
    "label_sw": "Lugha unayopendelea",
    "required": true,
    "options": ["English", "Swahili"]
  }
]'),

-- Commercial Farm Admin Onboarding Form
('commercial_farm_admin', '[
  {
    "field": "company_name",
    "type": "text",
    "label": "Company/Farm name",
    "label_sw": "Jina la kampuni/shamba",
    "required": true,
    "placeholder": "e.g., Green Valley Farms Ltd"
  },
  {
    "field": "total_acreage",
    "type": "number",
    "label": "Total farm acreage",
    "label_sw": "Jumla ya ekari za shamba",
    "required": true,
    "min": 50,
    "placeholder": "e.g., 500"
  },
  {
    "field": "num_employees",
    "type": "number",
    "label": "Number of employees",
    "label_sw": "Idadi ya wafanyakazi",
    "required": true,
    "min": 10,
    "placeholder": "e.g., 50"
  },
  {
    "field": "primary_operations",
    "type": "multiselect",
    "label": "Primary operations",
    "label_sw": "Shughuli kuu",
    "required": true,
    "options": ["Crop Production", "Livestock", "Processing", "Export", "Contract Farming"]
  },
  {
    "field": "export_markets",
    "type": "checkbox",
    "label": "Do you export products?",
    "label_sw": "Je, unasafirisha bidhaa nje?",
    "required": false
  },
  {
    "field": "region",
    "type": "select",
    "label": "Main region of operations",
    "label_sw": "Mkoa mkuu wa shughuli",
    "required": true,
    "options": ["Arusha", "Dar es Salaam", "Dodoma", "Iringa", "Kagera", "Kilimanjaro", "Mbeya", "Morogoro", "Mwanza", "Tanga"]
  },
  {
    "field": "preferred_language",
    "type": "select",
    "label": "Preferred language",
    "label_sw": "Lugha unayopendelea",
    "required": true,
    "options": ["English", "Swahili"]
  }
]'),

-- Agribusiness Operations Onboarding Form
('agribusiness_ops', '[
  {
    "field": "business_name",
    "type": "text",
    "label": "Business name",
    "label_sw": "Jina la biashara",
    "required": true,
    "placeholder": "e.g., Tanzania Agro Supplies"
  },
  {
    "field": "business_type",
    "type": "select",
    "label": "Business type",
    "label_sw": "Aina ya biashara",
    "required": true,
    "options": ["Input Supplier", "Buyer/Aggregator", "Processor", "Exporter", "Distributor"]
  },
  {
    "field": "products_traded",
    "type": "multiselect",
    "label": "Products traded/supplied",
    "label_sw": "Bidhaa zinazouzwa/kusambazwa",
    "required": true,
    "options": ["Seeds", "Fertilizers", "Pesticides", "Machinery", "Grains", "Vegetables", "Fruits", "Livestock"]
  },
  {
    "field": "annual_volume",
    "type": "select",
    "label": "Annual trade volume",
    "label_sw": "Kiasi cha biashara kwa mwaka",
    "required": false,
    "options": ["< 100 tons", "100-500 tons", "500-1000 tons", "> 1000 tons"]
  },
  {
    "field": "operates_regions",
    "type": "multiselect",
    "label": "Operating regions",
    "label_sw": "Mikoa ya shughuli",
    "required": true,
    "options": ["Arusha", "Dar es Salaam", "Dodoma", "Iringa", "Kagera", "Kilimanjaro", "Mbeya", "Morogoro", "Mwanza", "Tanga"]
  },
  {
    "field": "preferred_language",
    "type": "select",
    "label": "Preferred language",
    "label_sw": "Lugha unayopendelea",
    "required": true,
    "options": ["English", "Swahili"]
  }
]'),

-- Extension Officer Onboarding Form
('extension_officer', '[
  {
    "field": "organization_name",
    "type": "text",
    "label": "Organization name",
    "label_sw": "Jina la shirika",
    "required": true,
    "placeholder": "e.g., Ministry of Agriculture"
  },
  {
    "field": "organization_type",
    "type": "select",
    "label": "Organization type",
    "label_sw": "Aina ya shirika",
    "required": true,
    "options": ["Government", "NGO", "Private Sector", "Research Institution", "University"]
  },
  {
    "field": "farmers_served",
    "type": "number",
    "label": "Number of farmers you serve",
    "label_sw": "Idadi ya wakulima unaowahuduamia",
    "required": false,
    "min": 0,
    "placeholder": "e.g., 500"
  },
  {
    "field": "specialization",
    "type": "multiselect",
    "label": "Areas of specialization",
    "label_sw": "Maeneo ya utaalamu",
    "required": true,
    "options": ["Crop Production", "Livestock", "Irrigation", "Soil Management", "Pest Control", "Climate Smart Agriculture"]
  },
  {
    "field": "operates_regions",
    "type": "multiselect",
    "label": "Operating regions",
    "label_sw": "Mikoa ya kazi",
    "required": true,
    "options": ["Arusha", "Dar es Salaam", "Dodoma", "Iringa", "Kagera", "Kilimanjaro", "Mbeya", "Morogoro", "Mwanza", "Tanga"]
  },
  {
    "field": "preferred_language",
    "type": "select",
    "label": "Preferred language",
    "label_sw": "Lugha unayopendelea",
    "required": true,
    "options": ["English", "Swahili"]
  }
]'),

-- Cooperative Leader Onboarding Form
('cooperative_leader', '[
  {
    "field": "cooperative_name",
    "type": "text",
    "label": "Cooperative name",
    "label_sw": "Jina la ushirika",
    "required": true,
    "placeholder": "e.g., Kilimanjaro Coffee Cooperative"
  },
  {
    "field": "num_members",
    "type": "number",
    "label": "Number of members",
    "label_sw": "Idadi ya wanachama",
    "required": true,
    "min": 10,
    "placeholder": "e.g., 200"
  },
  {
    "field": "total_member_acreage",
    "type": "number",
    "label": "Total members'' acreage",
    "label_sw": "Jumla ya ekari za wanachama",
    "required": false,
    "min": 0,
    "placeholder": "e.g., 1000"
  },
  {
    "field": "primary_products",
    "type": "multiselect",
    "label": "Primary products",
    "label_sw": "Bidhaa kuu",
    "required": true,
    "options": ["Coffee", "Tea", "Cotton", "Cashew", "Maize", "Rice", "Dairy", "Livestock"]
  },
  {
    "field": "has_storage",
    "type": "checkbox",
    "label": "Do you have cooperative storage facility?",
    "label_sw": "Je, mna ghala la ushirika?",
    "required": false
  },
  {
    "field": "region",
    "type": "select",
    "label": "Region",
    "label_sw": "Mkoa",
    "required": true,
    "options": ["Arusha", "Dar es Salaam", "Dodoma", "Iringa", "Kagera", "Kilimanjaro", "Mbeya", "Morogoro", "Mwanza", "Tanga"]
  },
  {
    "field": "preferred_language",
    "type": "select",
    "label": "Preferred language",
    "label_sw": "Lugha unayopendelea",
    "required": true,
    "options": ["English", "Swahili"]
  }
]')

ON CONFLICT (role_name) DO UPDATE SET
  form_schema = EXCLUDED.form_schema,
  updated_at = NOW();

-- ============================================================================
-- 5. FUNCTIONS
-- ============================================================================

-- Function to get features for a role
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

-- Function to get form schema for a role
CREATE OR REPLACE FUNCTION get_role_form_schema(p_role_name TEXT)
RETURNS JSONB AS $$
BEGIN
  RETURN (
    SELECT form_schema
    FROM role_forms
    WHERE role_name = p_role_name
  );
END;
$$ LANGUAGE plpgsql;

-- Function to check if role has feature access
CREATE OR REPLACE FUNCTION role_has_feature(p_role_name TEXT, p_feature TEXT)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN (
    SELECT EXISTS (
      SELECT 1
      FROM role_features
      WHERE role_name = p_role_name
        AND features ? p_feature
    )
  );
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- 6. TRIGGERS
-- ============================================================================

-- Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_role_features_updated_at
  BEFORE UPDATE ON role_features
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_role_forms_updated_at
  BEFORE UPDATE ON role_forms
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- END OF MIGRATION
-- ============================================================================
