document.addEventListener('DOMContentLoaded', function () {
    console.log('DOM fully loaded and parsed');

    const form = document.getElementById('retirement-form');
    const retirementResults = document.getElementById('retirement-results');
    const retirementCharts = document.getElementById('retirement-charts');
    const retirementDetails = document.getElementById('retirement-details');

    // Navigation handling
    function navigateToPage(url) {
        document.body.classList.add('fade-out');
        setTimeout(() => {
            window.location.href = url;
        }, 300);
    }

    document.querySelectorAll('nav a').forEach(link => {
        link.addEventListener('click', (event) => {
            event.preventDefault();
            navigateToPage(link.getAttribute('href'));
        });
    });

    form.addEventListener('submit', function (event) {
        event.preventDefault();

        // Show loading spinner
        const spinner = document.createElement('div');
        spinner.className = 'loading-spinner';
        
        // Clear previous results but keep container structure
        retirementCharts.innerHTML = '';
        retirementDetails.innerHTML = '';
        retirementResults.appendChild(spinner);

        setTimeout(() => {
            // Get and validate inputs
            const inputs = {
                currentAge: parseFloat(document.getElementById('current-age').value),
                currentSavings: parseFloat(document.getElementById('current-savings').value),
                expectedSavings: parseFloat(document.getElementById('expected-savings').value),
                retirementAge: parseFloat(document.getElementById('retirement-age').value),
                monthlySavings: parseFloat(document.getElementById('monthly-savings').value),
                passiveIncome: parseFloat(document.getElementById('passive-income').value)
            };

            if (Object.values(inputs).some(v => isNaN(v) || v < 0)) {
                alert('Please enter valid numbers for all fields.');
                return;
            }

            // Calculate and display results
            const retirementPlan = calculateRetirementPlan(inputs);
            displayResults(retirementPlan);
        }, 1000);
    });

    function calculateRetirementPlan({
        currentAge,
        currentSavings,
        expectedSavings,
        retirementAge,
        monthlySavings,
        passiveIncome
    }) {
        const yearsToRetirement = retirementAge - currentAge;
        let savings = currentSavings;
        const savingsOverTime = [];

        for (let i = 0; i <= yearsToRetirement + 10; i++) {
            savingsOverTime.push(savings);
            savings += i < yearsToRetirement ? 
                monthlySavings * 12 : 
                passiveIncome * 12;
        }

        return {
            currentAge,
            currentSavings,
            expectedSavings,
            retirementAge,
            monthlySavings,
            passiveIncome,
            totalSavingsAtRetirement: currentSavings + (monthlySavings * 12 * yearsToRetirement),
            isOnTrack: currentSavings + (monthlySavings * 12 * yearsToRetirement) >= expectedSavings,
            savingsOverTime,
            yearsToRetirement
        };
    }

    function displayResults(retirementPlan) {
        // Clear spinner and rebuild interface
        retirementResults.innerHTML = `
            <h2>Your Retirement Plan 📊</h2>
            <div id="retirement-charts"></div>
            <div id="retirement-details"></div>
        `;

        // Rebuild chart container
        const chartsContainer = document.getElementById('retirement-charts');
        chartsContainer.innerHTML = '<canvas id="retirementChart" width="300" height="300"></canvas>';

        // Chart configuration
        const ctx = document.getElementById('retirementChart').getContext('2d');
        new Chart(ctx, {
            type: 'line',
            data: {
                labels: Array.from(
                    { length: retirementPlan.yearsToRetirement + 11 },
                    (_, i) => retirementPlan.currentAge + i
                ),
                datasets: [
                    {
                        label: 'Savings Over Time ($)',
                        data: retirementPlan.savingsOverTime,
                        borderColor: '#36A2EB',
                        backgroundColor: 'rgba(54, 162, 235, 0.2)',
                        fill: true,
                        tension: 0.4
                    },
                    {
                        label: 'Expected Savings Goal ($)',
                        data: Array(retirementPlan.yearsToRetirement + 11).fill(retirementPlan.expectedSavings),
                        borderColor: '#FF6384',
                        borderDash: [5, 5],
                        borderWidth: 2
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { position: 'bottom' },
                    title: {
                        display: true,
                        text: 'Savings Growth Over Time',
                        font: { family: "'Sono', sans-serif" }
                    }
                },
                scales: {
                    x: { title: { display: true, text: 'Age' } },
                    y: { title: { display: true, text: 'Savings ($)' } }
                }
            }
        });

        // Details content
        document.getElementById('retirement-details').innerHTML = `
            <h3>📊 Retirement Plan Breakdown</h3>
            ${Object.entries({
                'Current Age': retirementPlan.currentAge,
                'Current Savings': `$${retirementPlan.currentSavings.toFixed(2)}`,
                'Expected Savings': `$${retirementPlan.expectedSavings.toFixed(2)}`,
                'Retirement Age': retirementPlan.retirementAge,
                'Monthly Savings': `$${retirementPlan.monthlySavings.toFixed(2)}`,
                'Passive Income': `$${retirementPlan.passiveIncome.toFixed(2)}/month`,
                'Total Savings at Retirement': `$${retirementPlan.totalSavingsAtRetirement.toFixed(2)}`,
                'On Track?': retirementPlan.isOnTrack ? '✅ Yes' : '❌ No'
            }).map(([key, value]) => `
                <p><strong>${key}:</strong> ${value}</p>
            `).join('')}
        `;

        // Trigger animation
        setTimeout(() => {
            retirementResults.classList.add('visible');
        }, 50);
    }
});