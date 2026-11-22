document.addEventListener('DOMContentLoaded', () => {
    const ADMIN_PASSCODE = 'aror@123,*'; // Simple passcode for viva demonstration
    const STORAGE_KEY = 'arorMarketItems';

    // Default fallback items matching main app
    const defaultItems = [
        {
            id: 1,
            title: 'iPhone 13 (Blue)',
            category: 'lost',
            reporter: 'Ahmed Ali',
            rollNumber: '8000-200-45',
            location: 'Library Level 2',
            date: '2026-05-10',
            status: 'Open',
            contact: '0300-1234567',
            image: 'images/item1.jpg',
            description: 'Blue iPhone 13 with a clear silicone case.'
        },
        {
            id: 2,
            title: 'Calculus Textbook',
            category: 'marketplace',
            reporter: 'Fatima Zahra',
            rollNumber: '1000-204-69',
            location: 'Cafeteria',
            date: '2026-05-11',
            status: 'For Sale',
            contact: '0321-9876543',
            image: 'images/item2.jpg',
            description: 'Engineering Mathematics / Calculus 8th Edition.'
        },
        {
            id: 3,
            title: 'Black Backpack',
            category: 'found',
            reporter: 'Usman Khalid',
            rollNumber: '5000-204-29',
            location: 'Sports Hall',
            date: '2026-05-12',
            status: 'Claimed',
            contact: '0333-5556677',
            image: 'images/item3.jpg',
            description: 'Black Nike backpack containing notebooks.'
        },
        {
            id: 4,
            title: 'MacBook Pro M1',
            category: 'lost',
            reporter: 'Bilal Raza',
            rollNumber: '5000-204-37',
            location: 'Computer Lab B',
            date: '2026-05-12',
            status: 'Open',
            contact: '0345-1112223',
            image: 'images/item4.jpg',
            description: 'Space Gray MacBook Pro with stickers on lid.'
        },
        {
            id: 5,
            title: 'Winter Hoodie',
            category: 'found',
            reporter: 'Sara Khan',
            rollNumber: '2024-MG-009',
            location: 'Dining Hall',
            date: '2026-05-13',
            status: 'Open',
            contact: '0301-4445556',
            image: 'images/item5.jpg',
            description: 'Navy blue Aror University branded hoodie.'
        }
    ];

    // DOM Elements
    const loginGate = document.getElementById('loginGate');
    const adminDashboard = document.getElementById('adminDashboard');
    const loginBtn = document.getElementById('loginBtn');
    const logoutBtn = document.getElementById('logoutBtn');
    const adminPasscodeInput = document.getElementById('adminPasscode');
    const loginError = document.getElementById('loginError');

    const tableBody = document.getElementById('adminTableBody');
    const adminSearch = document.getElementById('adminSearch');
    const adminStatusFilter = document.getElementById('adminStatusFilter');
    const resetStorageBtn = document.getElementById('resetStorageBtn');

    const exportBtn = document.getElementById('exportBtn');
    const importTriggerBtn = document.getElementById('importTriggerBtn');
    const importFile = document.getElementById('importFile');

    function getItems() {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (!stored) {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultItems));
            return [...defaultItems];
        }
        try {
            const parsed = JSON.parse(stored);
            return Array.isArray(parsed) ? parsed : [...defaultItems];
        } catch (err) {
            return [...defaultItems];
        }
    }

    function saveItems(items) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    }

    // --- Authentication Flow ---
    if (sessionStorage.getItem('arorAdminAuth') === 'true') {
        unlockDashboard();
    }

    loginBtn.addEventListener('click', () => {
        if (adminPasscodeInput.value === ADMIN_PASSCODE) {
            sessionStorage.setItem('arorAdminAuth', 'true');
            loginError.classList.add('hidden');
            unlockDashboard();
        } else {
            loginError.classList.remove('hidden');
        }
    });

    adminPasscodeInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') loginBtn.click();
    });

    logoutBtn.addEventListener('click', () => {
        sessionStorage.removeItem('arorAdminAuth');
        adminDashboard.classList.add('hidden');
        loginGate.classList.remove('hidden');
        adminPasscodeInput.value = '';
    });

    function unlockDashboard() {
        loginGate.classList.add('hidden');
        adminDashboard.classList.remove('hidden');
        renderAdminTable();
    }

    // --- Render Dashboard Stats & Table ---
    function renderAdminTable() {
        const items = getItems();
        const searchQuery = adminSearch.value.toLowerCase();
        const statusFilter = adminStatusFilter.value;

        document.getElementById('statTotal').textContent = items.length;
        document.getElementById('statOpen').textContent = items.filter(i => i.status === 'Open').length;
        document.getElementById('statClaimed').textContent = items.filter(i => i.status === 'Claimed').length;
        document.getElementById('statMarket').textContent = items.filter(i => i.category === 'marketplace' || i.status === 'For Sale').length;

        const filtered = items.filter(item => {
            const reporterStr = `${item.reporter || 'Student'} ${item.rollNumber || ''}`.toLowerCase();
            const matchesSearch = item.title.toLowerCase().includes(searchQuery) ||
                                  item.location.toLowerCase().includes(searchQuery) ||
                                  reporterStr.includes(searchQuery);
            const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
            return matchesSearch && matchesStatus;
        });

        tableBody.innerHTML = '';

        if (filtered.length === 0) {
            tableBody.innerHTML = '<tr><td colspan="8" style="text-align:center; padding: 20px;">No reports found matching filters.</td></tr>';
            return;
        }

        filtered.forEach(item => {
            const tr = document.createElement('tr');

            let statusClass = 'status-open';
            if (item.status === 'Claimed') statusClass = 'status-claimed';
            if (item.status === 'For Sale') statusClass = 'status-sale';

            const reporterName = item.reporter || 'Submitted via Web';
            const rollNo = item.rollNumber ? `(${item.rollNumber})` : '';

            tr.innerHTML = `
                <td>#${String(item.id).slice(-4)}</td>
                <td>
                    <strong>${item.title}</strong><br>
                    <small style="color:#64748b;">${item.description || ''}</small>
                </td>
                <td><span class="badge badge-${item.category}">${item.category}</span></td>
                <td>${reporterName} <br><small>${rollNo}</small></td>
                <td>${item.location} <br><small>${item.date}</small></td>
                <td>${item.contact}</td>
                <td><span class="status-pill ${statusClass}">${item.status}</span></td>
                <td>
                    <div class="action-btns">
                        <button class="btn-success" onclick="toggleStatus(${item.id})">
                            ${item.status === 'Claimed' ? 'Reopen' : 'Mark Claimed'}
                        </button>
                        <button class="btn-danger" onclick="deleteItem(${item.id})">Delete</button>
                    </div>
                </td>
            `;
            tableBody.appendChild(tr);
        });
    }

    // --- Export & Import JSON Backup (Admin Privileges) ---
    if (exportBtn) {
        exportBtn.addEventListener('click', () => {
            const currentItems = getItems();
            const dataStr = JSON.stringify(currentItems, null, 2);
            const blob = new Blob([dataStr], { type: 'application/json' });
            const url = URL.createObjectURL(blob);

            const link = document.createElement('a');
            link.href = url;
            link.download = `aror_marketplace_backup_${new Date().toISOString().split('T')[0]}.json`;
            link.click();
            URL.revokeObjectURL(url);
        });
    }

    if (importTriggerBtn && importFile) {
        importTriggerBtn.addEventListener('click', () => {
            importFile.click();
        });

        importFile.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (!file) return;

            const reader = new FileReader();
            reader.onload = (event) => {
                try {
                    const importedItems = JSON.parse(event.target.result);
                    if (Array.isArray(importedItems)) {
                        saveItems(importedItems);
                        renderAdminTable();
                        alert('✅ Backup restored to localStorage!');
                    } else {
                        alert('❌ Invalid backup format: expected a JSON array.');
                    }
                } catch (err) {
                    alert('❌ Could not parse JSON backup file.');
                } finally {
                    importFile.value = '';
                }
            };
            reader.readAsText(file);
        });
    }

    // --- Admin Actions ---
    window.toggleStatus = function(id) {
        const items = getItems();
        const index = items.findIndex(item => item.id === id);
        if (index !== -1) {
            items[index].status = items[index].status === 'Claimed' ? 'Open' : 'Claimed';
            saveItems(items);
            renderAdminTable();
        }
    };

    window.deleteItem = function(id) {
        if (confirm('Are you sure you want to permanently delete this report?')) {
            let items = getItems();
            items = items.filter(item => item.id !== id);
            saveItems(items);
            renderAdminTable();
        }
    };

    resetStorageBtn.addEventListener('click', () => {
        if (confirm('Reset all listings back to the 5 default items?')) {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultItems));
            renderAdminTable();
        }
    });

    adminSearch.addEventListener('input', renderAdminTable);
    adminStatusFilter.addEventListener('change', renderAdminTable);
});
