<x-driver::layouts.master>
    <div class="p-6">
        <h1 class="text-3xl font-bold mb-8">Driver Dashboard</h1>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Deliveries Completed Chart -->
            <div class="bg-white rounded-lg shadow p-6">
                <h2 class="text-xl font-semibold mb-4">Monthly Deliveries</h2>
                <canvas id="deliveriesChart"></canvas>
            </div>
            
            <!-- Delivery Status Chart -->
            <div class="bg-white rounded-lg shadow p-6">
                <h2 class="text-xl font-semibold mb-4">Delivery Status Distribution</h2>
                <canvas id="statusChart"></canvas>
            </div>
        </div>
    </div>

    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    <script>
        // Deliveries Completed Chart
        new Chart(document.getElementById('deliveriesChart'), {
            type: 'line',
            data: {
                labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5'],
                datasets: [{
                    label: 'Completed Deliveries',
                    data: [15, 18, 12, 20, 17],
                    borderColor: 'rgba(33, 150, 243, 1)',
                    backgroundColor: 'rgba(33, 150, 243, 0.1)',
                    borderWidth: 2,
                    fill: true,
                    tension: 0.4,
                    pointRadius: 5,
                    pointBackgroundColor: 'rgba(33, 150, 243, 1)'
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

        // Delivery Status Chart
        new Chart(document.getElementById('statusChart'), {
            type: 'pie',
            data: {
                labels: ['Completed', 'In Progress', 'Scheduled', 'Cancelled'],
                datasets: [{
                    data: [82, 10, 6, 2],
                    backgroundColor: [
                        'rgba(76, 175, 80, 0.6)',
                        'rgba(255, 193, 7, 0.6)',
                        'rgba(33, 150, 243, 0.6)',
                        'rgba(244, 67, 54, 0.6)'
                    ],
                    borderColor: [
                        'rgba(76, 175, 80, 1)',
                        'rgba(255, 193, 7, 1)',
                        'rgba(33, 150, 243, 1)',
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
    </script>
</x-driver::layouts.master>
