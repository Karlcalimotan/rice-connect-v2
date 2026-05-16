<x-retailer::layouts.master>
    <div class="p-6">
        <h1 class="text-3xl font-bold mb-8">Retailer Dashboard</h1>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Sales Revenue Chart -->
            <div class="bg-white rounded-lg shadow p-6">
                <h2 class="text-xl font-semibold mb-4">Monthly Sales Revenue</h2>
                <canvas id="salesChart"></canvas>
            </div>
            
            <!-- Top Selling Products Chart -->
            <div class="bg-white rounded-lg shadow p-6">
                <h2 class="text-xl font-semibold mb-4">Top Selling Products</h2>
                <canvas id="productsChart"></canvas>
            </div>
        </div>
    </div>

    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    <script>
        // Sales Revenue Chart
        new Chart(document.getElementById('salesChart'), {
            type: 'bar',
            data: {
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                datasets: [{
                    label: 'Revenue (₱)',
                    data: [45000, 52000, 48000, 61000, 55000, 67000],
                    backgroundColor: 'rgba(76, 175, 80, 0.5)',
                    borderColor: 'rgba(76, 175, 80, 1)',
                    borderWidth: 2
                }]
            },
            options: {
                responsive: true,
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });

        // Top Selling Products Chart
        new Chart(document.getElementById('productsChart'), {
            type: 'horizontalBar',
            data: {
                labels: ['White Rice 25kg', 'Brown Rice 10kg', 'Jasmine Rice 5kg', 'Parboiled 25kg'],
                datasets: [{
                    label: 'Units Sold',
                    data: [234, 189, 156, 142],
                    backgroundColor: 'rgba(233, 30, 99, 0.5)',
                    borderColor: 'rgba(233, 30, 99, 1)',
                    borderWidth: 2
                }]
            },
            options: {
                indexAxis: 'y',
                responsive: true,
                scales: {
                    x: {
                        beginAtZero: true
                    }
                }
            }
        });
    </script>
</x-retailer::layouts.master>
