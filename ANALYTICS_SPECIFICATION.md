# Rice Connect Analytics Dashboard - Technical Specification

## Overview

This document provides a complete technical specification for the Rice Connect Analytics Dashboard system, which provides role-based data visualizations for Farmers, Millers, Retailers, and Super Admins.

---

## Table of Contents

1. [SQL Database Schema](#sql-database-schema)
2. [Laravel Models](#laravel-models)
3. [API Controllers & Endpoints](#api-controllers--endpoints)
4. [React Components](#react-components)
5. [Implementation Guide](#implementation-guide)
6. [Data Flow](#data-flow)

---

## SQL Database Schema

### 1. farmer_yield_metrics
Tracks crop production performance against targets.

```sql
CREATE TABLE farmer_yield_metrics (
    id BIGINT PRIMARY KEY,
    user_id BIGINT NOT NULL FOREIGN KEY,
    target_yield_kg INT,           -- Target yield in kg
    actual_yield_kg INT,           -- Actual production
    crop_variety VARCHAR(255),     -- Rice variety
    season VARCHAR(50),            -- dry_season, wet_season
    year INT,
    health_score DECIMAL(5,2),     -- 0-100 scale
    health_status VARCHAR(50),     -- good, fair, poor
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    INDEX (user_id, year, season)
);
```

**Metrics Provided:**
- Yield variance (actual vs target)
- Performance percentage
- Crop health trends over time

---

### 2. market_prices
Current and historical market pricing data by region and variety.

```sql
CREATE TABLE market_prices (
    id BIGINT PRIMARY KEY,
    rice_variety VARCHAR(255),     -- White Rice, Brown Rice, Jasmine, etc.
    price_per_kg DECIMAL(10,2),
    market_region VARCHAR(255),    -- Municipality/Province
    price_date DATE,
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    INDEX (rice_variety, price_date)
);
```

**Metrics Provided:**
- Current price
- 30-day average price
- Min/Max price range
- Price trends (up/down)

---

### 3. miller_processing_logs
Tracks milling operations and recovery efficiency.

```sql
CREATE TABLE miller_processing_logs (
    id BIGINT PRIMARY KEY,
    user_id BIGINT NOT NULL FOREIGN KEY,  -- Miller
    input_palay_kg INT,                    -- Input palay
    output_rice_kg INT,                    -- Output milled rice
    husk_waste_kg INT,
    recovery_rate DECIMAL(5,2),            -- Efficiency percentage
    processing_efficiency DECIMAL(5,2),
    processing_start TIMESTAMP,
    processing_end TIMESTAMP,
    status VARCHAR(50),                    -- processing, completed, failed
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    INDEX (user_id, status)
);
```

**Metrics Provided:**
- Recovery rates over time
- Processing efficiency trends
- Batches processed per day
- Total output volume

---

### 4. miller_storage_capacity
Current storage utilization tracking.

```sql
CREATE TABLE miller_storage_capacity (
    id BIGINT PRIMARY KEY,
    user_id BIGINT NOT NULL FOREIGN KEY,
    total_capacity_kg INT,
    current_stock_kg INT DEFAULT 0,
    available_capacity_kg INT DEFAULT 0,
    utilization_rate DECIMAL(5,2),        -- Percentage 0-100
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    UNIQUE (user_id)
);
```

**Metrics Provided:**
- Real-time utilization percentage
- Available capacity
- Status alerts (normal, warning, critical)

---

### 5. milling_queues
Pending and in-progress milling batches.

```sql
CREATE TABLE milling_queues (
    id BIGINT PRIMARY KEY,
    miller_id BIGINT NOT NULL FOREIGN KEY,
    palay_kg INT,
    status VARCHAR(50) DEFAULT 'pending',  -- pending, processing, completed
    priority INT DEFAULT 5,                -- 1-10, 1 highest
    queued_at TIMESTAMP,
    processing_started_at TIMESTAMP,
    completed_at TIMESTAMP,
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    INDEX (miller_id, status)
);
```

**Metrics Provided:**
- Queue depth by status
- Processing time by batch
- Priority distribution

---

### 6. retailer_stock_metrics
Stock performance and turnover tracking.

```sql
CREATE TABLE retailer_stock_metrics (
    id BIGINT PRIMARY KEY,
    user_id BIGINT NOT NULL FOREIGN KEY,
    rice_variety VARCHAR(255),
    stock_units INT,
    units_sold_monthly INT,
    turnover_rate DECIMAL(5,2),            -- Times sold per month
    profit_margin_percentage DECIMAL(5,2),
    cost_per_unit DECIMAL(10,2),
    selling_price_per_unit DECIMAL(10,2),
    metric_date DATE,
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    INDEX (user_id, rice_variety, metric_date)
);
```

**Metrics Provided:**
- Turnover rate by variety
- Profit margins
- Cost vs selling price analysis

---

### 7. consumer_demand_heatmap
Time-based consumer purchase patterns.

```sql
CREATE TABLE consumer_demand_heatmap (
    id BIGINT PRIMARY KEY,
    retailer_id BIGINT NOT NULL FOREIGN KEY,
    rice_variety VARCHAR(255),
    time_slot VARCHAR(50),                 -- morning, afternoon, evening, night
    day_of_week VARCHAR(20),
    demand_count INT,
    avg_quantity_purchased DECIMAL(8,2),
    metric_date DATE,
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    INDEX (retailer_id, day_of_week)
);
```

**Metrics Provided:**
- Demand intensity heatmap (7-day × 4-slot matrix)
- Peak buying times
- Average purchase quantity by time

---

### 8. supply_chain_metrics
High-level supply chain health indicators by region.

```sql
CREATE TABLE supply_chain_metrics (
    id BIGINT PRIMARY KEY,
    region VARCHAR(255),
    total_volume_kg INT,
    farmers_count INT,
    millers_count INT,
    retailers_count INT,
    distribution_bottleneck_score DECIMAL(5,2),  -- 0-100
    bottleneck_type VARCHAR(100),               -- logistics, pricing, quality
    metric_date DATE,
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    INDEX (region, metric_date)
);
```

**Metrics Provided:**
- Total regional volume
- Actor distribution
- Bottleneck identification

---

### 9. regional_distribution_logs
Shipment tracking and delivery performance.

```sql
CREATE TABLE regional_distribution_logs (
    id BIGINT PRIMARY KEY,
    source_region VARCHAR(255),
    destination_region VARCHAR(255),
    volume_kg INT,
    status VARCHAR(50) DEFAULT 'shipped',  -- shipped, in_transit, delivered
    shipped_date TIMESTAMP,
    delivered_date TIMESTAMP,
    delay_hours DECIMAL(10,2) DEFAULT 0,
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    INDEX (source_region, destination_region, shipped_date)
);
```

**Metrics Provided:**
- Volume moved (daily/weekly/monthly/yearly)
- Delivery rates
- Average delay by region
- Bottleneck regions

---

## Laravel Models

All models are located in `app/Models/` directory with proper Eloquent relationships and casting:

- `FarmerYieldMetric.php`
- `MarketPrice.php`
- `MillerProcessingLog.php`
- `MillerStorageCapacity.php`
- `MillingQueue.php`
- `RetailerStockMetric.php`
- `ConsumerDemandHeatmap.php`
- `SupplyChainMetric.php`
- `RegionalDistributionLog.php`

---

## API Controllers & Endpoints

### Base URL
```
/api/analytics
```

### Farmer Analytics Controller
**Location:** `app/Http/Controllers/Api/FarmerAnalyticsController.php`

| Endpoint | Method | Response |
|----------|--------|----------|
| `/analytics/farmer/yield-vs-target` | GET | Array of yield metrics with variance and performance % |
| `/analytics/farmer/crop-health-trends` | GET | Health scores grouped by crop variety over time |
| `/analytics/farmer/market-prices` | GET | Current prices, 30-day avg, min/max, and trend |
| `/analytics/farmer/summary` | GET | Total yield, avg health, varieties count |

**Example Response (yield-vs-target):**
```json
{
    "status": "success",
    "data": [
        {
            "variety": "White Rice",
            "season": "dry_season",
            "year": 2026,
            "target": 5000,
            "actual": 5500,
            "variance": 500,
            "performance": 110.0
        }
    ]
}
```

---

### Miller Analytics Controller
**Location:** `app/Http/Controllers/Api/MillerAnalyticsController.php`

| Endpoint | Method | Response |
|----------|--------|----------|
| `/analytics/miller/processing-efficiency` | GET | Daily efficiency trends with recovery rate and output |
| `/analytics/miller/recovery-rates` | GET | Recovery rate distribution and waste analysis |
| `/analytics/miller/storage-utilization` | GET | Current storage status with capacity and utilization % |
| `/analytics/miller/milling-queue` | GET | Queue summary and top 10 pending batches |
| `/analytics/miller/summary` | GET | Total processed, avg recovery, queued batches |

**Example Response (storage-utilization):**
```json
{
    "status": "success",
    "data": {
        "total_capacity_kg": 100000,
        "current_stock_kg": 75000,
        "available_capacity_kg": 25000,
        "utilization_rate": 75.0,
        "status": "warning"
    }
}
```

---

### Retailer Analytics Controller
**Location:** `app/Http/Controllers/Api/RetailerAnalyticsController.php`

| Endpoint | Method | Response |
|----------|--------|----------|
| `/analytics/retailer/stock-turnover` | GET | Turnover rates by variety with status |
| `/analytics/retailer/demand-heatmap` | GET | Day × Time slot demand matrix with intensity |
| `/analytics/retailer/profit-margins` | GET | Margin %, cost, price, units, total profit by variety |
| `/analytics/retailer/summary` | GET | Avg turnover, total profit, varieties count |

**Example Response (profit-margins):**
```json
{
    "status": "success",
    "data": [
        {
            "variety": "White Rice",
            "margin_percentage": 25.5,
            "cost_per_unit": 400.0,
            "selling_price": 516.0,
            "total_units_sold": 1250,
            "total_profit": 145000.0
        }
    ]
}
```

---

### Admin Analytics Controller
**Location:** `app/Http/Controllers/Api/AdminAnalyticsController.php`

| Endpoint | Method | Response |
|----------|--------|----------|
| `/analytics/admin/supply-chain-overview` | GET | Regional supply chain health with bottleneck scores |
| `/analytics/admin/total-volume-moved` | GET | Volume summary by timeframe + 30-day trend |
| `/analytics/admin/regional-bottlenecks` | GET | Delay analysis and severity by region |
| `/analytics/admin/delivery-performance` | GET | Delivery rates and delays over 60 days |
| `/analytics/admin/summary` | GET | Total volume, regions, actors, avg bottleneck |

**Example Response (supply-chain-overview):**
```json
{
    "status": "success",
    "data": [
        {
            "region": "Bulacan",
            "total_volume_kg": 500000,
            "actors": {
                "farmers": 45,
                "millers": 12,
                "retailers": 89
            },
            "bottleneck_score": 45.5,
            "health": "healthy"
        }
    ]
}
```

---

## React Components

All React components are located in `resources/js/Pages/Analytics/` using **Recharts** for visualizations.

### 1. FarmerDashboard.jsx
**Features:**
- Yield vs Target bar chart with variance tracking
- Crop health trends (line chart per variety)
- Market price comparison (current, 30-day avg, trend)
- Summary KPIs (total yield, avg health, varieties)

**Data Fetched:**
- `GET /api/analytics/farmer/yield-vs-target`
- `GET /api/analytics/farmer/crop-health-trends`
- `GET /api/analytics/farmer/market-prices`
- `GET /api/analytics/farmer/summary`

---

### 2. MillerDashboard.jsx
**Features:**
- Processing efficiency trend (dual-axis chart)
- Recovery rate distribution (pie chart)
- Storage capacity utilization (progress bar with status)
- Milling queue status (summary cards + pending queue list)

**Data Fetched:**
- `GET /api/analytics/miller/processing-efficiency`
- `GET /api/analytics/miller/recovery-rates`
- `GET /api/analytics/miller/storage-utilization`
- `GET /api/analytics/miller/milling-queue`
- `GET /api/analytics/miller/summary`

---

### 3. RetailerDashboard.jsx
**Features:**
- Stock turnover rates by variety (bar chart)
- Consumer demand heatmap (7-day × 4-time-slot table)
- Profit margins by variety (progress bars with detailed breakdown)
- Summary KPIs (avg turnover, total profit, varieties)

**Data Fetched:**
- `GET /api/analytics/retailer/stock-turnover`
- `GET /api/analytics/retailer/demand-heatmap`
- `GET /api/analytics/retailer/profit-margins`
- `GET /api/analytics/retailer/summary`

---

### 4. AdminDashboard.jsx
**Features:**
- Bird's-eye supply chain overview by region
- Total volume moved trend (30-day line chart)
- Regional distribution bottlenecks (table with severity)
- Delivery performance (dual-axis: delivery rate + delay)
- Summary KPIs (total volume, regions, actors, bottleneck score)

**Data Fetched:**
- `GET /api/analytics/admin/supply-chain-overview`
- `GET /api/analytics/admin/total-volume-moved`
- `GET /api/analytics/admin/regional-bottlenecks`
- `GET /api/analytics/admin/delivery-performance`
- `GET /api/analytics/admin/summary`

---

## Implementation Guide

### Step 1: Run Migrations
```bash
php artisan migrate
```

This creates all 9 analytics tables with appropriate indexes.

### Step 2: Verify Models
All models are in `app/Models/` with proper relationships and casting configured.

### Step 3: Test API Endpoints
```bash
# For farmer
curl -H "Authorization: Bearer TOKEN" http://localhost:8000/api/analytics/farmer/summary

# For miller
curl -H "Authorization: Bearer TOKEN" http://localhost:8000/api/analytics/miller/summary

# For retailer
curl -H "Authorization: Bearer TOKEN" http://localhost:8000/api/analytics/retailer/summary

# For admin
curl -H "Authorization: Bearer TOKEN" http://localhost:8000/api/analytics/admin/summary
```

### Step 4: Access React Components
Navigate to the respective analytics dashboards:
- Farmer: `/analytics/farmer`
- Miller: `/analytics/miller`
- Retailer: `/analytics/retailer`
- Admin: `/analytics/admin`

### Step 5: Seed Sample Data (Optional)
Create seeders for each analytics table to populate with sample data for testing.

---

## Data Flow

### Request Flow
```
React Component
    ↓
fetch('/api/analytics/{role}/{metric}')
    ↓
Laravel Route (routes/api.php)
    ↓
API Controller (app/Http/Controllers/Api/{Role}AnalyticsController.php)
    ↓
Eloquent Model Queries with groupBy & sum aggregates
    ↓
Database
    ↓
JSON Response
    ↓
Recharts Component Renders Data
```

### Key Eloquent Query Patterns

#### Aggregation with groupBy
```php
FarmerYieldMetric::where('user_id', $farmer->id)
    ->selectRaw('crop_variety, season, year, 
                 target_yield_kg, actual_yield_kg')
    ->groupBy('crop_variety', 'season', 'year')
    ->get();
```

#### Time-based Aggregation
```php
MillerProcessingLog::selectRaw('
    DATE(processing_end) as date,
    AVG(recovery_rate) as avg_recovery,
    COUNT(*) as batches_processed
')
    ->groupBy('date')
    ->orderBy('date', 'desc')
    ->limit(30)
    ->get();
```

#### Multi-level Grouping
```php
ConsumerDemandHeatmap::selectRaw('
    day_of_week, time_slot,
    SUM(demand_count) as total_demand,
    AVG(avg_quantity_purchased) as avg_quantity
')
    ->groupBy('day_of_week', 'time_slot')
    ->get()
    ->groupBy('day_of_week');
```

---

## Performance Optimization

### Indexes
All primary data tables have indexes on:
- Foreign keys (user_id, miller_id, retailer_id)
- Date/timestamp columns
- Commonly grouped-by columns (role, variety, status)

### Caching Strategy
Consider caching aggregated results:
```php
$data = Cache::remember('farmer_analytics_' . $farmer->id, 
    now()->addHours(1), function() {
        return FarmerYieldMetric::where('user_id', $farmer->id)->get();
    }
);
```

### Query Optimization
- Use `selectRaw()` to compute aggregates at database level
- Limit results with pagination or `limit()` for large datasets
- Use eager loading to prevent N+1 queries

---

## Data Entry Points

### Farmer Yield Metrics
Populated via harvest batch completion events or farmer form submissions.

### Market Prices
Populated by admin bulk import or external market data API integration.

### Miller Processing Logs
Populated automatically when milling batches are marked complete.

### Retailer Stock Metrics
Populated via daily inventory updates or POS system integration.

### Consumer Demand Heatmap
Populated from transaction logs aggregated by time and day.

### Supply Chain Metrics
Calculated daily via scheduled command aggregating regional data.

### Regional Distribution Logs
Populated when shipments are marked as shipped/delivered.

---

## Future Enhancements

1. **Real-time Updates:** WebSocket integration for live metric updates
2. **Predictive Analytics:** ML models for yield forecasting and demand prediction
3. **Alerts & Notifications:** Critical bottleneck alerts, storage capacity warnings
4. **Custom Reports:** User-defined report builder for complex queries
5. **Data Export:** CSV/PDF export functionality for reporting
6. **Mobile Dashboard:** React Native mobile app version
7. **Third-party Integrations:** Connect to weather, soil, and commodity data APIs

---

## Support & Documentation

For questions or issues:
1. Check the API responses for error messages
2. Verify database migrations completed successfully
3. Ensure authentication tokens are valid
4. Check browser console for React component errors
5. Review Laravel logs in `storage/logs/laravel.log`

---

**Generated:** May 15, 2026  
**Version:** 1.0  
**System:** Rice Connect v2 Analytics Dashboard
