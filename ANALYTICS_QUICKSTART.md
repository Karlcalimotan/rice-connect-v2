# Analytics Dashboard - Quick Start Guide

## What Was Built

A comprehensive **role-based analytics dashboard** for Rice Connect with real-time data visualization for:
- **Farmers** - Yield tracking, crop health, market prices
- **Millers** - Processing efficiency, recovery rates, storage, queues
- **Retailers** - Stock turnover, consumer demand heatmap, profit margins
- **Super Admin** - Supply chain overview, volume tracking, bottleneck detection

---

## Quick Setup

### 1. Run Database Migrations
```bash
php artisan migrate
```
This creates 9 analytics tables with proper indexes and relationships.

### 2. Files Created

**Models** (9 new Eloquent models):
- `app/Models/FarmerYieldMetric.php`
- `app/Models/MarketPrice.php`
- `app/Models/MillerProcessingLog.php`
- `app/Models/MillerStorageCapacity.php`
- `app/Models/MillingQueue.php`
- `app/Models/RetailerStockMetric.php`
- `app/Models/ConsumerDemandHeatmap.php`
- `app/Models/SupplyChainMetric.php`
- `app/Models/RegionalDistributionLog.php`

**Controllers** (4 API controllers with 16 endpoints):
- `app/Http/Controllers/Api/FarmerAnalyticsController.php` (4 endpoints)
- `app/Http/Controllers/Api/MillerAnalyticsController.php` (5 endpoints)
- `app/Http/Controllers/Api/RetailerAnalyticsController.php` (4 endpoints)
- `app/Http/Controllers/Api/AdminAnalyticsController.php` (5 endpoints)

**React Components** (4 Recharts-based dashboards):
- `resources/js/Pages/Analytics/FarmerDashboard.jsx`
- `resources/js/Pages/Analytics/MillerDashboard.jsx`
- `resources/js/Pages/Analytics/RetailerDashboard.jsx`
- `resources/js/Pages/Analytics/AdminDashboard.jsx`

**Documentation**:
- `ANALYTICS_SPECIFICATION.md` (Complete technical spec)

---

## API Endpoints

### Farmer Analytics
```
GET /api/analytics/farmer/yield-vs-target
GET /api/analytics/farmer/crop-health-trends
GET /api/analytics/farmer/market-prices
GET /api/analytics/farmer/summary
```

### Miller Analytics
```
GET /api/analytics/miller/processing-efficiency
GET /api/analytics/miller/recovery-rates
GET /api/analytics/miller/storage-utilization
GET /api/analytics/miller/milling-queue
GET /api/analytics/miller/summary
```

### Retailer Analytics
```
GET /api/analytics/retailer/stock-turnover
GET /api/analytics/retailer/demand-heatmap
GET /api/analytics/retailer/profit-margins
GET /api/analytics/retailer/summary
```

### Admin Analytics
```
GET /api/analytics/admin/supply-chain-overview
GET /api/analytics/admin/total-volume-moved
GET /api/analytics/admin/regional-bottlenecks
GET /api/analytics/admin/delivery-performance
GET /api/analytics/admin/summary
```

---

## Component Features

### Farmer Dashboard
✅ Yield vs Target (bar chart)  
✅ Crop health trends (line chart per variety)  
✅ Market price comparison (current, 30-day avg, min/max)  
✅ Summary KPIs

### Miller Dashboard
✅ Processing efficiency trend (dual-axis line chart)  
✅ Recovery rate distribution (pie chart)  
✅ Storage capacity utilization (progress bar + status)  
✅ Milling queue status (cards + pending list)  
✅ Summary KPIs

### Retailer Dashboard
✅ Stock turnover by variety (bar chart)  
✅ Consumer demand heatmap (7-day × 4-slot table)  
✅ Profit margins by variety (progress bars)  
✅ Summary KPIs

### Admin Dashboard
✅ Regional supply chain health (cards + bottleneck scores)  
✅ Total volume moved trend (30-day line chart)  
✅ Regional bottlenecks (detailed table with severity)  
✅ Delivery performance (dual-axis: rate + delay)  
✅ Summary KPIs

