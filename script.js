document.addEventListener('DOMContentLoaded', () => {
    const STORAGE_KEY = 'arorMarketItems';

    // Initial default items database
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
            description: 'Plain Navy blue hoodie.'
        }
    ];

    // Load items from localStorage or initialize with defaultItems
    let items;
    try {
        const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY));
        if (Array.isArray(parsed) && parsed.length > 0) {
            items = parsed;
        } else {
            items = [...defaultItems];
            localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
        }
    } catch (err) {
        items = [...defaultItems];
        localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    }

    // --- 1. Render items on index.html feed ---
    const itemContainer = document.getElementById('itemContainer');
    const searchInput = document.getElementById('searchInput');
    const filterButtons = document.querySelectorAll('.filter-btn[data-category]');
    const noResults = document.getElementById('no-results');

    if (itemContainer) {
        function renderItems(filteredItems) {
            itemContainer.innerHTML = '';
            if (filteredItems.length === 0) {
                if (noResults) {
                    noResults.classList.remove('hidden');
                    itemContainer.appendChild(noResults);
                }
                return;
            }

            filteredItems.forEach(item => {
                const card = document.createElement('div');
                card.className = 'item-card';

                let statusClass = 'open';
                if (item.status === 'Claimed') statusClass = 'claimed';
                if (item.status === 'For Sale') statusClass = 'sale';

                card.innerHTML = `
                    <div class="card-img-container">
                        <img src="${item.image}" alt="${item.title}" onerror="this.src='images/campus-gate.jpg'; this.onerror=function(){this.src='images/campus.jpg';};">
                        <span class="badge badge-${item.category}">${item.category.toUpperCase()}</span>
                    </div>
                    <div class="card-content">
                        <h3>${item.title}</h3>
                        <p class="card-loc">📍 ${item.location}</p>
                        <p class="card-date">📅 ${item.date}</p>
                        <p class="card-desc">${item.description}</p>
                        <div class="card-footer-info">
                            <span class="status ${statusClass}">${item.status}</span>
                            <span class="contact">📞 ${item.contact}</span>
                        </div>
                    </div>
                `;
                itemContainer.appendChild(card);
            });
        }

        renderItems(items);

        let currentSearch = '';
        let currentCategory = 'all';

        function filterAndRender() {
            const filtered = items.filter(item => {
                const matchesSearch = item.title.toLowerCase().includes(currentSearch.toLowerCase()) ||
                                      item.description.toLowerCase().includes(currentSearch.toLowerCase()) ||
                                      item.location.toLowerCase().includes(currentSearch.toLowerCase());
                const matchesCategory = currentCategory === 'all' || item.category === currentCategory;
                return matchesSearch && matchesCategory;
            });
            renderItems(filtered);
        }

        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                currentSearch = e.target.value;
                filterAndRender();
            });
        }

        filterButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                filterButtons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                currentCategory = btn.getAttribute('data-category');
                filterAndRender();
            });
        });
    }

    // --- 2. Render items on catalog.html data table ---
    const catalogTableBody = document.querySelector('#catalogTable tbody');
    if (catalogTableBody) {
        catalogTableBody.innerHTML = '';
        items.forEach(item => {
            const row = document.createElement('tr');

            let tagClass = 'tag-lost';
            if (item.category === 'found') tagClass = 'tag-found';
            if (item.category === 'marketplace') tagClass = 'tag-market';

            row.innerHTML = `
                <td>${item.title}</td>
                <td><span class="tag ${tagClass}">${item.category.toUpperCase()}</span></td>
                <td>${item.location}</td>
                <td>${item.date}</td>
                <td>${item.status}</td>
                <td>${item.contact}</td>
            `;
            catalogTableBody.appendChild(row);
        });
    }

    // --- 3. Form Validation & Local Storage Saving on report.html ---
    const itemForm = document.getElementById('itemForm');
    if (itemForm) {
        const itemImageInput = document.getElementById('itemImage');
        const imagePreview = document.getElementById('imagePreview');
        let uploadedImageData = 'images/campus-gate.jpg';
        const MAX_IMAGE_BYTES = 1.5 * 1024 * 1024;

        if (itemImageInput) {
            itemImageInput.addEventListener('change', (e) => {
                const file = e.target.files[0];
                const errImgEl = document.getElementById('err-itemImage');
                if (errImgEl) errImgEl.textContent = '';
                itemImageInput.classList.remove('error-input');

                if (!file) {
                    uploadedImageData = 'images/campus-gate.jpg';
                    if (imagePreview) {
                        imagePreview.src = '';
                        imagePreview.classList.add('hidden');
                    }
                    return;
                }

                if (!file.type.startsWith('image/')) {
                    uploadedImageData = 'images/campus-gate.jpg';
                    if (imagePreview) imagePreview.classList.add('hidden');
                    showError(itemImageInput, 'err-itemImage', 'Please choose a valid image file (JPG, PNG, or WebP).');
                    itemImageInput.value = '';
                    return;
                }

                if (file.size > MAX_IMAGE_BYTES) {
                    uploadedImageData = 'images/campus-gate.jpg';
                    if (imagePreview) imagePreview.classList.add('hidden');
                    showError(itemImageInput, 'err-itemImage', 'Image must be 1.5 MB or smaller so localStorage stays fast.');
                    itemImageInput.value = '';
                    return;
                }

                const reader = new FileReader();
                reader.onload = (event) => {
                    uploadedImageData = event.target.result;
                    if (imagePreview) {
                        imagePreview.src = uploadedImageData;
                        imagePreview.classList.remove('hidden');
                    }
                };
                reader.readAsDataURL(file);
            });
        }

        itemForm.addEventListener('submit', (e) => {
            e.preventDefault();
            let isValid = true;

            document.querySelectorAll('.error-msg').forEach(el => el.textContent = '');
            document.querySelectorAll('input, select, textarea').forEach(el => el.classList.remove('error-input'));

            const studentName = document.getElementById('studentName');
            const rollNumber = document.getElementById('rollNumber');
            const itemTitle = document.getElementById('itemTitle');
            const category = document.getElementById('category');
            const location = document.getElementById('location');
            const phone = document.getElementById('phone');
            const description = document.getElementById('description');

            if (!studentName.value.trim()) {
                showError(studentName, 'err-studentName', 'Student name is required.');
                isValid = false;
            }

            if (!rollNumber.value.trim()) {
                showError(rollNumber, 'err-rollNumber', 'SAP ID / Roll number is required.');
                isValid = false;
            }

            if (!itemTitle.value.trim()) {
                showError(itemTitle, 'err-itemTitle', 'Item title is required.');
                isValid = false;
            }

            if (!category.value) {
                showError(category, 'err-category', 'Please select a category.');
                isValid = false;
            }

            if (!location.value.trim()) {
                showError(location, 'err-location', 'Location is required.');
                isValid = false;
            }

            const phoneVal = phone.value.trim();
            const phoneRegex = /^\d{11}$/;
            if (!phoneVal) {
                showError(phone, 'err-phone', 'Phone number is required.');
                isValid = false;
            } else if (!phoneRegex.test(phoneVal)) {
                showError(phone, 'err-phone', 'Phone number must be exactly 11 digits (e.g., 03001234567).');
                isValid = false;
            }

            if (!description.value.trim()) {
                showError(description, 'err-description', 'Description is required.');
                isValid = false;
            }

            if (isValid) {
                const newItem = {
                    id: Date.now(),
                    title: itemTitle.value.trim(),
                    category: category.value,
                    reporter: studentName.value.trim(),
                    rollNumber: rollNumber.value.trim(),
                    location: location.value.trim(),
                    date: new Date().toISOString().split('T')[0],
                    status: category.value === 'marketplace' ? 'For Sale' : 'Open',
                    contact: phone.value.trim(),
                    image: uploadedImageData,
                    description: description.value.trim()
                };

                items.unshift(newItem);
                localStorage.setItem(STORAGE_KEY, JSON.stringify(items));

                uploadedImageData = 'images/campus-gate.jpg';
                if (imagePreview) {
                    imagePreview.src = '';
                    imagePreview.classList.add('hidden');
                }

                const successMsg = document.getElementById('successMsg');
                if (successMsg) {
                    successMsg.classList.remove('hidden');
                }
                itemForm.reset();
                setTimeout(() => {
                    if (successMsg) successMsg.classList.add('hidden');
                }, 5000);
            }
        });
    }

    function showError(inputEl, errorId, message) {
        inputEl.classList.add('error-input');
        const errEl = document.getElementById(errorId);
        if (errEl) {
            errEl.textContent = message;
        }
    }
});