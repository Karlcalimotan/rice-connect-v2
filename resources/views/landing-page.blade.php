<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Rice Connect v2 - Revolutionizing Rice Supply Chain Logistics</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <script defer src="https://cdn.jsdelivr.net/npm/alpinejs@3.x.x/dist/cdn.min.js"></script>
    <style>
        .gradient-hero {
            background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
        }
        .gradient-accent {
            background: linear-gradient(135deg, #059669 0%, #047857 100%);
        }
        .feature-card {
            transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        .feature-card:hover {
            transform: translateY(-8px);
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
        }
    </style>
</head>
<body class="bg-gray-50">
    <!-- Navigation -->
    <nav class="fixed w-full top-0 z-50 bg-white shadow-md">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="flex justify-between items-center h-16">
                <div class="flex items-center">
                    <h1 class="text-2xl font-bold text-amber-600">Rice Connect</h1>
                    <span class="ml-2 text-sm font-semibold text-gray-600">v2</span>
                </div>
                <div class="hidden md:flex space-x-8">
                    <a href="#problem-solution" class="text-gray-700 hover:text-amber-600 transition">Problem & Solution</a>
                    <a href="#core-features" class="text-gray-700 hover:text-amber-600 transition">Features</a>
                    <a href="#architecture" class="text-gray-700 hover:text-amber-600 transition">Architecture</a>
                    <a href="#insights" class="text-gray-700 hover:text-amber-600 transition">Insights</a>
                </div>
                <button class="bg-amber-600 text-white px-6 py-2 rounded-lg hover:bg-amber-700 transition">
                    Get Started
                </button>
            </div>
        </div>
    </nav>

    <!-- Hero Section -->
    <section class="gradient-hero text-white pt-32 pb-20">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="grid md:grid-cols-2 gap-12 items-center">
                <div>
                    <h1 class="text-5xl md:text-6xl font-bold mb-6 leading-tight">
                        Transform Your Rice Supply Chain
                    </h1>
                    <p class="text-xl text-amber-50 mb-8 leading-relaxed">
                        Rice Connect v2 streamlines farmer-to-retailer logistics with real-time inventory management, intelligent delivery scheduling, and transparent communication—eliminating inefficiencies and empowering every stakeholder in the rice supply chain.
                    </p>
                    <div class="flex flex-col sm:flex-row gap-4">
                        <button class="bg-white text-amber-600 px-8 py-4 rounded-lg font-semibold hover:bg-amber-50 transition text-lg">
                            Join the Pilot Program
                        </button>
                        <button class="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-amber-600 transition text-lg">
                            Request a Demo
                        </button>
                    </div>
                </div>
                <div class="bg-white bg-opacity-10 backdrop-blur-sm rounded-lg p-8 border border-white border-opacity-20">
                    <div class="bg-gray-800 bg-opacity-30 rounded-lg p-6">
                        <svg class="w-full text-white opacity-50" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm0-14c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6-2.69-6-6-6z"/>
                        </svg>
                        <p class="text-center text-white text-sm mt-4 opacity-70">Real-time logistics dashboard</p>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- Problem vs. Solution Section -->
    <section id="problem-solution" class="py-20 bg-white">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="text-center mb-16">
                <h2 class="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                    The Rice Trading Challenge
                </h2>
                <p class="text-xl text-gray-600 max-w-3xl mx-auto">
                    Traditional rice supply chains face critical pain points that impact profitability, efficiency, and trust. Here's how we solve them.
                </p>
            </div>

            <div class="grid md:grid-cols-2 gap-12">
                <!-- Problems -->
                <div>
                    <h3 class="text-2xl font-bold text-red-600 mb-8">Without Rice Connect</h3>
                    
                    <div class="space-y-6">
                        <div class="bg-red-50 border-l-4 border-red-600 p-6 rounded">
                            <h4 class="font-bold text-red-900 mb-2 flex items-center">
                                <svg class="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 20 20">
                                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"/>
                                </svg>
                                Stock Inconsistencies
                            </h4>
                            <p class="text-gray-700">Manual inventory tracking leads to duplicate shipments, over-ordering, and critical stock-outs that disrupt the entire supply chain.</p>
                        </div>

                        <div class="bg-red-50 border-l-4 border-red-600 p-6 rounded">
                            <h4 class="font-bold text-red-900 mb-2 flex items-center">
                                <svg class="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 20 20">
                                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"/>
                                </svg>
                                Delayed Notifications
                            </h4>
                            <p class="text-gray-700">Paper-based and email-driven communication creates delays in delivery scheduling, pickup confirmations, and important updates.</p>
                        </div>

                        <div class="bg-red-50 border-l-4 border-red-600 p-6 rounded">
                            <h4 class="font-bold text-red-900 mb-2 flex items-center">
                                <svg class="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 20 20">
                                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"/>
                                </svg>
                                Missing Receipts
                            </h4>
                            <p class="text-gray-700">Lost or incomplete documentation creates disputes, complicates audits, and undermines trust between farmers, millers, and retailers.</p>
                        </div>

                        <div class="bg-red-50 border-l-4 border-red-600 p-6 rounded">
                            <h4 class="font-bold text-red-900 mb-2 flex items-center">
                                <svg class="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 20 20">
                                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"/>
                                </svg>
                                Inefficient Coordination
                            </h4>
                            <p class="text-gray-700">Lack of visibility across the supply chain results in poor delivery planning, driver mismanagement, and missed deadlines.</p>
                        </div>
                    </div>
                </div>

                <!-- Solutions -->
                <div>
                    <h3 class="text-2xl font-bold text-green-600 mb-8">With Rice Connect v2</h3>
                    
                    <div class="space-y-6">
                        <div class="bg-green-50 border-l-4 border-green-600 p-6 rounded">
                            <h4 class="font-bold text-green-900 mb-2 flex items-center">
                                <svg class="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 20 20">
                                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"/>
                                </svg>
                                Real-Time Inventory Sync
                            </h4>
                            <p class="text-gray-700">Centralized database updates instantly across all modules, ensuring accurate stock levels and preventing order conflicts.</p>
                        </div>

                        <div class="bg-green-50 border-l-4 border-green-600 p-6 rounded">
                            <h4 class="font-bold text-green-900 mb-2 flex items-center">
                                <svg class="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 20 20">
                                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"/>
                                </svg>
                                Instant Notifications
                            </h4>
                            <p class="text-gray-700">Automated push notifications, SMS, and in-app alerts ensure all stakeholders stay informed about deliveries, pickups, and order updates in real-time.</p>
                        </div>

                        <div class="bg-green-50 border-l-4 border-green-600 p-6 rounded">
                            <h4 class="font-bold text-green-900 mb-2 flex items-center">
                                <svg class="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 20 20">
                                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"/>
                                </svg>
                                Digital Receipt Management
                            </h4>
                            <p class="text-gray-700">Automatically generated and stored digital receipts provide complete audit trails, eliminate disputes, and build trust between parties.</p>
                        </div>

                        <div class="bg-green-50 border-l-4 border-green-600 p-6 rounded">
                            <h4 class="font-bold text-green-900 mb-2 flex items-center">
                                <svg class="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 20 20">
                                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"/>
                                </svg>
                                End-to-End Visibility
                            </h4>
                            <p class="text-gray-700">Unified dashboard shows inventory levels, delivery schedules, driver locations, and order status—enabling data-driven coordination across the entire supply chain.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- Core Features Deep-Dive -->
    <section id="core-features" class="py-20 bg-gray-50">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="text-center mb-16">
                <h2 class="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                    Modular Architecture, Unified Platform
                </h2>
                <p class="text-xl text-gray-600 max-w-3xl mx-auto">
                    Each module is purpose-built for its role, yet seamlessly integrated into one powerful system.
                </p>
            </div>

            <div class="grid md:grid-cols-2 gap-8 mb-12">
                <!-- Farmer Module -->
                <div class="feature-card bg-white rounded-lg shadow-lg p-8 border-t-4 border-blue-500">
                    <div class="flex items-center mb-4">
                        <div class="bg-blue-100 rounded-lg p-3 mr-4">
                            <svg class="w-8 h-8 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M10.5 1.5H5.75A2.25 2.25 0 003.5 3.75v12.5A2.25 2.25 0 005.75 18.5h8.5a2.25 2.25 0 002.25-2.25V6.5m-10-4v4m6-4v4m-8 2h12"/>
                            </svg>
                        </div>
                        <h3 class="text-2xl font-bold text-gray-900">Farmer Module</h3>
                    </div>
                    <p class="text-gray-700 mb-6">
                        Empower farmers with tools to manage their harvest, create batches with quality metrics, and track orders from field to mill.
                    </p>
                    <ul class="space-y-3 text-gray-700">
                        <li class="flex items-start">
                            <svg class="w-5 h-5 text-blue-500 mr-3 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"/>
                            </svg>
                            <span><strong>Harvest Management:</strong> Log harvest batches with date, quantity, quality grade, and location data.</span>
                        </li>
                        <li class="flex items-start">
                            <svg class="w-5 h-5 text-blue-500 mr-3 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"/>
                            </svg>
                            <span><strong>Order Tracking:</strong> Monitor buyer interest, accept delivery preferences, and confirm pickup schedules.</span>
                        </li>
                        <li class="flex items-start">
                            <svg class="w-5 h-5 text-blue-500 mr-3 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"/>
                            </svg>
                            <span><strong>Receipt Management:</strong> Receive digital confirmation of delivery and payment status in real-time.</span>
                        </li>
                        <li class="flex items-start">
                            <svg class="w-5 h-5 text-blue-500 mr-3 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"/>
                            </svg>
                            <span><strong>Financial Insights:</strong> Track historical pricing, yield performance, and revenue trends.</span>
                        </li>
                    </ul>
                </div>

                <!-- MillerAdmin Module -->
                <div class="feature-card bg-white rounded-lg shadow-lg p-8 border-t-4 border-purple-500">
                    <div class="flex items-center mb-4">
                        <div class="bg-purple-100 rounded-lg p-3 mr-4">
                            <svg class="w-8 h-8 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z"/>
                            </svg>
                        </div>
                        <h3 class="text-2xl font-bold text-gray-900">MillerAdmin Module</h3>
                    </div>
                    <p class="text-gray-700 mb-6">
                        Give miller administrators complete control over procurement, processing, inventory, and delivery logistics.
                    </p>
                    <ul class="space-y-3 text-gray-700">
                        <li class="flex items-start">
                            <svg class="w-5 h-5 text-purple-500 mr-3 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"/>
                            </svg>
                            <span><strong>Procurement Management:</strong> Browse available harvests, negotiate prices with farmers, and schedule pickups.</span>
                        </li>
                        <li class="flex items-start">
                            <svg class="w-5 h-5 text-purple-500 mr-3 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"/>
                            </svg>
                            <span><strong>Inventory Management:</strong> Track finished rice stock by type, quality, and quantity with real-time updates.</span>
                        </li>
                        <li class="flex items-start">
                            <svg class="w-5 h-5 text-purple-500 mr-3 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"/>
                            </svg>
                            <span><strong>Order Processing:</strong> Create and manage orders for retailers, set delivery schedules, and assign drivers.</span>
                        </li>
                        <li class="flex items-start">
                            <svg class="w-5 h-5 text-purple-500 mr-3 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"/>
                            </svg>
                            <span><strong>Driver Coordination:</strong> Monitor delivery progress, optimize routes, and confirm deliveries.</span>
                        </li>
                    </ul>
                </div>

                <!-- Retailer Module -->
                <div class="feature-card bg-white rounded-lg shadow-lg p-8 border-t-4 border-green-500">
                    <div class="flex items-center mb-4">
                        <div class="bg-green-100 rounded-lg p-3 mr-4">
                            <svg class="w-8 h-8 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 6H6.28l-.31-1.243A1 1 0 005 4H3z"/>
                                <path d="M16 16a2 2 0 11-4 0 2 2 0 014 0zM4 12a2 2 0 11-4 0 2 2 0 014 0z"/>
                            </svg>
                        </div>
                        <h3 class="text-2xl font-bold text-gray-900">Retailer Module</h3>
                    </div>
                    <p class="text-gray-700 mb-6">
                        Enable retailers to discover quality rice, place orders with confidence, and manage inventory seamlessly.
                    </p>
                    <ul class="space-y-3 text-gray-700">
                        <li class="flex items-start">
                            <svg class="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"/>
                            </svg>
                            <span><strong>Product Discovery:</strong> Browse available rice batches with quality grades, pricing, and availability.</span>
                        </li>
                        <li class="flex items-start">
                            <svg class="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"/>
                            </svg>
                            <span><strong>Order Placement:</strong> Create flexible orders with quantity, delivery location, and schedule preferences.</span>
                        </li>
                        <li class="flex items-start">
                            <svg class="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"/>
                            </svg>
                            <span><strong>Delivery Tracking:</strong> Real-time updates on shipment status, driver location, and estimated arrival times.</span>
                        </li>
                        <li class="flex items-start">
                            <svg class="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"/>
                            </svg>
                            <span><strong>Digital Documentation:</strong> Access invoices, receipts, and quality certificates instantly upon delivery.</span>
                        </li>
                    </ul>
                </div>

                <!-- Driver Module -->
                <div class="feature-card bg-white rounded-lg shadow-lg p-8 border-t-4 border-orange-500">
                    <div class="flex items-center mb-4">
                        <div class="bg-orange-100 rounded-lg p-3 mr-4">
                            <svg class="w-8 h-8 text-orange-600" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z"/>
                                <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1V5a1 1 0 00-1-1H3zM14 7a1 1 0 00-1 1v6.05A2.5 2.5 0 0115.95 16H17a1 1 0 001-1v-5a1 1 0 00-.293-.707l-2-2A1 1 0 0015 7h-1z"/>
                            </svg>
                        </div>
                        <h3 class="text-2xl font-bold text-gray-900">Driver Module</h3>
                    </div>
                    <p class="text-gray-700 mb-6">
                        Equip drivers with intuitive tools to navigate routes, confirm deliveries, and communicate with stakeholders.
                    </p>
                    <ul class="space-y-3 text-gray-700">
                        <li class="flex items-start">
                            <svg class="w-5 h-5 text-orange-500 mr-3 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"/>
                            </svg>
                            <span><strong>Route Management:</strong> Receive daily delivery schedules with optimized routes and order details.</span>
                        </li>
                        <li class="flex items-start">
                            <svg class="w-5 h-5 text-orange-500 mr-3 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"/>
                            </svg>
                            <span><strong>GPS Navigation:</strong> Built-in mapping to find delivery locations with turn-by-turn directions.</span>
                        </li>
                        <li class="flex items-start">
                            <svg class="w-5 h-5 text-orange-500 mr-3 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"/>
                            </svg>
                            <span><strong>Delivery Confirmation:</strong> Capture signatures or photos, update order status, and generate receipts on-site.</span>
                        </li>
                        <li class="flex items-start">
                            <svg class="w-5 h-5 text-orange-500 mr-3 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"/>
                            </svg>
                            <span><strong>Real-Time Communication:</strong> Direct messaging with coordinators for issues or status updates.</span>
                        </li>
                    </ul>
                </div>
            </div>

            <!-- Module Interaction -->
            <div class="bg-white rounded-lg shadow-lg p-12">
                <h3 class="text-2xl font-bold text-gray-900 mb-8 text-center">
                    How Modules Work Together
                </h3>
                <div class="space-y-6">
                    <div class="flex items-start">
                        <div class="flex-shrink-0">
                            <div class="bg-gradient-accent text-white rounded-full h-10 w-10 flex items-center justify-center font-bold">1</div>
                        </div>
                        <div class="ml-4">
                            <h4 class="text-lg font-semibold text-gray-900">Farmer lists harvest</h4>
                            <p class="text-gray-700 mt-1">A farmer logs a new harvest batch with quality metrics and location.</p>
                        </div>
                    </div>
                    <div class="flex items-start">
                        <div class="flex-shrink-0">
                            <div class="bg-gradient-accent text-white rounded-full h-10 w-10 flex items-center justify-center font-bold">2</div>
                        </div>
                        <div class="ml-4">
                            <h4 class="text-lg font-semibold text-gray-900">MillerAdmin evaluates and purchases</h4>
                            <p class="text-gray-700 mt-1">Miller sees the harvest, negotiates price, and schedules a pickup via the Driver Module.</p>
                        </div>
                    </div>
                    <div class="flex items-start">
                        <div class="flex-shrink-0">
                            <div class="bg-gradient-accent text-white rounded-full h-10 w-10 flex items-center justify-center font-bold">3</div>
                        </div>
                        <div class="ml-4">
                            <h4 class="text-lg font-semibold text-gray-900">Driver confirms pickup</h4>
                            <p class="text-gray-700 mt-1">Driver receives the route, navigates to the farm, collects rice, and confirms pickup with a digital receipt.</p>
                        </div>
                    </div>
                    <div class="flex items-start">
                        <div class="flex-shrink-0">
                            <div class="bg-gradient-accent text-white rounded-full h-10 w-10 flex items-center justify-center font-bold">4</div>
                        </div>
                        <div class="ml-4">
                            <h4 class="text-lg font-semibold text-gray-900">Inventory updates automatically</h4>
                            <p class="text-gray-700 mt-1">Miller's inventory reflects the finished product, ready for retailer orders.</p>
                        </div>
                    </div>
                    <div class="flex items-start">
                        <div class="flex-shrink-0">
                            <div class="bg-gradient-accent text-white rounded-full h-10 w-10 flex items-center justify-center font-bold">5</div>
                        </div>
                        <div class="ml-4">
                            <h4 class="text-lg font-semibold text-gray-900">Retailer discovers and orders</h4>
                            <p class="text-gray-700 mt-1">Retailer browses available stock, places an order, and tracks delivery in real-time.</p>
                        </div>
                    </div>
                    <div class="flex items-start">
                        <div class="flex-shrink-0">
                            <div class="bg-gradient-accent text-white rounded-full h-10 w-10 flex items-center justify-center font-bold">6</div>
                        </div>
                        <div class="ml-4">
                            <h4 class="text-lg font-semibold text-gray-900">Complete transparency throughout</h4>
                            <p class="text-gray-700 mt-1">All parties have access to status updates, digital receipts, and documentation at every step.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- System Architecture Section -->
    <section id="architecture" class="py-20 bg-white">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="text-center mb-16">
                <h2 class="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                    Built on Modern Technology
                </h2>
                <p class="text-xl text-gray-600 max-w-3xl mx-auto">
                    Rice Connect v2 leverages enterprise-grade technologies for reliability, scalability, and performance.
                </p>
            </div>

            <div class="grid md:grid-cols-2 gap-12">
                <!-- Tech Stack -->
                <div>
                    <h3 class="text-2xl font-bold text-gray-900 mb-8">Technology Stack</h3>
                    
                    <div class="space-y-6">
                        <div class="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-6 border border-blue-200">
                            <h4 class="font-bold text-blue-900 text-lg mb-2">Backend</h4>
                            <p class="text-blue-800 mb-2"><strong>Framework:</strong> Laravel 12</p>
                            <p class="text-blue-800 text-sm">A powerful PHP framework providing robust routing, middleware, authentication, and API development capabilities. Handles all business logic, data processing, and notifications.</p>
                        </div>

                        <div class="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-6 border border-purple-200">
                            <h4 class="font-bold text-purple-900 text-lg mb-2">Frontend</h4>
                            <p class="text-purple-800 mb-2"><strong>Framework:</strong> Inertia.js</p>
                            <p class="text-purple-800 text-sm">A modern approach to building single-page applications without complex SPAs. Provides seamless server-client communication with Vue 3 components for responsive, interactive user interfaces.</p>
                        </div>

                        <div class="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-6 border border-green-200">
                            <h4 class="font-bold text-green-900 text-lg mb-2">Database</h4>
                            <p class="text-green-800 mb-2"><strong>System:</strong> MySQL 8.0+</p>
                            <p class="text-green-800 text-sm">Reliable relational database ensuring data integrity, ACID compliance, and efficient querying. Manages all entities: users, harvests, orders, deliveries, and inventory.</p>
                        </div>

                        <div class="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-6 border border-orange-200">
                            <h4 class="font-bold text-orange-900 text-lg mb-2">Real-Time Communication</h4>
                            <p class="text-orange-800 mb-2"><strong>Broadcast:</strong> WebSockets & Laravel Broadcasting</p>
                            <p class="text-orange-800 text-sm">Enables instant notifications and live updates across the platform. Users receive real-time alerts for order changes, deliveries, and system updates.</p>
                        </div>
                    </div>
                </div>

                <!-- Architecture Benefits -->
                <div>
                    <h3 class="text-2xl font-bold text-gray-900 mb-8">Architecture Advantages</h3>
                    
                    <div class="space-y-4">
                        <div class="flex items-start">
                            <div class="flex-shrink-0">
                                <svg class="w-6 h-6 text-green-600 mt-1" fill="currentColor" viewBox="0 0 20 20">
                                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"/>
                                </svg>
                            </div>
                            <div class="ml-4">
                                <h4 class="text-lg font-semibold text-gray-900">Scalability</h4>
                                <p class="text-gray-700 mt-1">The microservices approach allows each module to scale independently based on demand without affecting others.</p>
                            </div>
                        </div>

                        <div class="flex items-start">
                            <div class="flex-shrink-0">
                                <svg class="w-6 h-6 text-green-600 mt-1" fill="currentColor" viewBox="0 0 20 20">
                                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"/>
                                </svg>
                            </div>
                            <div class="ml-4">
                                <h4 class="text-lg font-semibold text-gray-900">Security</h4>
                                <p class="text-gray-700 mt-1">Built-in authentication, role-based access control (RBAC), and encrypted data transmission protect user information and transactions.</p>
                            </div>
                        </div>

                        <div class="flex items-start">
                            <div class="flex-shrink-0">
                                <svg class="w-6 h-6 text-green-600 mt-1" fill="currentColor" viewBox="0 0 20 20">
                                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"/>
                                </svg>
                            </div>
                            <div class="ml-4">
                                <h4 class="text-lg font-semibold text-gray-900">Performance</h4>
                                <p class="text-gray-700 mt-1">Inertia.js eliminates the performance overhead of traditional SPAs while maintaining a responsive, app-like experience.</p>
                            </div>
                        </div>

                        <div class="flex items-start">
                            <div class="flex-shrink-0">
                                <svg class="w-6 h-6 text-green-600 mt-1" fill="currentColor" viewBox="0 0 20 20">
                                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"/>
                                </svg>
                            </div>
                            <div class="ml-4">
                                <h4 class="text-lg font-semibold text-gray-900">Maintainability</h4>
                                <p class="text-gray-700 mt-1">Laravel's elegant syntax and Inertia's component-based approach make the codebase easy to update and extend as business needs evolve.</p>
                            </div>
                        </div>

                        <div class="flex items-start">
                            <div class="flex-shrink-0">
                                <svg class="w-6 h-6 text-green-600 mt-1" fill="currentColor" viewBox="0 0 20 20">
                                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"/>
                                </svg>
                            </div>
                            <div class="ml-4">
                                <h4 class="text-lg font-semibold text-gray-900">Modularity</h4>
                                <p class="text-gray-700 mt-1">Each role's module is self-contained, allowing for independent deployments and targeted feature updates.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- Data & Insights Section -->
    <section id="insights" class="py-20 bg-gray-50">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="text-center mb-16">
                <h2 class="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                    Data-Driven Insights
                </h2>
                <p class="text-xl text-gray-600 max-w-3xl mx-auto">
                    Rice Connect transforms operational data into actionable insights for smarter decision-making at every level.
                </p>
            </div>

            <div class="grid md:grid-cols-3 gap-8 mb-12">
                <!-- Stock Tracking -->
                <div class="bg-white rounded-lg shadow-lg p-8">
                    <div class="bg-blue-100 rounded-lg p-4 mb-4 h-32 flex items-center justify-center">
                        <svg class="w-16 h-16 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z"/>
                        </svg>
                    </div>
                    <h3 class="text-xl font-bold text-gray-900 mb-3">Stock Level Monitoring</h3>
                    <p class="text-gray-700 mb-4">
                        Real-time dashboards display inventory by rice type, quality grade, and location. Receive automated alerts when stock falls below reorder points.
                    </p>
                    <ul class="text-sm text-gray-600 space-y-2">
                        <li>✓ Inventory forecasting</li>
                        <li>✓ Stock aging analysis</li>
                        <li>✓ Low-stock alerts</li>
                    </ul>
                </div>

                <!-- Delivery Metrics -->
                <div class="bg-white rounded-lg shadow-lg p-8">
                    <div class="bg-green-100 rounded-lg p-4 mb-4 h-32 flex items-center justify-center">
                        <svg class="w-16 h-16 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z"/>
                            <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1V5a1 1 0 00-1-1H3zM14 7a1 1 0 00-1 1v6.05A2.5 2.5 0 0115.95 16H17a1 1 0 001-1v-5a1 1 0 00-.293-.707l-2-2A1 1 0 0015 7h-1z"/>
                        </svg>
                    </div>
                    <h3 class="text-xl font-bold text-gray-900 mb-3">Delivery Performance</h3>
                    <p class="text-gray-700 mb-4">
                        Track on-time delivery rates, average transit times, and driver performance. Identify bottlenecks and optimize routes.
                    </p>
                    <ul class="text-sm text-gray-600 space-y-2">
                        <li>✓ On-time delivery %</li>
                        <li>✓ Route optimization</li>
                        <li>✓ Driver scorecards</li>
                    </ul>
                </div>

                <!-- Financial Insights -->
                <div class="bg-white rounded-lg shadow-lg p-8">
                    <div class="bg-purple-100 rounded-lg p-4 mb-4 h-32 flex items-center justify-center">
                        <svg class="w-16 h-16 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z"/>
                        </svg>
                    </div>
                    <h3 class="text-xl font-bold text-gray-900 mb-3">Financial Analytics</h3>
                    <p class="text-gray-700 mb-4">
                        Monitor revenue by sourcing channel, profit margins per transaction, and cumulative earnings over time.
                    </p>
                    <ul class="text-sm text-gray-600 space-y-2">
                        <li>✓ Revenue tracking</li>
                        <li>✓ Profit margin analysis</li>
                        <li>✓ Payment reconciliation</li>
                    </ul>
                </div>
            </div>

            <!-- Advanced Analytics -->
            <div class="bg-gradient-to-r from-gray-900 to-gray-800 rounded-lg p-12 text-white">
                <h3 class="text-2xl font-bold mb-8">Advanced Analytics Dashboard</h3>
                <div class="grid md:grid-cols-2 gap-12">
                    <div>
                        <h4 class="text-lg font-semibold mb-4">For Miller Administrators</h4>
                        <ul class="space-y-3">
                            <li class="flex items-start">
                                <svg class="w-5 h-5 text-green-400 mr-3 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                    <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"/>
                                </svg>
                                <span><strong>Procurement ROI:</strong> Measure profit margins from each farming partner and adjust purchasing strategy.</span>
                            </li>
                            <li class="flex items-start">
                                <svg class="w-5 h-5 text-green-400 mr-3 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                    <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"/>
                                </svg>
                                <span><strong>Inventory Turnover:</strong> Visualize product age and movement velocity to minimize storage costs.</span>
                            </li>
                            <li class="flex items-start">
                                <svg class="w-5 h-5 text-green-400 mr-3 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                    <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"/>
                                </svg>
                                <span><strong>Retailer Demand Patterns:</strong> Forecast demand trends to optimize procurement and pricing.</span>
                            </li>
                        </ul>
                    </div>
                    <div>
                        <h4 class="text-lg font-semibold mb-4">For Farmers & Retailers</h4>
                        <ul class="space-y-3">
                            <li class="flex items-start">
                                <svg class="w-5 h-5 text-green-400 mr-3 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                    <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"/>
                                </svg>
                                <span><strong>Historical Pricing:</strong> Compare current prices against historical data to make informed decisions.</span>
                            </li>
                            <li class="flex items-start">
                                <svg class="w-5 h-5 text-green-400 mr-3 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                    <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"/>
                                </svg>
                                <span><strong>Quality Insights:</strong> Track product quality performance and customer feedback.</span>
                            </li>
                            <li class="flex items-start">
                                <svg class="w-5 h-5 text-green-400 mr-3 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                    <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"/>
                                </svg>
                                <span><strong>Trend Analysis:</strong> Identify seasonal patterns and market opportunities.</span>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- Call to Action Section -->
    <section class="gradient-hero text-white py-20">
        <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 class="text-4xl md:text-5xl font-bold mb-6">
                Ready to Transform Your Supply Chain?
            </h2>
            <p class="text-xl text-amber-50 mb-8 leading-relaxed">
                Join forward-thinking farmers, millers, and retailers who are already revolutionizing rice distribution. Rice Connect v2 puts control, transparency, and profitability in your hands.
            </p>
            
            <div class="grid md:grid-cols-3 gap-6 mb-12">
                <div class="bg-white bg-opacity-10 backdrop-blur-sm rounded-lg p-6 border border-white border-opacity-20">
                    <h3 class="text-lg font-bold mb-3">Pilot Program</h3>
                    <p class="text-amber-50 text-sm mb-4">Be among the first to use Rice Connect v2. Get dedicated support and influence roadmap priorities.</p>
                    <button class="w-full bg-white text-amber-600 px-6 py-2 rounded-lg font-semibold hover:bg-amber-50 transition">
                        Apply Now
                    </button>
                </div>

                <div class="bg-white bg-opacity-10 backdrop-blur-sm rounded-lg p-6 border border-white border-opacity-20">
                    <h3 class="text-lg font-bold mb-3">Request Demo</h3>
                    <p class="text-amber-50 text-sm mb-4">See Rice Connect v2 in action. Our team will walk you through features tailored to your role.</p>
                    <button class="w-full border-2 border-white text-white px-6 py-2 rounded-lg font-semibold hover:bg-white hover:text-amber-600 transition">
                        Schedule Demo
                    </button>
                </div>

                <div class="bg-white bg-opacity-10 backdrop-blur-sm rounded-lg p-6 border border-white border-opacity-20">
                    <h3 class="text-lg font-bold mb-3">Contact Us</h3>
                    <p class="text-amber-50 text-sm mb-4">Have questions? Our team is ready to discuss how Rice Connect solves your challenges.</p>
                    <button class="w-full border-2 border-white text-white px-6 py-2 rounded-lg font-semibold hover:bg-white hover:text-amber-600 transition">
                        Get in Touch
                    </button>
                </div>
            </div>

            <div class="bg-white bg-opacity-10 backdrop-blur-sm rounded-lg p-8 border border-white border-opacity-20">
                <h3 class="text-2xl font-bold mb-4">What Happens Next?</h3>
                <div class="grid md:grid-cols-3 gap-8 text-left">
                    <div>
                        <div class="text-3xl font-bold mb-2">1</div>
                        <p class="text-amber-50"><strong>Initial Consultation:</strong> We understand your supply chain challenges and goals.</p>
                    </div>
                    <div>
                        <div class="text-3xl font-bold mb-2">2</div>
                        <p class="text-amber-50"><strong>Customized Demo:</strong> See features relevant to your role with live data.</p>
                    </div>
                    <div>
                        <div class="text-3xl font-bold mb-2">3</div>
                        <p class="text-amber-50"><strong>Onboarding:</strong> Seamless setup with dedicated training and support.</p>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- Footer -->
    <footer class="bg-gray-900 text-gray-300 py-12">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="grid md:grid-cols-4 gap-8 mb-8">
                <div>
                    <h4 class="text-white font-bold mb-4">Rice Connect</h4>
                    <p class="text-sm">Transforming rice supply chain logistics with technology and transparency.</p>
                </div>
                <div>
                    <h4 class="text-white font-bold mb-4">Platform</h4>
                    <ul class="text-sm space-y-2">
                        <li><a href="#core-features" class="hover:text-white transition">Features</a></li>
                        <li><a href="#architecture" class="hover:text-white transition">Technology</a></li>
                        <li><a href="#insights" class="hover:text-white transition">Insights</a></li>
                    </ul>
                </div>
                <div>
                    <h4 class="text-white font-bold mb-4">Resources</h4>
                    <ul class="text-sm space-y-2">
                        <li><a href="#" class="hover:text-white transition">Documentation</a></li>
                        <li><a href="#" class="hover:text-white transition">Blog</a></li>
                        <li><a href="#" class="hover:text-white transition">Support</a></li>
                    </ul>
                </div>
                <div>
                    <h4 class="text-white font-bold mb-4">Contact</h4>
                    <ul class="text-sm space-y-2">
                        <li>Email: info@riceconnect.com</li>
                        <li>Phone: +1 (555) 123-4567</li>
                    </ul>
                </div>
            </div>
            <div class="border-t border-gray-800 pt-8 text-center text-sm">
                <p>&copy; 2026 Rice Connect. All rights reserved.</p>
            </div>
        </div>
    </footer>

</body>
</html>
