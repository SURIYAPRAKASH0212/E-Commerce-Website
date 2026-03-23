async function trackOrder() {
    const orderId = document.getElementById('order-id').value.trim();
    if (!orderId) {
        alert('Please enter an Order ID');
        return;
    }

    const resultDiv = document.getElementById('tracking-result');
    resultDiv.innerHTML = '<div class="loading">Fetching status...</div>';
    resultDiv.classList.remove('hide');

    try {
        const res = await fetch(`/api/track/${orderId}`);
        const data = await res.json();

        if (!res.ok) {
            resultDiv.innerHTML = `<p class="error-msg">${data.error}</p>`;
            return;
        }

        const stages = ['Processing', 'Shipped', 'Delivered'];
        const currentStageIndex = stages.indexOf(data.status);

        let timelineHTML = '<div class="timeline">';
        stages.forEach((stage, index) => {
            let statusClass = 'pending';
            if (index < currentStageIndex) statusClass = 'completed';
            else if (index === currentStageIndex) statusClass = 'current';

            let timeStr = '';
            // Only add time if it's placed or has a matching history step
            let historyItem = data.history.find(h => h.status === stage);
            if (stage === 'Processing') {
                historyItem = data.history.find(h => h.status === 'Processing' || h.status === 'Order Placed');
            }
            
            if (historyItem) {
                const date = new Date(historyItem.time);
                timeStr = `<div class="time">${date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</div>`;
            }

            // Icons
            let icon = '📦';
            if (stage === 'Shipped') icon = '🚚';
            if (stage === 'Delivered') icon = '✅';

            timelineHTML += `
                <div class="timeline-item ${statusClass}">
                    <div class="indicator">${icon}</div>
                    <div class="content">
                        <h4>${stage}</h4>
                        ${timeStr}
                    </div>
                </div>
            `;
        });
        timelineHTML += '</div>';

        resultDiv.innerHTML = `
            <div class="tracking-card">
                <h3>Status for <strong class="order-id-highlight">${data.orderId}</strong></h3>
                <p>Placed on: ${new Date(data.date).toLocaleDateString()}</p>
                ${timelineHTML}
                <div class="tracking-items-summary">
                    <h4>Items:</h4>
                    <ul>
                        ${data.items.map(item => `<li>${item.quantity}x ${item.name} ${item.size ? `(Size: ${item.size})` : ''}</li>`).join('')}
                    </ul>
                </div>
            </div>
        `;

    } catch (e) {
        resultDiv.innerHTML = '<p class="error-msg">Error connecting to server. Try again later.</p>';
    }
}
