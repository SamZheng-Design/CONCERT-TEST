import { Hono } from 'hono'
import { serveStatic } from 'hono/cloudflare-pages'

const app = new Hono()

// Serve static files
app.use('/static/*', serveStatic())

// Main page - Concert Budget Calculator
app.get('/', (c) => {
  return c.html(`<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Cardi B 演唱会项目测算</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
    <style>
        :root {
            --primary-green: #22c55e;
            --primary-green-dark: #16a34a;
            --bg-light: #f8fafc;
            --card-bg: #ffffff;
            --text-dark: #1f2937;
            --text-gray: #6b7280;
            --border-color: #e5e7eb;
        }
        
        * { box-sizing: border-box; }
        
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            background: linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 50%, #f0fdfa 100%);
            min-height: 100vh;
        }
        
        .card {
            background: white;
            border-radius: 12px;
            box-shadow: 0 1px 3px rgba(0,0,0,0.1);
            padding: 20px;
            margin-bottom: 20px;
        }
        
        .card-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-bottom: 16px;
            padding-bottom: 12px;
            border-bottom: 1px solid #e5e7eb;
        }
        
        .card-title {
            display: flex;
            align-items: center;
            gap: 10px;
            font-size: 18px;
            font-weight: 600;
            color: #1f2937;
        }
        
        .card-title i {
            color: #22c55e;
        }
        
        .btn {
            padding: 8px 16px;
            border-radius: 8px;
            font-size: 14px;
            font-weight: 500;
            cursor: pointer;
            transition: all 0.2s;
            border: none;
            display: inline-flex;
            align-items: center;
            gap: 6px;
        }
        
        .btn-primary {
            background: #22c55e;
            color: white;
        }
        
        .btn-primary:hover {
            background: #16a34a;
        }
        
        .btn-secondary {
            background: #f3f4f6;
            color: #374151;
        }
        
        .btn-secondary:hover {
            background: #e5e7eb;
        }
        
        .btn-outline {
            background: transparent;
            border: 1px solid #d1d5db;
            color: #6b7280;
        }
        
        .btn-outline:hover {
            background: #f3f4f6;
        }
        
        .input-field {
            width: 100%;
            padding: 8px 12px;
            border: 1px solid #d1d5db;
            border-radius: 6px;
            font-size: 14px;
            transition: border-color 0.2s, box-shadow 0.2s;
        }
        
        .input-field:focus {
            outline: none;
            border-color: #22c55e;
            box-shadow: 0 0 0 3px rgba(34, 197, 94, 0.1);
        }
        
        .stat-card {
            background: white;
            border-radius: 12px;
            padding: 20px;
            text-align: left;
        }
        
        .stat-label {
            font-size: 14px;
            color: #6b7280;
            margin-bottom: 4px;
            display: flex;
            align-items: center;
            gap: 8px;
        }
        
        .stat-value {
            font-size: 28px;
            font-weight: 700;
            color: #1f2937;
        }
        
        .stat-sub {
            font-size: 12px;
            color: #9ca3af;
            margin-top: 4px;
        }
        
        .venue-card {
            border: 1px solid #e5e7eb;
            border-radius: 10px;
            padding: 16px;
            margin-bottom: 16px;
            background: #fafafa;
        }
        
        .venue-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 12px;
            padding-bottom: 12px;
            border-bottom: 1px solid #e5e7eb;
        }
        
        .venue-name {
            font-weight: 600;
            color: #1f2937;
            display: flex;
            align-items: center;
            gap: 8px;
        }
        
        .venue-stats {
            display: flex;
            gap: 20px;
            align-items: center;
        }
        
        .venue-stat {
            text-align: center;
        }
        
        .venue-stat-label {
            font-size: 12px;
            color: #6b7280;
        }
        
        .venue-stat-value {
            font-size: 16px;
            font-weight: 600;
            color: #22c55e;
        }
        
        .ticket-table {
            width: 100%;
            border-collapse: collapse;
            font-size: 14px;
        }
        
        .ticket-table th {
            text-align: left;
            padding: 8px 12px;
            color: #6b7280;
            font-weight: 500;
            font-size: 12px;
            border-bottom: 1px solid #e5e7eb;
        }
        
        .ticket-table td {
            padding: 8px 12px;
            border-bottom: 1px solid #f3f4f6;
        }
        
        .ticket-table tr:hover {
            background: #f9fafb;
        }
        
        .amount-green {
            color: #22c55e;
            font-weight: 600;
        }
        
        .amount-red {
            color: #ef4444;
            font-weight: 600;
        }
        
        .delete-btn {
            color: #9ca3af;
            cursor: pointer;
            transition: color 0.2s;
        }
        
        .delete-btn:hover {
            color: #ef4444;
        }
        
        .cost-category {
            border: 1px solid #e5e7eb;
            border-radius: 8px;
            margin-bottom: 12px;
            overflow: hidden;
        }
        
        .cost-category-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 14px 16px;
            background: #f9fafb;
            cursor: pointer;
            transition: background 0.2s;
        }
        
        .cost-category-header:hover {
            background: #f3f4f6;
        }
        
        .cost-category-title {
            display: flex;
            align-items: center;
            gap: 10px;
            font-weight: 500;
        }
        
        .cost-category-title i {
            color: #22c55e;
            width: 20px;
        }
        
        .cost-category-amount {
            font-weight: 600;
            color: #22c55e;
        }
        
        .cost-details {
            padding: 12px 16px;
            background: white;
            display: none;
        }
        
        .cost-details.expanded {
            display: block;
        }
        
        .detail-row {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 8px 0;
            border-bottom: 1px solid #f3f4f6;
        }
        
        .detail-row:last-child {
            border-bottom: none;
        }
        
        .sponsorship-card {
            background: #f9fafb;
            border-radius: 8px;
            padding: 20px;
            text-align: center;
            border: 1px dashed #d1d5db;
        }
        
        .sponsorship-card.has-value {
            border-style: solid;
            border-color: #22c55e;
            background: #f0fdf4;
        }
        
        .sponsorship-label {
            font-size: 13px;
            color: #6b7280;
            margin-bottom: 8px;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 6px;
        }
        
        .sponsorship-value {
            font-size: 20px;
            font-weight: 600;
            color: #1f2937;
        }
        
        .investor-card {
            border-radius: 10px;
            padding: 20px;
            position: relative;
        }
        
        .investor-card.senior {
            background: linear-gradient(135deg, #fef9c3 0%, #fef08a 100%);
            border: 2px solid #eab308;
        }
        
        .investor-card.junior {
            background: linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%);
            border: 2px solid #22c55e;
        }
        
        .investor-badge {
            position: absolute;
            top: -10px;
            left: 20px;
            background: white;
            padding: 4px 12px;
            border-radius: 20px;
            font-size: 12px;
            font-weight: 600;
            display: flex;
            align-items: center;
            gap: 6px;
        }
        
        .investor-badge.senior {
            color: #ca8a04;
            border: 2px solid #eab308;
        }
        
        .investor-badge.junior {
            color: #16a34a;
            border: 2px solid #22c55e;
        }
        
        .progress-bar {
            height: 40px;
            background: #e5e7eb;
            border-radius: 8px;
            overflow: hidden;
            display: flex;
        }
        
        .progress-segment {
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-weight: 500;
            font-size: 13px;
        }
        
        .progress-segment.senior {
            background: linear-gradient(90deg, #eab308, #fbbf24);
        }
        
        .progress-segment.junior {
            background: linear-gradient(90deg, #22c55e, #4ade80);
        }
        
        .slider-container {
            padding: 20px 0;
        }
        
        .slider {
            width: 100%;
            height: 8px;
            -webkit-appearance: none;
            appearance: none;
            background: #e5e7eb;
            border-radius: 4px;
            outline: none;
        }
        
        .slider::-webkit-slider-thumb {
            -webkit-appearance: none;
            appearance: none;
            width: 20px;
            height: 20px;
            background: #22c55e;
            border-radius: 50%;
            cursor: pointer;
            box-shadow: 0 2px 6px rgba(34, 197, 94, 0.4);
        }
        
        .chart-container {
            position: relative;
            height: 350px;
            width: 100%;
        }
        
        .tab-container {
            display: flex;
            gap: 0;
            margin-bottom: 20px;
        }
        
        .tab {
            flex: 1;
            padding: 14px 20px;
            text-align: center;
            cursor: pointer;
            font-weight: 500;
            transition: all 0.2s;
            border: none;
            background: #f3f4f6;
        }
        
        .tab:first-child {
            border-radius: 8px 0 0 8px;
        }
        
        .tab:last-child {
            border-radius: 0 8px 8px 0;
        }
        
        .tab.active {
            background: #22c55e;
            color: white;
        }
        
        .tab:not(.active):hover {
            background: #e5e7eb;
        }
        
        .summary-row {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 12px 0;
            border-bottom: 1px solid #f3f4f6;
        }
        
        .summary-row:last-child {
            border-bottom: none;
        }
        
        .summary-label {
            color: #6b7280;
        }
        
        .summary-value {
            font-weight: 600;
        }
        
        .tooltip {
            position: relative;
        }
        
        .tooltip::after {
            content: attr(data-tooltip);
            position: absolute;
            bottom: 100%;
            left: 50%;
            transform: translateX(-50%);
            background: #1f2937;
            color: white;
            padding: 6px 12px;
            border-radius: 6px;
            font-size: 12px;
            white-space: nowrap;
            opacity: 0;
            visibility: hidden;
            transition: all 0.2s;
        }
        
        .tooltip:hover::after {
            opacity: 1;
            visibility: visible;
        }
        
        .grid-2 {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 20px;
        }
        
        @media (max-width: 1024px) {
            .grid-2 {
                grid-template-columns: 1fr;
            }
        }
        
        .modal {
            display: none;
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0,0,0,0.5);
            z-index: 1000;
            align-items: center;
            justify-content: center;
        }
        
        .modal.active {
            display: flex;
        }
        
        .modal-content {
            background: white;
            border-radius: 12px;
            padding: 24px;
            max-width: 500px;
            width: 90%;
            max-height: 80vh;
            overflow-y: auto;
        }
        
        .modal-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 20px;
        }
        
        .modal-title {
            font-size: 18px;
            font-weight: 600;
        }
        
        .modal-close {
            background: none;
            border: none;
            font-size: 24px;
            cursor: pointer;
            color: #9ca3af;
        }
        
        .form-group {
            margin-bottom: 16px;
        }
        
        .form-label {
            display: block;
            font-size: 14px;
            font-weight: 500;
            color: #374151;
            margin-bottom: 6px;
        }
        
        .chart-legend {
            display: flex;
            justify-content: center;
            gap: 20px;
            margin-top: 10px;
            flex-wrap: wrap;
        }
        
        .legend-item {
            display: flex;
            align-items: center;
            gap: 6px;
            font-size: 13px;
        }
        
        .legend-dot {
            width: 12px;
            height: 12px;
            border-radius: 50%;
        }
        
        .analysis-info {
            background: #fef3c7;
            border: 1px solid #fcd34d;
            border-radius: 8px;
            padding: 12px 16px;
            margin-top: 16px;
            font-size: 13px;
            color: #92400e;
        }
        
        .analysis-info i {
            margin-right: 8px;
        }
    </style>
</head>
<body>
    <div class="max-w-7xl mx-auto px-4 py-6">
        <!-- Header -->
        <div class="flex justify-between items-center mb-6">
            <div>
                <h1 class="text-2xl font-bold text-gray-800 flex items-center gap-3">
                    <i class="fas fa-music text-green-500"></i>
                    Cardi B 深圳演唱会项目测算
                </h1>
                <p class="text-gray-500 text-sm mt-1">专业级财务预测与投资分析系统</p>
            </div>
            <div class="flex gap-3">
                <button class="btn btn-outline" onclick="exportData()">
                    <i class="fas fa-download"></i> 导出数据
                </button>
                <button class="btn btn-primary" onclick="saveData()">
                    <i class="fas fa-save"></i> 保存
                </button>
            </div>
        </div>

        <!-- Overview Stats -->
        <div class="grid grid-cols-4 gap-4 mb-6" id="overview-stats">
            <!-- Stats will be populated by JS -->
        </div>

        <!-- Main Content Grid -->
        <div class="grid-2">
            <!-- Left Column -->
            <div>
                <!-- Ticket Sections -->
                <div class="card" id="ticket-section">
                    <div class="card-header">
                        <div class="card-title">
                            <i class="fas fa-ticket-alt"></i>
                            票务区域设置 Ticket Sections
                        </div>
                        <div class="flex gap-2">
                            <button class="btn btn-outline" onclick="showTicketChart()">
                                <i class="fas fa-chart-pie"></i> 图表
                            </button>
                            <button class="btn btn-primary" onclick="addVenue()">
                                <i class="fas fa-plus"></i> 添加场地
                            </button>
                        </div>
                    </div>
                    <div id="venues-container">
                        <!-- Venues will be populated by JS -->
                    </div>
                    <div id="venues-total" class="mt-4 p-4 bg-green-50 rounded-lg">
                        <!-- Total will be populated by JS -->
                    </div>
                </div>
            </div>

            <!-- Right Column -->
            <div>
                <!-- Cost Structure -->
                <div class="card" id="cost-section">
                    <div class="card-header">
                        <div class="card-title">
                            <i class="fas fa-calculator"></i>
                            成本结构 Cost Structure
                            <span class="text-gray-400 text-sm font-normal">(点击展开)</span>
                        </div>
                        <div class="flex gap-2">
                            <button class="btn btn-outline" onclick="showCostChart()">
                                <i class="fas fa-chart-pie"></i> 图表
                            </button>
                            <button class="btn btn-primary" onclick="addCostCategory()">
                                <i class="fas fa-plus"></i> 添加分类
                            </button>
                        </div>
                    </div>
                    <div id="cost-container">
                        <!-- Costs will be populated by JS -->
                    </div>
                    <div id="cost-total" class="mt-4 p-4 bg-gray-50 rounded-lg border">
                        <!-- Total will be populated by JS -->
                    </div>
                </div>
            </div>
        </div>

        <!-- Sponsorship Section -->
        <div class="card" id="sponsorship-section">
            <div class="card-header">
                <div class="card-title">
                    <i class="fas fa-handshake"></i>
                    赞助收入 Sponsorship
                </div>
                <div class="flex gap-2">
                    <button class="btn btn-outline" onclick="showSponsorChart()">
                        <i class="fas fa-chart-pie"></i> 图表
                    </button>
                    <button class="btn btn-primary" onclick="addSponsor()">
                        <i class="fas fa-plus"></i> 添加赞助
                    </button>
                </div>
            </div>
            <div class="grid grid-cols-3 gap-4 mb-4" id="sponsors-container">
                <!-- Sponsors will be populated by JS -->
            </div>
            <div class="grid grid-cols-4 gap-4 mt-4 pt-4 border-t" id="sponsor-summary">
                <!-- Summary will be populated by JS -->
            </div>
        </div>

        <!-- Investor Model Section -->
        <div class="card" id="investor-section">
            <div class="card-header">
                <div class="card-title">
                    <i class="fas fa-users"></i>
                    投资人分成模型
                    <span class="text-gray-400 text-sm font-normal">(优先级/劣后级结构)</span>
                </div>
                <button class="btn btn-primary" onclick="showInvestorConfig()">
                    <i class="fas fa-cog"></i> 配置投资结构
                </button>
            </div>
            
            <!-- Investment Structure Bar -->
            <div class="mb-6">
                <div class="flex justify-between text-sm mb-2">
                    <span class="text-gray-500">投资结构</span>
                    <span class="font-semibold" id="total-investment-label">总投资: ¥50,000,000</span>
                </div>
                <div class="progress-bar" id="investment-bar">
                    <!-- Will be populated by JS -->
                </div>
                <div class="flex justify-between text-sm mt-2">
                    <span class="text-gray-500">优先级收益倍数: <strong id="senior-multiplier">1.11x</strong></span>
                    <span class="text-gray-500">退出目标: <strong id="exit-target">¥2,220万</strong></span>
                </div>
            </div>

            <!-- Investor Cards -->
            <div class="grid-2" id="investor-cards">
                <!-- Will be populated by JS -->
            </div>
        </div>

        <!-- Stress Test Section -->
        <div class="card" id="stress-test-section">
            <div class="card-header">
                <div class="card-title">
                    <i class="fas fa-chart-line"></i>
                    压力测试 Stress Test
                </div>
            </div>
            
            <!-- Tabs -->
            <div class="tab-container">
                <button class="tab active" onclick="switchTab('senior')" id="tab-senior">
                    <i class="fas fa-crown"></i> 优先级退出分析
                </button>
                <button class="tab" onclick="switchTab('junior')" id="tab-junior">
                    <i class="fas fa-chart-bar"></i> 劣后级盈亏分析
                </button>
            </div>

            <!-- Tab Content -->
            <div id="stress-test-content">
                <!-- Will be populated by JS -->
            </div>
        </div>
    </div>

    <!-- Modals -->
    <div class="modal" id="chart-modal">
        <div class="modal-content" style="max-width: 700px;">
            <div class="modal-header">
                <div class="modal-title" id="chart-modal-title">数据可视化</div>
                <button class="modal-close" onclick="closeModal('chart-modal')">&times;</button>
            </div>
            <div class="chart-container">
                <canvas id="modal-chart"></canvas>
            </div>
        </div>
    </div>

    <div class="modal" id="edit-modal">
        <div class="modal-content">
            <div class="modal-header">
                <div class="modal-title" id="edit-modal-title">编辑</div>
                <button class="modal-close" onclick="closeModal('edit-modal')">&times;</button>
            </div>
            <div id="edit-modal-content">
                <!-- Form will be populated by JS -->
            </div>
        </div>
    </div>

    <div class="modal" id="investor-modal">
        <div class="modal-content">
            <div class="modal-header">
                <div class="modal-title">配置投资结构</div>
                <button class="modal-close" onclick="closeModal('investor-modal')">&times;</button>
            </div>
            <div id="investor-modal-content">
                <div class="form-group">
                    <label class="form-label">总投资金额 (元)</label>
                    <input type="number" class="input-field" id="config-total-investment" value="50000000">
                </div>
                <div class="form-group">
                    <label class="form-label">优先级投资金额 (元)</label>
                    <input type="number" class="input-field" id="config-senior-amount" value="20000000">
                </div>
                <div class="form-group">
                    <label class="form-label">优先级收益倍数</label>
                    <input type="number" class="input-field" id="config-senior-multiplier" value="1.11" step="0.01">
                </div>
                <div class="form-group">
                    <label class="form-label">分成比例 (%)</label>
                    <input type="number" class="input-field" id="config-share-ratio" value="100" min="0" max="100">
                </div>
                <button class="btn btn-primary w-full mt-4" onclick="saveInvestorConfig()">
                    <i class="fas fa-save"></i> 保存配置
                </button>
            </div>
        </div>
    </div>

    <script>
        // ==================== DATA MODEL ====================
        let appData = {
            venues: [
                {
                    id: 1,
                    name: '深圳大运中心体育场',
                    shows: 2,
                    sections: [
                        { id: 1, name: '内场 ¥2000', price: 2000, capacity: 4443, revenue: 0 },
                        { id: 2, name: '内场 ¥1880', price: 1880, capacity: 5312, revenue: 0 },
                        { id: 3, name: '内场 ¥1580', price: 1580, capacity: 5365, revenue: 0 },
                        { id: 4, name: '看台 ¥1280', price: 1280, capacity: 15979, revenue: 0 },
                        { id: 5, name: '看台 ¥880', price: 880, capacity: 6963, revenue: 0 },
                        { id: 6, name: '看台 ¥580', price: 580, capacity: 573, revenue: 0 },
                        { id: 7, name: '看台(远) ¥680', price: 680, capacity: 5365, revenue: 0 }
                    ]
                }
            ],
            costs: {
                artist: {
                    name: '艺人费用 Artist Fee',
                    icon: 'fa-star',
                    total: 52710400,
                    expanded: false,
                    items: [
                        { id: 1, name: '艺人出场费', unitPrice: 22720000, quantity: 2, amount: 45440000, note: '秀费一场320万美金' },
                        { id: 2, name: '税费 (16%)', unitPrice: 7270400, quantity: 1, amount: 7270400, note: '增值税6%，企业所得税10%' }
                    ]
                },
                travel: {
                    name: '差旅费用 T&E',
                    icon: 'fa-plane',
                    total: 1543000,
                    expanded: false,
                    items: [
                        { id: 1, name: '艺人团队酒店费用', unitPrice: 1000, quantity: 255, amount: 255000, note: '' },
                        { id: 2, name: '艺人团队酒店费用(大套房)', unitPrice: 12000, quantity: 30, amount: 360000, note: '' },
                        { id: 3, name: '艺人团队航空交通费用', unitPrice: 11000, quantity: 33, amount: 363000, note: '' },
                        { id: 4, name: '艺人和助理航空', unitPrice: 50000, quantity: 2, amount: 100000, note: '' },
                        { id: 5, name: '工作人员团队酒店', unitPrice: 500, quantity: 160, amount: 80000, note: '' },
                        { id: 6, name: '主办方航空交通', unitPrice: 80000, quantity: 1, amount: 80000, note: '' },
                        { id: 7, name: '货运/行李/海关/关税', unitPrice: 100000, quantity: 1, amount: 100000, note: '' },
                        { id: 8, name: '签证费', unitPrice: 1000, quantity: 35, amount: 35000, note: '' },
                        { id: 9, name: '其他杂项旅行费用', unitPrice: 100000, quantity: 1, amount: 100000, note: '' },
                        { id: 10, name: '地面交通费用', unitPrice: 20000, quantity: 3, amount: 70000, note: '' }
                    ]
                },
                production: {
                    name: '制作费用 Production',
                    icon: 'fa-film',
                    total: 5350000,
                    expanded: false,
                    items: [
                        { id: 1, name: '舞美灯光', unitPrice: 2500000, quantity: 2, amount: 5000000, note: '舞美按一场250万算' },
                        { id: 2, name: '艺人翻译', unitPrice: 10000, quantity: 1, amount: 10000, note: '' },
                        { id: 3, name: '工作人员翻译', unitPrice: 500, quantity: 100, amount: 50000, note: '' },
                        { id: 4, name: '化妆间家具', unitPrice: 10000, quantity: 2, amount: 20000, note: '' },
                        { id: 5, name: '艺人餐饮', unitPrice: 400, quantity: 525, amount: 210000, note: '' },
                        { id: 6, name: '警务餐饮', unitPrice: 30, quantity: 2000, amount: 60000, note: '' }
                    ]
                },
                venue: {
                    name: '场地费用 Venue',
                    icon: 'fa-building',
                    total: 7511678,
                    expanded: false,
                    items: [
                        { id: 1, name: '场地租赁', unitPrice: 1100000, quantity: 2, amount: 2200000, note: '' },
                        { id: 2, name: '电费', unitPrice: 50000, quantity: 2, amount: 100000, note: '' },
                        { id: 3, name: '安保人员', unitPrice: 350, quantity: 5400, amount: 1890000, note: '' },
                        { id: 4, name: '消防/医疗人员', unitPrice: 1800, quantity: 200, amount: 360000, note: '' },
                        { id: 5, name: '消防电气安全检查', unitPrice: 300000, quantity: 2, amount: 600000, note: '' },
                        { id: 6, name: '椅子', unitPrice: 8, quantity: 41420, amount: 331360, note: '' },
                        { id: 7, name: '移动厕所', unitPrice: 1500, quantity: 150, amount: 225000, note: '' },
                        { id: 8, name: '志愿者', unitPrice: 300, quantity: 700, amount: 210000, note: '' },
                        { id: 9, name: '后台餐饮', unitPrice: 150000, quantity: 2, amount: 300000, note: '' },
                        { id: 10, name: '其他场地费用', unitPrice: 647659, quantity: 1, amount: 1295318, note: '引导员、验票员、监理等' }
                    ]
                },
                marketing: {
                    name: '营销推广 Marketing',
                    icon: 'fa-bullhorn',
                    total: 2000000,
                    expanded: false,
                    items: [
                        { id: 1, name: '网络营销', unitPrice: 1000000, quantity: 1, amount: 1000000, note: '' },
                        { id: 2, name: '户外广告', unitPrice: 350000, quantity: 1, amount: 350000, note: '' },
                        { id: 3, name: '发布会', unitPrice: 130000, quantity: 1, amount: 130000, note: '' },
                        { id: 4, name: '公关费', unitPrice: 130000, quantity: 1, amount: 130000, note: '' },
                        { id: 5, name: '平面/摄影/海报等', unitPrice: 190000, quantity: 1, amount: 190000, note: '' },
                        { id: 6, name: '其他', unitPrice: 200000, quantity: 1, amount: 200000, note: '' }
                    ]
                },
                admin: {
                    name: '行政管理 Admin',
                    icon: 'fa-briefcase',
                    total: 2904000,
                    expanded: false,
                    items: [
                        { id: 1, name: '文化部许可证/外包执行团队', unitPrice: 200000, quantity: 2, amount: 400000, note: '' },
                        { id: 2, name: '一般责任保险', unitPrice: 200000, quantity: 2, amount: 400000, note: '' },
                        { id: 3, name: '行政费用', unitPrice: 150000, quantity: 2, amount: 300000, note: '' },
                        { id: 4, name: '招待费', unitPrice: 150000, quantity: 2, amount: 300000, note: '' },
                        { id: 5, name: '工资', unitPrice: 50000, quantity: 30, amount: 1500000, note: '' },
                        { id: 6, name: '银行费', unitPrice: 2000, quantity: 2, amount: 4000, note: '' }
                    ]
                }
            },
            sponsors: [
                { id: 1, name: '冠名赞助 Title Sponsor', icon: 'fa-crown', amount: 0 },
                { id: 2, name: '文化局补贴 MOC Subsidy', icon: 'fa-landmark', amount: 10000000 },
                { id: 3, name: '指定赞助 Official Sponsor', icon: 'fa-handshake', amount: 12000000 }
            ],
            sponsorCommissionRate: 0.10,
            investment: {
                total: 50000000,
                senior: {
                    amount: 20000000,
                    multiplier: 1.11,
                    shareRatio: 100
                },
                junior: {
                    amount: 30000000
                }
            },
            ticketCommissionRate: 0.035
        };

        // ==================== UTILITY FUNCTIONS ====================
        function formatNumber(num) {
            if (num === undefined || num === null || isNaN(num)) return '0';
            return Math.round(num).toLocaleString('zh-CN');
        }

        function formatCurrency(num) {
            return '¥' + formatNumber(num);
        }

        function formatWan(num) {
            return '¥' + (num / 10000).toFixed(0) + '万';
        }

        function calculateSectionRevenue(section, shows = 1) {
            return section.price * section.capacity * shows;
        }

        // ==================== CALCULATIONS ====================
        function calculateTotals() {
            // Calculate venue revenues
            appData.venues.forEach(venue => {
                venue.sections.forEach(section => {
                    section.revenue = calculateSectionRevenue(section, venue.shows);
                });
                venue.totalCapacity = venue.sections.reduce((sum, s) => sum + s.capacity, 0) * venue.shows;
                venue.totalRevenue = venue.sections.reduce((sum, s) => sum + s.revenue, 0);
                venue.singleShowRevenue = venue.totalRevenue / venue.shows;
            });

            // Total ticket stats
            const totalCapacity = appData.venues.reduce((sum, v) => sum + v.totalCapacity, 0);
            const totalTicketRevenue = appData.venues.reduce((sum, v) => sum + v.totalRevenue, 0);
            const totalShows = appData.venues.reduce((sum, v) => sum + v.shows, 0);
            const avgTicketPrice = totalTicketRevenue / totalCapacity;
            
            // Net ticket revenue (after commission)
            const netTicketRevenue = totalTicketRevenue * (1 - appData.ticketCommissionRate);

            // Total costs
            const totalCosts = Object.values(appData.costs).reduce((sum, cat) => sum + cat.total, 0);

            // Sponsorship
            const grossSponsorship = appData.sponsors.reduce((sum, s) => sum + s.amount, 0);
            const sponsorCommission = grossSponsorship * appData.sponsorCommissionRate;
            const netSponsorship = grossSponsorship - sponsorCommission;
            const sponsorRatio = totalTicketRevenue > 0 ? (netSponsorship / totalTicketRevenue * 100) : 0;

            // Net income
            const netIncome = netTicketRevenue + netSponsorship - totalCosts;
            
            // Tax (15% corporate tax if profitable)
            const tax = netIncome > 0 ? netIncome * 0.15 : 0;
            const netProfit = netIncome - tax;

            // Investment calculations
            const seniorTarget = appData.investment.senior.amount * appData.investment.senior.multiplier;
            const seniorReturn = seniorTarget;
            const juniorProfit = netProfit - seniorReturn + appData.investment.senior.amount;
            const juniorReturn = juniorProfit > 0 ? juniorProfit : 0;
            const juniorROI = appData.investment.junior.amount > 0 ? (juniorReturn / appData.investment.junior.amount * 100) : 0;

            return {
                totalCapacity,
                totalTicketRevenue,
                netTicketRevenue,
                totalShows,
                avgTicketPrice,
                totalCosts,
                grossSponsorship,
                sponsorCommission,
                netSponsorship,
                sponsorRatio,
                netIncome,
                tax,
                netProfit,
                seniorTarget,
                seniorReturn,
                juniorProfit,
                juniorReturn,
                juniorROI
            };
        }

        // ==================== RENDERING FUNCTIONS ====================
        function renderOverviewStats() {
            const totals = calculateTotals();
            const container = document.getElementById('overview-stats');
            
            container.innerHTML = \`
                <div class="stat-card">
                    <div class="stat-label">
                        <i class="fas fa-ticket-alt text-blue-500"></i>
                        总可售票数
                    </div>
                    <div class="stat-value">\${formatNumber(totals.totalCapacity)}</div>
                    <div class="stat-sub">共 \${totals.totalShows} 场</div>
                </div>
                <div class="stat-card">
                    <div class="stat-label">
                        <i class="fas fa-coins text-yellow-500"></i>
                        总票房收入 (RMB)
                    </div>
                    <div class="stat-value">\${formatCurrency(totals.totalTicketRevenue)}</div>
                    <div class="stat-sub">售票率=100%</div>
                </div>
                <div class="stat-card">
                    <div class="stat-label">
                        <i class="fas fa-file-invoice-dollar text-red-500"></i>
                        总成本 (RMB)
                    </div>
                    <div class="stat-value">\${formatCurrency(totals.totalCosts)}</div>
                    <div class="stat-sub">固定成本</div>
                </div>
                <div class="stat-card">
                    <div class="stat-label">
                        <i class="fas fa-chart-line text-green-500"></i>
                        预计净利润 (RMB)
                    </div>
                    <div class="stat-value \${totals.netProfit >= 0 ? 'text-green-600' : 'text-red-600'}">\${formatCurrency(totals.netProfit)}</div>
                    <div class="stat-sub">售票率=100%</div>
                </div>
            \`;
        }

        function renderVenues() {
            const container = document.getElementById('venues-container');
            const totalContainer = document.getElementById('venues-total');
            
            let venuesHtml = '';
            appData.venues.forEach((venue, vIndex) => {
                const venueRevenue = venue.sections.reduce((sum, s) => sum + calculateSectionRevenue(s, venue.shows), 0);
                const venueCapacity = venue.sections.reduce((sum, s) => sum + s.capacity, 0) * venue.shows;
                const singleShowCapacity = venue.sections.reduce((sum, s) => sum + s.capacity, 0);
                const singleShowRevenue = venueRevenue / venue.shows;
                
                venuesHtml += \`
                    <div class="venue-card">
                        <div class="venue-header">
                            <div class="venue-name">
                                <i class="fas fa-map-marker-alt text-green-500"></i>
                                <span contenteditable="true" onblur="updateVenueName(\${vIndex}, this.textContent)">\${venue.name}</span>
                            </div>
                            <div class="venue-stats">
                                <div class="venue-stat">
                                    <div class="venue-stat-label">场次</div>
                                    <div class="venue-stat-value">
                                        <input type="number" value="\${venue.shows}" min="1" max="20" 
                                            style="width: 50px; text-align: center; border: 1px solid #d1d5db; border-radius: 4px; padding: 2px;"
                                            onchange="updateVenueShows(\${vIndex}, this.value)">
                                    </div>
                                </div>
                                <div class="venue-stat">
                                    <div class="venue-stat-label">单场收入</div>
                                    <div class="venue-stat-value">\${formatCurrency(singleShowRevenue)}</div>
                                </div>
                                <div class="venue-stat">
                                    <div class="venue-stat-label">总收入</div>
                                    <div class="venue-stat-value">\${formatCurrency(venueRevenue)}</div>
                                </div>
                                <button class="delete-btn" onclick="deleteVenue(\${vIndex})" title="删除场地">
                                    <i class="fas fa-times"></i>
                                </button>
                            </div>
                        </div>
                        <table class="ticket-table">
                            <thead>
                                <tr>
                                    <th>区域</th>
                                    <th>票价</th>
                                    <th>容量</th>
                                    <th>单场收入</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                \${venue.sections.map((section, sIndex) => \`
                                    <tr>
                                        <td>
                                            <input type="text" value="\${section.name}" 
                                                style="border: none; background: transparent; width: 120px;"
                                                onchange="updateSection(\${vIndex}, \${sIndex}, 'name', this.value)">
                                        </td>
                                        <td>
                                            <input type="number" value="\${section.price}" 
                                                style="border: 1px solid #e5e7eb; border-radius: 4px; width: 80px; padding: 4px;"
                                                onchange="updateSection(\${vIndex}, \${sIndex}, 'price', this.value)">
                                        </td>
                                        <td>
                                            <input type="number" value="\${section.capacity}" 
                                                style="border: 1px solid #e5e7eb; border-radius: 4px; width: 80px; padding: 4px;"
                                                onchange="updateSection(\${vIndex}, \${sIndex}, 'capacity', this.value)">
                                        </td>
                                        <td class="amount-green">\${formatCurrency(section.price * section.capacity)}</td>
                                        <td>
                                            <span class="delete-btn" onclick="deleteSection(\${vIndex}, \${sIndex})">
                                                <i class="fas fa-times"></i>
                                            </span>
                                        </td>
                                    </tr>
                                \`).join('')}
                            </tbody>
                            <tfoot>
                                <tr style="background: #f9fafb; font-weight: 600;">
                                    <td>单场小计</td>
                                    <td></td>
                                    <td>\${formatNumber(singleShowCapacity)}</td>
                                    <td class="amount-green">\${formatCurrency(singleShowRevenue)}</td>
                                    <td>
                                        <button class="btn btn-outline" style="padding: 4px 8px; font-size: 12px;" 
                                            onclick="addSection(\${vIndex})">
                                            <i class="fas fa-plus"></i>
                                        </button>
                                    </td>
                                </tr>
                            </tfoot>
                        </table>
                    </div>
                \`;
            });
            
            container.innerHTML = venuesHtml;

            // Total across all venues
            const totals = calculateTotals();
            totalContainer.innerHTML = \`
                <div class="flex justify-between items-center">
                    <div class="flex items-center gap-2">
                        <i class="fas fa-list-alt text-green-600"></i>
                        <span class="font-semibold">所有场地总计</span>
                    </div>
                    <span class="text-lg font-bold text-green-600">\${totals.totalShows} 场</span>
                </div>
                <div class="grid grid-cols-3 gap-4 mt-3">
                    <div>
                        <div class="text-gray-500 text-sm">总票数</div>
                        <div class="font-bold">\${formatNumber(totals.totalCapacity)}</div>
                    </div>
                    <div>
                        <div class="text-gray-500 text-sm">总票房</div>
                        <div class="font-bold text-green-600">\${formatCurrency(totals.totalTicketRevenue)}</div>
                    </div>
                    <div>
                        <div class="text-gray-500 text-sm">平均票价</div>
                        <div class="font-bold">\${formatCurrency(totals.avgTicketPrice)}</div>
                    </div>
                </div>
            \`;
        }

        function renderCosts() {
            const container = document.getElementById('cost-container');
            const totalContainer = document.getElementById('cost-total');
            
            let costsHtml = '';
            Object.entries(appData.costs).forEach(([key, category]) => {
                costsHtml += \`
                    <div class="cost-category">
                        <div class="cost-category-header" onclick="toggleCostCategory('\${key}')">
                            <div class="cost-category-title">
                                <i class="fas \${category.icon}"></i>
                                <span>\${category.name}</span>
                                <span class="text-gray-400 text-sm">(\${category.items.length}项)</span>
                            </div>
                            <div class="flex items-center gap-3">
                                <span class="cost-category-amount">\${formatCurrency(category.total)}</span>
                                <i class="fas fa-chevron-\${category.expanded ? 'up' : 'down'} text-gray-400"></i>
                            </div>
                        </div>
                        <div class="cost-details \${category.expanded ? 'expanded' : ''}" id="cost-details-\${key}">
                            <table class="ticket-table">
                                <thead>
                                    <tr>
                                        <th>项目</th>
                                        <th>单价</th>
                                        <th>数量</th>
                                        <th>金额</th>
                                        <th></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    \${category.items.map((item, index) => \`
                                        <tr>
                                            <td>\${item.name}</td>
                                            <td>
                                                <input type="number" value="\${item.unitPrice}" 
                                                    style="border: 1px solid #e5e7eb; border-radius: 4px; width: 100px; padding: 4px;"
                                                    onchange="updateCostItem('\${key}', \${index}, 'unitPrice', this.value)">
                                            </td>
                                            <td>
                                                <input type="number" value="\${item.quantity}" 
                                                    style="border: 1px solid #e5e7eb; border-radius: 4px; width: 60px; padding: 4px;"
                                                    onchange="updateCostItem('\${key}', \${index}, 'quantity', this.value)">
                                            </td>
                                            <td class="amount-green">\${formatCurrency(item.amount)}</td>
                                            <td>
                                                <span class="delete-btn" onclick="deleteCostItem('\${key}', \${index})">
                                                    <i class="fas fa-times"></i>
                                                </span>
                                            </td>
                                        </tr>
                                    \`).join('')}
                                </tbody>
                            </table>
                            <div class="flex justify-between items-center mt-3 pt-3 border-t">
                                <button class="btn btn-outline" onclick="addCostItem('\${key}')">
                                    <i class="fas fa-plus"></i> 添加项目
                                </button>
                                <div class="font-semibold">
                                    小计: <span class="text-green-600">\${formatCurrency(category.total)}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                \`;
            });
            
            container.innerHTML = costsHtml;

            const totals = calculateTotals();
            totalContainer.innerHTML = \`
                <div class="flex justify-between items-center">
                    <div class="flex items-center gap-2">
                        <i class="fas fa-calculator text-gray-600"></i>
                        <span class="font-semibold">总成本 Total</span>
                    </div>
                    <span class="text-xl font-bold text-green-600">\${formatCurrency(totals.totalCosts)}</span>
                </div>
            \`;
        }

        function renderSponsors() {
            const container = document.getElementById('sponsors-container');
            const summaryContainer = document.getElementById('sponsor-summary');
            
            let sponsorsHtml = '';
            appData.sponsors.forEach((sponsor, index) => {
                sponsorsHtml += \`
                    <div class="sponsorship-card \${sponsor.amount > 0 ? 'has-value' : ''}">
                        <div class="sponsorship-label">
                            <i class="fas \${sponsor.icon}"></i>
                            \${sponsor.name}
                            <span class="delete-btn" onclick="deleteSponsor(\${index})" style="margin-left: auto;">
                                <i class="fas fa-times"></i>
                            </span>
                        </div>
                        <input type="number" class="input-field text-center text-lg font-bold" 
                            value="\${sponsor.amount}" 
                            style="margin-top: 8px;"
                            onchange="updateSponsor(\${index}, this.value)">
                    </div>
                \`;
            });
            
            container.innerHTML = sponsorsHtml;

            const totals = calculateTotals();
            summaryContainer.innerHTML = \`
                <div>
                    <div class="text-gray-500 text-sm">赞助总额</div>
                    <div class="font-bold text-lg">\${formatCurrency(totals.grossSponsorship)}</div>
                </div>
                <div>
                    <div class="text-gray-500 text-sm">佣金率 <input type="number" value="\${appData.sponsorCommissionRate * 100}" 
                        style="width: 40px; border: 1px solid #d1d5db; border-radius: 4px; padding: 2px; text-align: center;"
                        onchange="appData.sponsorCommissionRate = this.value / 100; renderAll()"> %</div>
                    <div class="font-bold text-lg text-red-500">-\${formatCurrency(totals.sponsorCommission)}</div>
                </div>
                <div>
                    <div class="text-gray-500 text-sm">净赞助收入</div>
                    <div class="font-bold text-lg text-green-600">\${formatCurrency(totals.netSponsorship)}</div>
                </div>
                <div>
                    <div class="text-gray-500 text-sm">占总收入比例</div>
                    <div class="font-bold text-lg">\${totals.sponsorRatio.toFixed(1)}%</div>
                </div>
            \`;
        }

        function renderInvestorModel() {
            const inv = appData.investment;
            const totals = calculateTotals();
            const seniorPercent = (inv.senior.amount / inv.total * 100).toFixed(0);
            const juniorPercent = (inv.junior.amount / inv.total * 100).toFixed(0);
            const seniorTarget = inv.senior.amount * inv.senior.multiplier;
            
            document.getElementById('total-investment-label').textContent = '总投资: ' + formatCurrency(inv.total);
            document.getElementById('senior-multiplier').textContent = inv.senior.multiplier + 'x';
            document.getElementById('exit-target').textContent = formatWan(seniorTarget);
            
            document.getElementById('investment-bar').innerHTML = \`
                <div class="progress-segment senior" style="width: \${seniorPercent}%">
                    优先级 \${formatWan(inv.senior.amount)} (\${seniorPercent}%)
                </div>
                <div class="progress-segment junior" style="width: \${juniorPercent}%">
                    劣后级 \${formatWan(inv.junior.amount)} (\${juniorPercent}%)
                </div>
            \`;

            // 【收入分成模式】计算收益
            const shareRatio = inv.senior.shareRatio / 100;
            
            // 100%售票率时的票房收入
            const ticketRevenue = totals.netTicketRevenue;
            
            // 优先级分成：直接从票房收入中按比例分成（不承担费用）
            const seniorPayout = Math.min(seniorTarget, ticketRevenue * shareRatio);
            
            // 劣后级收入：票房收入 - 优先级分成 + 赞助收入 - 总成本
            const juniorIncome = ticketRevenue - seniorPayout + totals.netSponsorship - totals.totalCosts;
            
            const seniorROI = ((seniorPayout / inv.senior.amount) - 1) * 100;
            const juniorROI = inv.junior.amount > 0 ? (juniorIncome / inv.junior.amount * 100) : 0;

            document.getElementById('investor-cards').innerHTML = \`
                <div class="investor-card senior">
                    <div class="investor-badge senior">
                        <i class="fas fa-crown"></i>
                        1 优先级 (Senior)
                        <span style="color: #6b7280; font-weight: normal; margin-left: 4px;">先行分配</span>
                    </div>
                    <div class="mt-4">
                        <div class="summary-row">
                            <span class="summary-label">投资金额</span>
                            <span class="summary-value">\${formatCurrency(inv.senior.amount)}</span>
                        </div>
                        <div class="summary-row">
                            <span class="summary-label">收益倍数</span>
                            <span class="summary-value">\${inv.senior.multiplier}x</span>
                        </div>
                        <div class="summary-row">
                            <span class="summary-label">分成比例</span>
                            <span class="summary-value">
                                <input type="number" value="\${inv.senior.shareRatio}" min="0" max="100"
                                    style="width: 60px; text-align: center; border: 1px solid #d1d5db; border-radius: 4px; padding: 4px;"
                                    onchange="appData.investment.senior.shareRatio = parseInt(this.value); renderAll()"> %
                            </span>
                        </div>
                        <div class="summary-row" style="border-top: 2px solid #eab308; padding-top: 12px; margin-top: 8px;">
                            <span class="summary-label">退出目标金额</span>
                            <span class="summary-value text-yellow-600">\${formatCurrency(seniorTarget)}</span>
                        </div>
                        <div class="summary-row">
                            <span class="summary-label">预期收益</span>
                            <span class="summary-value text-yellow-600">\${formatCurrency(seniorTarget - inv.senior.amount)}</span>
                        </div>
                    </div>
                </div>
                <div class="investor-card junior">
                    <div class="investor-badge junior">
                        <i class="fas fa-chart-bar"></i>
                        2 劣后级 (Junior)
                        <span style="color: #6b7280; font-weight: normal; margin-left: 4px;">承担风险</span>
                    </div>
                    <div class="mt-4">
                        <div class="summary-row">
                            <span class="summary-label">投资金额</span>
                            <span class="summary-value">\${formatCurrency(inv.junior.amount)}</span>
                        </div>
                        <div class="summary-row">
                            <span class="summary-label">剩余可分配利润 <span class="text-gray-400">(100%售票)</span></span>
                            <span class="summary-value">\${formatCurrency(ticketRevenue - seniorPayout)}</span>
                        </div>
                        <div class="summary-row">
                            <span class="summary-label">劣后级净收益 <span class="text-gray-400">(100%售票)</span></span>
                            <span class="summary-value \${juniorIncome >= 0 ? 'text-green-600' : 'text-red-600'}">\${formatCurrency(juniorIncome)}</span>
                        </div>
                        <div class="summary-row" style="border-top: 2px solid #22c55e; padding-top: 12px; margin-top: 8px;">
                            <span class="summary-label">收益率 <span class="text-gray-400">(100%售票)</span></span>
                            <span class="summary-value \${juniorROI >= 0 ? 'text-green-600' : 'text-red-600'}">\${juniorROI.toFixed(1)}%</span>
                        </div>
                    </div>
                </div>
            \`;
        }

        function renderStressTest() {
            const content = document.getElementById('stress-test-content');
            const inv = appData.investment;
            const totals = calculateTotals();
            const seniorTarget = inv.senior.amount * inv.senior.multiplier;
            
            // 优先级是【收入分成】模式，不是利润分成！
            // 优先级直接从票房收入中按比例分成，不承担费用
            const shareRatio = inv.senior.shareRatio / 100;
            
            // 优先级退出平衡点计算：
            // 票房收入 * 分成比例 = 退出目标
            // 即：票房收入 = 退出目标 / 分成比例
            // 售票率 = 需要的票房收入 / 100%售票率的票房收入
            const ticketRevenueNeeded = shareRatio > 0 ? (seniorTarget / shareRatio) : Infinity;
            let seniorBreakeven = ticketRevenueNeeded / totals.netTicketRevenue;
            seniorBreakeven = Math.max(0, Math.min(1, seniorBreakeven));
            
            // 劣后级盈亏平衡点：
            // 劣后级收入 = 票房收入 * (1 - 分成比例) + 赞助收入 - 总成本 >= 0
            // 票房收入 * (1 - 分成比例) >= 总成本 - 赞助收入
            // 如果分成比例100%，劣后级需要赞助收入 >= 总成本才能不亏
            const juniorShareRatio = 1 - shareRatio;
            let juniorBreakeven;
            if (juniorShareRatio > 0) {
                juniorBreakeven = (totals.totalCosts - totals.netSponsorship) / (totals.netTicketRevenue * juniorShareRatio);
            } else {
                // 100%分成给优先级时，劣后级只靠赞助收入
                juniorBreakeven = totals.netSponsorship >= totals.totalCosts ? 0 : Infinity;
            }
            
            content.innerHTML = \`
                <div class="flex justify-between items-center mb-4">
                    <div class="text-gray-600">
                        退出目标: <strong>\${formatCurrency(seniorTarget)}</strong>
                    </div>
                    <div class="text-gray-600">
                        退出平衡点: <strong class="text-green-600">\${(seniorBreakeven * 100).toFixed(1)}%</strong>
                    </div>
                </div>
                
                <div class="mb-4">
                    <div class="flex justify-between text-sm text-gray-500 mb-2">
                        <span>🎛 售票率范围</span>
                        <span>全部</span>
                        <span>聚焦回本: <span id="focus-range">0% - 100%</span></span>
                    </div>
                    <div class="flex gap-4 items-center">
                        <input type="range" class="slider flex-1" id="rate-min" min="0" max="100" value="0"
                            oninput="updateStressChart()">
                        <input type="range" class="slider flex-1" id="rate-max" min="0" max="100" value="100"
                            oninput="updateStressChart()">
                    </div>
                </div>
                
                <div class="flex gap-4 mb-4">
                    <label class="flex items-center gap-2">
                        <input type="checkbox" id="show-senior-line" checked onchange="updateStressChart()">
                        <span class="legend-dot" style="background: #3b82f6;"></span>
                        优先级累计分成（封顶\${formatWan(seniorTarget)}）
                    </label>
                    <label class="flex items-center gap-2">
                        <input type="checkbox" id="show-revenue-line" checked onchange="updateStressChart()">
                        <span class="legend-dot" style="background: #22c55e;"></span>
                        净票房收入（扣除3.5%佣金）
                    </label>
                </div>
                
                <div class="chart-container" style="height: 400px;">
                    <canvas id="stress-chart"></canvas>
                </div>
                
                <div class="analysis-info">
                    <i class="fas fa-info-circle"></i>
                    <strong>【收入分成模式】解读：</strong><br>
                    • 优先级投资 <strong>\${formatCurrency(inv.senior.amount)}</strong>，直接从票房收入中分成 <strong>\${inv.senior.shareRatio}%</strong>，<strong>不承担任何费用</strong>。<br>
                    • 当分成比例为100%时，售票率5%对应的票房收入（约\${formatWan(totals.netTicketRevenue * 0.05)}）将全部作为优先级分成。<br>
                    • 优先级退出平衡点：售票率达到 <strong>\${(seniorBreakeven * 100).toFixed(1)}%</strong> 时（票房收入约 <strong>\${formatWan(ticketRevenueNeeded)}</strong>），优先级累计分成达到封顶金额 <strong>\${formatCurrency(seniorTarget)}</strong> 并完成退出。<br>
                    • 超出退出目标的票房收入部分，归劣后级所有。
                </div>
            \`;
            
            // Draw chart
            setTimeout(() => {
                drawStressChart(seniorTarget, seniorBreakeven);
            }, 100);
        }

        let stressChart = null;
        
        function drawStressChart(seniorTarget, seniorBreakeven) {
            const ctx = document.getElementById('stress-chart');
            if (!ctx) return;
            
            const inv = appData.investment;
            const totals = calculateTotals();
            const shareRatio = inv.senior.shareRatio / 100;
            
            const minRate = parseInt(document.getElementById('rate-min')?.value || 0) / 100;
            const maxRate = parseInt(document.getElementById('rate-max')?.value || 100) / 100;
            
            // Generate data points
            const labels = [];
            const seniorData = [];
            const revenueData = [];
            const targetLine = [];
            
            const step = Math.max(1, Math.floor((maxRate - minRate) * 100 / 20));
            
            // Generate data from LOW to HIGH ticket rate (0% -> 100%) for more intuitive visualization
            for (let rate = minRate * 100; rate <= maxRate * 100; rate += step) {
                const r = rate / 100;
                labels.push((r * 100).toFixed(0) + '%');
                
                // 票房收入 at this rate (净票房收入 = 100%售票率的净票房 * 当前售票率)
                const ticketRevenue = totals.netTicketRevenue * r;
                
                // 优先级分成：直接从票房收入中按比例分成（收入分成模式，不是利润分成）
                // 优先级累计分成 = 票房收入 * 分成比例，但不超过封顶金额
                // 例：100%分成比例时，5%售票率的票房收入全部归优先级（直到达到封顶）
                const seniorPayout = Math.min(seniorTarget, ticketRevenue * shareRatio);
                
                seniorData.push(seniorPayout / 10000);
                revenueData.push(ticketRevenue / 10000);
                targetLine.push(seniorTarget / 10000);
            }
            
            if (stressChart) {
                stressChart.destroy();
            }
            
            const showSenior = document.getElementById('show-senior-line')?.checked !== false;
            const showRevenue = document.getElementById('show-revenue-line')?.checked !== false;
            
            stressChart = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: labels,
                    datasets: [
                        {
                            label: '优先级累计分成 (万元)',
                            data: showSenior ? seniorData : [],
                            borderColor: '#3b82f6',
                            backgroundColor: 'rgba(59, 130, 246, 0.1)',
                            fill: true,
                            tension: 0.3,
                            borderWidth: 3
                        },
                        {
                            label: '退出目标 (¥' + (seniorTarget/10000).toFixed(0) + '万)',
                            data: targetLine,
                            borderColor: '#f59e0b',
                            borderDash: [5, 5],
                            borderWidth: 2,
                            pointRadius: 0,
                            fill: false
                        },
                        {
                            label: '净票房收入 (万元)',
                            data: showRevenue ? revenueData : [],
                            borderColor: '#22c55e',
                            backgroundColor: 'rgba(34, 197, 94, 0.1)',
                            fill: true,
                            tension: 0.3,
                            borderWidth: 2
                        }
                    ]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    interaction: {
                        intersect: false,
                        mode: 'index'
                    },
                    plugins: {
                        title: {
                            display: true,
                            text: '优先级退出分析 vs 售票率 (收入分成模式)',
                            font: { size: 16 }
                        },
                        tooltip: {
                            callbacks: {
                                label: function(context) {
                                    return context.dataset.label + ': ¥' + context.parsed.y.toFixed(0) + '万';
                                }
                            }
                        }
                    },
                    scales: {
                        x: {
                            title: {
                                display: true,
                                text: '售票率 (← 低 | 高 →)'
                            }
                        },
                        y: {
                            title: {
                                display: true,
                                text: '金额 (万元)'
                            },
                            beginAtZero: true
                        }
                    }
                }
            });
            
            // Update focus range display
            const focusRange = document.getElementById('focus-range');
            if (focusRange) {
                focusRange.textContent = (minRate * 100).toFixed(0) + '% - ' + (maxRate * 100).toFixed(0) + '%';
            }
        }

        function updateStressChart() {
            const inv = appData.investment;
            const seniorTarget = inv.senior.amount * inv.senior.multiplier;
            const totals = calculateTotals();
            const shareRatio = inv.senior.shareRatio / 100;
            // 优先级退出平衡点：票房收入 * 分成比例 = 退出目标
            const ticketRevenueNeeded = shareRatio > 0 ? (seniorTarget / shareRatio) : Infinity;
            const seniorBreakeven = ticketRevenueNeeded / totals.netTicketRevenue;
            drawStressChart(seniorTarget, Math.max(0, Math.min(1, seniorBreakeven)));
        }

        function switchTab(tab) {
            document.getElementById('tab-senior').classList.toggle('active', tab === 'senior');
            document.getElementById('tab-junior').classList.toggle('active', tab === 'junior');
            
            if (tab === 'senior') {
                renderStressTest();
            } else {
                renderJuniorAnalysis();
            }
        }

        function renderJuniorAnalysis() {
            const content = document.getElementById('stress-test-content');
            const inv = appData.investment;
            const totals = calculateTotals();
            const seniorTarget = inv.senior.amount * inv.senior.multiplier;
            const shareRatio = inv.senior.shareRatio / 100;
            
            // 劣后级收益计算（收入分成模式）：
            // 劣后级收入 = 票房收入 * (1 - 分成比例) + 赞助收入 - 总成本 - 优先级封顶金额（如果优先级已达封顶）
            // 
            // 更准确地说：
            // - 优先级分成 = min(票房收入 * 分成比例, 封顶金额)
            // - 劣后级收入 = 票房收入 - 优先级分成 + 赞助收入 - 总成本
            //
            // 劣后级盈亏平衡点：劣后级收入 >= 0
            // 票房收入 - min(票房收入 * 分成比例, 封顶) + 赞助 - 成本 >= 0
            
            // 简化计算：假设优先级未封顶时
            // 票房 * (1 - 分成比例) + 赞助 - 成本 >= 0
            // 票房 >= (成本 - 赞助) / (1 - 分成比例)
            const juniorShareRatio = 1 - shareRatio;
            let juniorBreakeven;
            if (juniorShareRatio > 0) {
                juniorBreakeven = (totals.totalCosts - totals.netSponsorship) / (totals.netTicketRevenue * juniorShareRatio);
            } else {
                // 100%分成给优先级时，劣后级只能等优先级封顶后才有收入
                // 需要的票房 = 封顶金额 / 分成比例 + (成本 - 赞助)
                juniorBreakeven = (seniorTarget / shareRatio + totals.totalCosts - totals.netSponsorship) / totals.netTicketRevenue;
            }
            juniorBreakeven = Math.max(0, Math.min(2, juniorBreakeven)); // 允许超过100%来显示不可能盈利的情况
            
            content.innerHTML = \`
                <div class="flex justify-between items-center mb-4">
                    <div class="text-gray-600">
                        劣后级投资: <strong>\${formatCurrency(inv.junior.amount)}</strong>
                    </div>
                    <div class="text-gray-600">
                        盈亏平衡点: <strong class="text-green-600">\${(juniorBreakeven * 100).toFixed(1)}%</strong>
                    </div>
                </div>
                
                <div class="chart-container" style="height: 400px;">
                    <canvas id="junior-chart"></canvas>
                </div>
                
                <div class="analysis-info" style="background: #dcfce7; border-color: #22c55e; color: #166534;">
                    <i class="fas fa-info-circle"></i>
                    <strong>解读：</strong>劣后级承担所有费用（¥\${formatNumber(totals.totalCosts)}），
                    收入来源 = 票房收入 × \${((1 - shareRatio) * 100).toFixed(0)}% + 赞助收入（¥\${formatNumber(totals.netSponsorship)}）。
                    \${juniorBreakeven <= 1 ? 
                        '当售票率达到 <strong>' + (juniorBreakeven * 100).toFixed(1) + '%</strong> 时，劣后级开始盈利。' : 
                        '<strong style="color: #dc2626;">在当前分成比例下，即使100%售票也无法盈利。</strong>'}
                </div>
            \`;
            
            setTimeout(() => {
                drawJuniorChart(juniorBreakeven);
            }, 100);
        }

        let juniorChart = null;
        
        function drawJuniorChart(juniorBreakeven) {
            const ctx = document.getElementById('junior-chart');
            if (!ctx) return;
            
            const inv = appData.investment;
            const totals = calculateTotals();
            const seniorTarget = inv.senior.amount * inv.senior.multiplier;
            const shareRatio = inv.senior.shareRatio / 100;
            
            const labels = [];
            const juniorProfitData = [];
            const juniorROIData = [];
            
            // Generate data from LOW to HIGH ticket rate (0% -> 100%) for more intuitive visualization
            for (let rate = 0; rate <= 100; rate += 5) {
                const r = rate / 100;
                labels.push(rate + '%');
                
                // 票房收入 (净票房 = 100%售票率的净票房 * 当前售票率)
                const ticketRevenue = totals.netTicketRevenue * r;
                
                // 优先级分成（收入分成模式）- 直接从票房收入中分成
                const seniorPayout = Math.min(seniorTarget, ticketRevenue * shareRatio);
                
                // 劣后级收入 = 票房收入 - 优先级分成 + 赞助收入 - 总成本
                // 劣后级承担所有费用，优先级不承担费用
                const juniorProfit = ticketRevenue - seniorPayout + totals.netSponsorship - totals.totalCosts;
                
                juniorProfitData.push(juniorProfit / 10000);
                juniorROIData.push((juniorProfit / inv.junior.amount) * 100);
            }
            
            if (juniorChart) {
                juniorChart.destroy();
            }
            
            juniorChart = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: labels,
                    datasets: [
                        {
                            label: '劣后级净收益 (万元)',
                            data: juniorProfitData,
                            borderColor: '#22c55e',
                            backgroundColor: 'rgba(34, 197, 94, 0.2)',
                            fill: true,
                            tension: 0.3,
                            borderWidth: 3,
                            yAxisID: 'y'
                        },
                        {
                            label: '收益率 (%)',
                            data: juniorROIData,
                            borderColor: '#8b5cf6',
                            borderDash: [5, 5],
                            borderWidth: 2,
                            pointRadius: 2,
                            fill: false,
                            yAxisID: 'y1'
                        },
                        {
                            label: '盈亏平衡线',
                            data: labels.map(() => 0),
                            borderColor: '#ef4444',
                            borderDash: [10, 5],
                            borderWidth: 2,
                            pointRadius: 0,
                            fill: false,
                            yAxisID: 'y'
                        }
                    ]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    interaction: {
                        intersect: false,
                        mode: 'index'
                    },
                    plugins: {
                        title: {
                            display: true,
                            text: '劣后级盈亏分析 vs 售票率 (承担全部费用)',
                            font: { size: 16 }
                        }
                    },
                    scales: {
                        x: {
                            title: {
                                display: true,
                                text: '售票率 (← 低 | 高 →)'
                            }
                        },
                        y: {
                            type: 'linear',
                            display: true,
                            position: 'left',
                            title: {
                                display: true,
                                text: '净收益 (万元)'
                            }
                        },
                        y1: {
                            type: 'linear',
                            display: true,
                            position: 'right',
                            title: {
                                display: true,
                                text: '收益率 (%)'
                            },
                            grid: {
                                drawOnChartArea: false
                            }
                        }
                    }
                }
            });
        }

        // ==================== EVENT HANDLERS ====================
        function updateVenueName(vIndex, name) {
            appData.venues[vIndex].name = name;
            // No need to re-render, contenteditable handles it
        }

        function updateVenueShows(vIndex, shows) {
            appData.venues[vIndex].shows = parseInt(shows) || 1;
            renderAll();
        }

        function updateSection(vIndex, sIndex, field, value) {
            if (field === 'price' || field === 'capacity') {
                appData.venues[vIndex].sections[sIndex][field] = parseInt(value) || 0;
            } else {
                appData.venues[vIndex].sections[sIndex][field] = value;
            }
            renderAll();
        }

        function deleteSection(vIndex, sIndex) {
            if (appData.venues[vIndex].sections.length > 1) {
                appData.venues[vIndex].sections.splice(sIndex, 1);
                renderAll();
            }
        }

        function addSection(vIndex) {
            const newId = Math.max(...appData.venues[vIndex].sections.map(s => s.id)) + 1;
            appData.venues[vIndex].sections.push({
                id: newId,
                name: '新区域',
                price: 500,
                capacity: 1000,
                revenue: 0
            });
            renderAll();
        }

        function addVenue() {
            const newId = Math.max(...appData.venues.map(v => v.id)) + 1;
            appData.venues.push({
                id: newId,
                name: '新场地',
                shows: 1,
                sections: [
                    { id: 1, name: '内场', price: 1000, capacity: 5000, revenue: 0 },
                    { id: 2, name: '看台', price: 500, capacity: 10000, revenue: 0 }
                ]
            });
            renderAll();
        }

        function deleteVenue(vIndex) {
            if (appData.venues.length > 1) {
                appData.venues.splice(vIndex, 1);
                renderAll();
            }
        }

        function toggleCostCategory(key) {
            appData.costs[key].expanded = !appData.costs[key].expanded;
            const details = document.getElementById('cost-details-' + key);
            if (details) {
                details.classList.toggle('expanded');
            }
        }

        function updateCostItem(categoryKey, itemIndex, field, value) {
            const item = appData.costs[categoryKey].items[itemIndex];
            if (field === 'unitPrice' || field === 'quantity') {
                item[field] = parseInt(value) || 0;
                item.amount = item.unitPrice * item.quantity;
            }
            // Recalculate category total
            appData.costs[categoryKey].total = appData.costs[categoryKey].items.reduce((sum, i) => sum + i.amount, 0);
            renderAll();
        }

        function deleteCostItem(categoryKey, itemIndex) {
            if (appData.costs[categoryKey].items.length > 1) {
                appData.costs[categoryKey].items.splice(itemIndex, 1);
                appData.costs[categoryKey].total = appData.costs[categoryKey].items.reduce((sum, i) => sum + i.amount, 0);
                renderAll();
            }
        }

        function addCostItem(categoryKey) {
            const newId = Math.max(...appData.costs[categoryKey].items.map(i => i.id)) + 1;
            appData.costs[categoryKey].items.push({
                id: newId,
                name: '新项目',
                unitPrice: 10000,
                quantity: 1,
                amount: 10000,
                note: ''
            });
            appData.costs[categoryKey].total = appData.costs[categoryKey].items.reduce((sum, i) => sum + i.amount, 0);
            appData.costs[categoryKey].expanded = true;
            renderAll();
        }

        function updateSponsor(index, value) {
            appData.sponsors[index].amount = parseInt(value) || 0;
            renderAll();
        }

        function deleteSponsor(index) {
            if (appData.sponsors.length > 1) {
                appData.sponsors.splice(index, 1);
                renderAll();
            }
        }

        function addSponsor() {
            appData.sponsors.push({
                id: appData.sponsors.length + 1,
                name: '新赞助商',
                icon: 'fa-building',
                amount: 0
            });
            renderAll();
        }

        function showInvestorConfig() {
            document.getElementById('config-total-investment').value = appData.investment.total;
            document.getElementById('config-senior-amount').value = appData.investment.senior.amount;
            document.getElementById('config-senior-multiplier').value = appData.investment.senior.multiplier;
            document.getElementById('config-share-ratio').value = appData.investment.senior.shareRatio;
            document.getElementById('investor-modal').classList.add('active');
        }

        function saveInvestorConfig() {
            appData.investment.total = parseInt(document.getElementById('config-total-investment').value) || 50000000;
            appData.investment.senior.amount = parseInt(document.getElementById('config-senior-amount').value) || 20000000;
            appData.investment.senior.multiplier = parseFloat(document.getElementById('config-senior-multiplier').value) || 1.11;
            appData.investment.senior.shareRatio = parseInt(document.getElementById('config-share-ratio').value) || 100;
            appData.investment.junior.amount = appData.investment.total - appData.investment.senior.amount;
            closeModal('investor-modal');
            renderAll();
        }

        function closeModal(modalId) {
            document.getElementById(modalId).classList.remove('active');
        }

        // ==================== CHART MODALS ====================
        let modalChart = null;

        function showTicketChart() {
            document.getElementById('chart-modal-title').textContent = '票务收入分布';
            document.getElementById('chart-modal').classList.add('active');
            
            setTimeout(() => {
                const ctx = document.getElementById('modal-chart');
                if (modalChart) modalChart.destroy();
                
                const allSections = [];
                appData.venues.forEach(venue => {
                    venue.sections.forEach(section => {
                        allSections.push({
                            name: section.name + ' (' + venue.name.substring(0, 4) + ')',
                            revenue: section.price * section.capacity * venue.shows
                        });
                    });
                });
                
                const colors = ['#22c55e', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#14b8a6', '#f97316'];
                
                modalChart = new Chart(ctx, {
                    type: 'pie',
                    data: {
                        labels: allSections.map(s => s.name),
                        datasets: [{
                            data: allSections.map(s => s.revenue),
                            backgroundColor: colors.slice(0, allSections.length),
                            borderWidth: 2,
                            borderColor: '#fff'
                        }]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                            legend: {
                                position: 'right',
                                labels: {
                                    padding: 15,
                                    usePointStyle: true
                                }
                            },
                            tooltip: {
                                callbacks: {
                                    label: function(context) {
                                        const value = context.raw;
                                        const total = context.dataset.data.reduce((a, b) => a + b, 0);
                                        const percentage = ((value / total) * 100).toFixed(1);
                                        return context.label + ': ' + formatCurrency(value) + ' (' + percentage + '%)';
                                    }
                                }
                            }
                        }
                    }
                });
            }, 100);
        }

        function showCostChart() {
            document.getElementById('chart-modal-title').textContent = '成本结构分布';
            document.getElementById('chart-modal').classList.add('active');
            
            setTimeout(() => {
                const ctx = document.getElementById('modal-chart');
                if (modalChart) modalChart.destroy();
                
                const categories = Object.values(appData.costs);
                const colors = ['#ef4444', '#f59e0b', '#22c55e', '#3b82f6', '#8b5cf6', '#ec4899'];
                
                modalChart = new Chart(ctx, {
                    type: 'doughnut',
                    data: {
                        labels: categories.map(c => c.name),
                        datasets: [{
                            data: categories.map(c => c.total),
                            backgroundColor: colors,
                            borderWidth: 2,
                            borderColor: '#fff'
                        }]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        cutout: '50%',
                        plugins: {
                            legend: {
                                position: 'right',
                                labels: {
                                    padding: 15,
                                    usePointStyle: true
                                }
                            },
                            tooltip: {
                                callbacks: {
                                    label: function(context) {
                                        const value = context.raw;
                                        const total = context.dataset.data.reduce((a, b) => a + b, 0);
                                        const percentage = ((value / total) * 100).toFixed(1);
                                        return context.label + ': ' + formatCurrency(value) + ' (' + percentage + '%)';
                                    }
                                }
                            }
                        }
                    }
                });
            }, 100);
        }

        function showSponsorChart() {
            document.getElementById('chart-modal-title').textContent = '赞助收入分布';
            document.getElementById('chart-modal').classList.add('active');
            
            setTimeout(() => {
                const ctx = document.getElementById('modal-chart');
                if (modalChart) modalChart.destroy();
                
                const sponsors = appData.sponsors.filter(s => s.amount > 0);
                const colors = ['#22c55e', '#3b82f6', '#f59e0b', '#8b5cf6'];
                
                modalChart = new Chart(ctx, {
                    type: 'pie',
                    data: {
                        labels: sponsors.map(s => s.name),
                        datasets: [{
                            data: sponsors.map(s => s.amount),
                            backgroundColor: colors.slice(0, sponsors.length),
                            borderWidth: 2,
                            borderColor: '#fff'
                        }]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                            legend: {
                                position: 'right'
                            },
                            tooltip: {
                                callbacks: {
                                    label: function(context) {
                                        const value = context.raw;
                                        const total = context.dataset.data.reduce((a, b) => a + b, 0);
                                        const percentage = ((value / total) * 100).toFixed(1);
                                        return context.label + ': ' + formatCurrency(value) + ' (' + percentage + '%)';
                                    }
                                }
                            }
                        }
                    }
                });
            }, 100);
        }

        // ==================== DATA EXPORT/SAVE ====================
        function exportData() {
            const dataStr = JSON.stringify(appData, null, 2);
            const blob = new Blob([dataStr], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'concert-budget-' + new Date().toISOString().split('T')[0] + '.json';
            a.click();
            URL.revokeObjectURL(url);
        }

        function saveData() {
            localStorage.setItem('concertBudgetData', JSON.stringify(appData));
            alert('数据已保存到本地存储！');
        }

        function loadData() {
            const saved = localStorage.getItem('concertBudgetData');
            if (saved) {
                try {
                    appData = JSON.parse(saved);
                } catch (e) {
                    console.error('Failed to load saved data:', e);
                }
            }
        }

        // ==================== INITIALIZATION ====================
        function renderAll() {
            renderOverviewStats();
            renderVenues();
            renderCosts();
            renderSponsors();
            renderInvestorModel();
            renderStressTest();
        }

        // Initialize on load
        document.addEventListener('DOMContentLoaded', function() {
            loadData();
            renderAll();
        });

        // Close modals on background click
        document.querySelectorAll('.modal').forEach(modal => {
            modal.addEventListener('click', function(e) {
                if (e.target === this) {
                    this.classList.remove('active');
                }
            });
        });
    </script>
</body>
</html>`)
})

// API endpoints for data persistence (optional future use)
app.get('/api/health', (c) => {
  return c.json({ status: 'ok', timestamp: new Date().toISOString() })
})

export default app
