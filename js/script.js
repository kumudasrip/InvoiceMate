
// Invoice State
const invoiceState = {
    items: [],
    invoiceId: '',
    currentDate: ''
};

// Initialize Invoice
function initializeInvoice() {
    invoiceState.invoiceId = generateInvoiceId();
    invoiceState.currentDate = getCurrentDate();
    document.getElementById('invoiceId').textContent = invoiceState.invoiceId;
    document.getElementById('invoiceDate').textContent = invoiceState.currentDate;
}

// Generate Unique Invoice ID
function generateInvoiceId() {
    const timestamp = Date.now().toString().slice(-6);
    const random = Math.floor(Math.random() * 1000);
    return `#INV-${timestamp}${random}`.substring(0, 11);
}

// Get Current Date
function getCurrentDate() {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date().toLocaleDateString('en-IN', options);
}

// Add Item to Invoice
function addItem() {
    const itemName = document.getElementById('itemName').value.trim();
    const quantity = parseFloat(document.getElementById('quantity').value);
    const unitPrice = parseFloat(document.getElementById('unitPrice').value);

    // Validation
    if (!itemName) {
        alert('Please enter an item name');
        return;
    }
    if (!quantity || quantity <= 0) {
        alert('Please enter a valid quantity');
        return;
    }
    if (!unitPrice || unitPrice <= 0) {
        alert('Please enter a valid unit price');
        return;
    }

    // Add to items array
    invoiceState.items.push({
        id: Date.now(),
        name: itemName,
        quantity: quantity,
        unitPrice: unitPrice,
        total: quantity * unitPrice
    });

    // Clear form
    document.getElementById('itemName').value = '';
    document.getElementById('quantity').value = '1';
    document.getElementById('unitPrice').value = '';

    // Show success message
    showSuccessAlert();

    // Update UI
    renderTable();
    updateCalculations();
    showFormSections();
}

// Show Success Alert
function showSuccessAlert() {
    const alert = document.getElementById('successAlert');
    alert.classList.add('show');
    setTimeout(() => alert.classList.remove('show'), 3000);
}

// Delete Item
function deleteItem(id) {
    invoiceState.items = invoiceState.items.filter(item => item.id !== id);
    renderTable();
    updateCalculations();
    if (invoiceState.items.length === 0) {
        hideFormSections();
    }
}

// Render Invoice Table
function renderTable() {
    const tableContainer = document.getElementById('tableContainer');

    if (invoiceState.items.length === 0) {
        tableContainer.innerHTML = '<div class="empty-message">No items added yet. Add items above to generate invoice.</div>';
        return;
    }

    let tableHTML = `
                <table class="invoice-table">
                    <thead>
                        <tr>
                            <th style="width: 5%;">S.No</th>
                            <th style="width: 40%;">Item Name</th>
                            <th style="width: 15%; text-align: center;">Qty</th>
                            <th style="width: 20%; text-align: right;">Unit Price (₹)</th>
                            <th style="width: 15%; text-align: right;">Total (₹)</th>
                            <th style="width: 5%; text-align: center;">Action</th>
                        </tr>
                    </thead>
                    <tbody>
            `;

    invoiceState.items.forEach((item, index) => {
        tableHTML += `
                    <tr>
                        <td>${index + 1}</td>
                        <td>${item.name}</td>
                        <td class="text-center">${item.quantity}</td>
                        <td class="text-right">₹${item.unitPrice.toFixed(2)}</td>
                        <td class="text-right"><span class="item-total">₹${item.total.toFixed(2)}</span></td>
                        <td class="text-center">
                            <button class="delete-btn" onclick="deleteItem(${item.id})">Delete</button>
                        </td>
                    </tr>
                `;
    });

    tableHTML += `
                    </tbody>
                </table>
            `;

    tableContainer.innerHTML = tableHTML;
}

// Update Calculations
function updateCalculations() {
    if (invoiceState.items.length === 0) return;

    // Calculate Subtotal
    const subtotal = invoiceState.items.reduce((sum, item) => sum + item.total, 0);

    // Get Discount Percentage
    const discountPercent = parseFloat(document.getElementById('discountPercentInput').value) || 0;

    // Calculate Discount Amount
    const discountAmount = (subtotal * discountPercent) / 100;

    // Calculate Net Amount
    const netAmount = subtotal - discountAmount;

    // Get Payment Mode
    const paymentMode = document.getElementById('paymentMode').value;

    // Update DOM
    document.getElementById('subtotal').textContent = subtotal.toFixed(2);
    document.getElementById('discountPercent').textContent = discountPercent;
    document.getElementById('discountAmount').textContent = discountAmount.toFixed(2);
    document.getElementById('netAmount').textContent = netAmount.toFixed(2);
    document.getElementById('grandTotal').textContent = netAmount.toFixed(2);

    // Update Payment Mode Display
    if (paymentMode) {
        document.getElementById('paymentModeDisplay').textContent = paymentMode;
        document.getElementById('paymentBadge').textContent = paymentMode;
        document.getElementById('paymentBadge').style.display = 'inline-block';
    } else {
        document.getElementById('paymentModeDisplay').textContent = '-';
        document.getElementById('paymentBadge').style.display = 'none';
    }
}

// Show Form Sections
function showFormSections() {
    document.getElementById('discountPaymentSection').style.display = 'block';
    document.getElementById('summarySection').style.display = 'grid';
    document.getElementById('actionButtons').style.display = 'flex';
}

// Hide Form Sections
function hideFormSections() {
    document.getElementById('discountPaymentSection').style.display = 'none';
    document.getElementById('summarySection').style.display = 'none';
    document.getElementById('actionButtons').style.display = 'none';
    document.getElementById('discountPercentInput').value = '0';
    document.getElementById('paymentMode').value = '';
}

// Print Invoice
function printInvoice() {
    window.print();
}

// Reset Invoice
function resetInvoice() {
    if (confirm('Are you sure you want to reset the entire invoice?')) {
        invoiceState.items = [];
        document.getElementById('itemName').value = '';
        document.getElementById('quantity').value = '1';
        document.getElementById('unitPrice').value = '';
        document.getElementById('discountPercentInput').value = '0';
        document.getElementById('paymentMode').value = '';
        initializeInvoice();
        renderTable();
        hideFormSections();
    }
}

// Allow Enter key to add item
document.addEventListener('DOMContentLoaded', function () {
    initializeInvoice();
    document.getElementById('unitPrice').addEventListener('keypress', function (e) {
        if (e.key === 'Enter') {
            addItem();
        }
    });
});
