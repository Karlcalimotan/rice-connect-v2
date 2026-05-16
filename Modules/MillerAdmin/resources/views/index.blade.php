<x-milleradmin::layouts.master>
    <div class="p-6">
        <h1 class="text-3xl font-bold mb-8">Miller Admin Dashboard</h1>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Overall Production Chart -->
            <div class="bg-white rounded-lg shadow p-6">
                <h2 class="text-xl font-semibold mb-4">Total Production (Monthly)</h2>
                <canvas id="productionChart"></canvas>
            </div>
            
            <!-- Miller Performance Chart -->
            <div class="bg-white rounded-lg shadow p-6">
                <h2 class="text-xl font-semibold mb-4">Miller Performance Comparison</h2>
                <canvas id="performanceChart"></canvas>
            </div>
        </div>
    </div>

    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    <script>
        // Overall Production Chart
        new Chart(document.getElementById('productionChart'), {
            type: 'line',
            data: {
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                datasets: [{
                    label: 'Total Output (tons)',
                    data: [145, 152, 148, 165, 158, 172],
                    borderColor: 'rgba(103, 58, 183, 1)',
                    backgroundColor: 'rgba(103, 58, 183, 0.1)',
                    borderWidth: 2,
                    fill: true,
                    tension: 0.4,
                    pointRadius: 5,
                    pointBackgroundColor: 'rgba(103, 58, 183, 1)'
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

        // Miller Performance Chart
        new Chart(document.getElementById('performanceChart'), {
            type: 'radar',
            data: {
                labels: ['Efficiency', 'Quality', 'Output', 'Reliability', 'Compliance'],
                datasets: [{
                    label: 'Miller A',
                    data: [92, 88, 85, 90, 87],
                    borderColor: 'rgba(244, 67, 54, 1)',
                    backgroundColor: 'rgba(244, 67, 54, 0.25)',
                    borderWidth: 2
                }, {
                    label: 'Miller B',
                    data: [85, 92, 88, 86, 91],
                    borderColor: 'rgba(76, 175, 80, 1)',
                    backgroundColor: 'rgba(76, 175, 80, 0.25)',
                    borderWidth: 2
                }, {
                    label: 'Miller C',
                    data: [88, 85, 92, 89, 85],
                    borderColor: 'rgba(33, 150, 243, 1)',
                    backgroundColor: 'rgba(33, 150, 243, 0.25)',
                    borderWidth: 2
                }]
            },
            options: {
                responsive: true,
                scales: {
                    r: {
                        beginAtZero: true,
                        max: 100
                    }
                }
            }
        });
    </script>
</x-milleradmin::layouts.master>