---

## Key Eloquent Patterns Used

### Aggregation
```php
Model::selectRaw('crop_variety, AVG(yield) as avg_yield')
    ->groupBy('crop_variety')
    ->get();
```

### Time-based Grouping
```php
Model::selectRaw('DATE(created_at) as date, SUM(volume) as total')
    ->groupBy('date')
    ->orderBy('date', 'desc')
    ->get();
```

### Multi-level Grouping
```php
Model::selectRaw('day_of_week, time_slot, COUNT(*) as count')
    ->groupBy('day_of_week', 'time_slot')
    ->get()
    ->groupBy('day_of_week');
```

---

## Database Schema Highlights

| Table | Purpose | Key Fields |
|-------|---------|-----------|
| farmer_yield_metrics | Yield tracking | target_yield_kg, actual_yield_kg, health_score |
| market_prices | Price data | rice_variety, price_per_kg, market_region, price_date |
| miller_processing_logs | Milling efficiency | input_palay_kg, output_rice_kg, recovery_rate, husk_waste_kg |
| miller_storage_capacity | Storage tracking | total_capacity_kg, current_stock_kg, utilization_rate |
| milling_queues | Processing queue | palay_kg, status, priority, hours_waiting |
| retailer_stock_metrics | Stock performance | turnover_rate, profit_margin_percentage, cost_per_unit |
| consumer_demand_heatmap | Purchase patterns | time_slot, day_of_week, demand_count, avg_quantity |
| supply_chain_metrics | Regional health | total_volume_kg, distribution_bottleneck_score |
| regional_distribution_logs | Shipment tracking | volume_kg, status, delay_hours |

---

## Testing the API

```bash
# Get farmer analytics summary
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:8000/api/analytics/farmer/summary

# Get miller storage utilization
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:8000/api/analytics/miller/storage-utilization

# Get retailer profit margins
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:8000/api/analytics/retailer/profit-margins

# Get admin supply chain overview
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:8000/api/analytics/admin/supply-chain-overview
```

---

## Sample Data Structure

### Farmer Yield vs Target Response
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

### Miller Storage Utilization Response
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

### Retailer Profit Margins Response
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

## Performance Optimization Tips

1. **Database Indexes** - All tables have indexes on foreign keys and commonly grouped columns
2. **Caching** - Wrap aggregated queries with `Cache::remember()` for 1+ hours
3. **Pagination** - Add pagination for large datasets using `paginate(50)`
4. **Selective Loading** - Use `selectRaw()` to compute aggregates at DB level
5. **Limit Results** - Use `limit()` for time-series data (last 30 days, etc.)

---

## Common Use Cases

### Farmer wants to know if they're meeting targets
→ Visit Farmer Dashboard → Check "Yield vs Target Performance" chart

### Miller needs to optimize recovery rates
→ Visit Miller Dashboard → Check "Recovery Rate Distribution" pie chart and recovery rate trends

### Retailer wants to identify peak buying times
→ Visit Retailer Dashboard → Check "Consumer Demand Heatmap" table

### Admin needs to find supply chain bottlenecks
→ Visit Admin Dashboard → Check "Regional Distribution Bottlenecks" table sorted by delay

---

## Next Steps

1. ✅ Seed sample analytics data into the tables
2. ✅ Add role-based middleware to controllers
3. ✅ Create scheduled commands to aggregate daily metrics
4. ✅ Integrate with existing order/harvest/delivery systems
5. ✅ Add real-time WebSocket updates
6. ✅ Create data export (CSV/PDF) functionality
7. ✅ Add alert system for critical bottlenecks
8. ✅ Mobile dashboard with React Native

---

## Support Resources

- See `ANALYTICS_SPECIFICATION.md` for complete technical documentation
- Check Laravel logs: `storage/logs/laravel.log`
- Verify migrations: `php artisan migrate:status`
- Test routes: `php artisan route:list | grep analytics`

---

**Setup Complete!** 🎉

Your Analytics Dashboard is ready to power Rice Connect with data-driven insights across all roles.
