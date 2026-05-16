<x-miller::layouts.master>
    <div class="p-6">
        <h1 class="text-3xl font-bold mb-8">Miller Dashboard</h1>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Rice Stock Levels Chart -->
            <div class="bg-white rounded-lg shadow p-6">
                <h2 class="text-xl font-semibold mb-4">Rice Stock Levels</h2>
                <canvas id="stockChart"></canvas>
            </div>
            
            <!-- Processing Volume Chart -->
            <div class="bg-white rounded-lg shadow p-6">
                <h2 class="text-xl font-semibold mb-4">Weekly Processing Volume</h2>
                <canvas id="processingChart"></canvas>
            </div>
        </div>
    </div>

    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    <script>
        // Rice Stock Levels Chart
        new Chart(document.getElementById('stockChart'), {
            type: 'doughnut',
            data: {
                labels: ['White Rice', 'Brown Rice', 'Jasmine', 'Parboiled'],
                datasets: [{
                    data: [3000, 2500, 1800, 2200],
                    backgroundColor: [
                        'rgba(255, 193, 7, 0.6)',
                        'rgba(156, 39, 176, 0.6)',
                        'rgba(76, 175, 80, 0.6)',
                        'rgba(244, 67, 54, 0.6)'
                    ],
                    borderColor: [
                        'rgba(255, 193, 7, 1)',
                        'rgba(156, 39, 176, 1)',
                        'rgba(76, 175, 80, 1)',
                        'rgba(244, 67, 54, 1)'
                    ],
                    borderWidth: 2
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'bottom'
                    }
                }
            }
        });

        // Processing Volume Chart
        new Chart(document.getElementById('processingChart'), {
            type: 'bar',
            data: {
                labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
                datasets: [{
                    label: 'Volume Processed (kg)',
                    data: [5600, 6200, 5800, 7100],
                    backgroundColor: 'rgba(156, 39, 176, 0.5)',
                    borderColor: 'rgba(156, 39, 176, 1)',
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
    </script>
</x-miller::layouts.master>
