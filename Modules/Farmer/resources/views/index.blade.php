<x-farmer::layouts.master>
    <div class="p-6">
        <h1 class="text-3xl font-bold mb-8">Farmer Dashboard</h1>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Harvest Production Chart -->
            <div class="bg-white rounded-lg shadow p-6">
                <h2 class="text-xl font-semibold mb-4">Monthly Harvest Production</h2>
                <canvas id="harvestChart"></canvas>
            </div>
            
            <!-- Yield Trends Chart -->
            <div class="bg-white rounded-lg shadow p-6">
                <h2 class="text-xl font-semibold mb-4">Yield Trends (Last 6 Months)</h2>
                <canvas id="yieldChart"></canvas>
            </div>
        </div>
    </div>

    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    <script>
        // Harvest Production Chart
        new Chart(document.getElementById('harvestChart'), {
            type: 'bar',
            data: {
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                datasets: [{
                    label: 'Production (kg)',
                    data: [2400, 2210, 2290, 2000, 2181, 2500],
                    backgroundColor: 'rgba(34, 197, 94, 0.5)',
                    borderColor: 'rgba(34, 197, 94, 1)',
                    borderWidth: 2
                }]
            },
            options: {
                responsive: true,
                scales: {
                    y: {
                        beginAtZero: true,
                        title: { display: true, text: 'kg' }
                    }
                }
            }
        });

        // Yield Trends Chart
        new Chart(document.getElementById('yieldChart'), {
            type: 'line',
            data: {
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                datasets: [{
                    label: 'Yield (kg/hectare)',
                    data: [6500, 5900, 8000, 8100, 7900, 8500],
                    borderColor: 'rgba(59, 130, 246, 1)',
                    backgroundColor: 'rgba(59, 130, 246, 0.1)',
                    borderWidth: 2,
                    fill: true,
                    tension: 0.4
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
    </script>
</x-farmer::layouts.master>
