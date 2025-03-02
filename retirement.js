document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('retirement-form');
    const retirementResults = document.getElementById('retirement-results');
    const retirementCharts = document.getElementById('retirement-charts');
    const retirementDetails = document.getElementById('retirement-details');

    form.addEventListener('submit', function (event) {
        event.preventDefault(); // Prevent form submission

        // Get user inputs
        const currentAge = parseFloat(document.getElementById('current-age').value);
        const currentSavings = parseFloat(document.getElementById('current-savings').value);
        const expectedSavings = parseFloat(document.getElementById('expected-savings').value);
        const retirementAge = parseFloat(document.getElementById('retirement-age').value);
        const monthlySavings = parseFloat(document.getElementById('monthly-savings').value);
        const passiveIncome = parseFloat(document.getElementById('passive-income').value);

        // Validate inputs
        if (
            isNaN(currentAge) || isNaN(currentSavings) || isNaN(expectedSavings) ||
            isNaN(retirementAge) || isNaN(monthlySavings) || isNaN(passiveIncome) ||
            currentAge < 0 || currentSavings < 0 || expectedSavings < 0 ||
            retirementAge < 0 || monthlySavings < 0 || passiveIncome < 0
        ) {
            alert('Please enter valid numbers for all fields.');
            return;
        }

        // Calculate retirement plan
        const retirementPlan = calculateRetirementPlan(currentAge, currentSavings, expectedSavings, retirementAge, monthlySavings, passiveIncome);

        // Display results
        displayResults(retirementPlan);
    });

    function calculateRetirementPlan(currentAge, currentSavings, expectedSavings, retirementAge, monthlySavings, passiveIncome) {
        const yearsToRetirement = retirementAge - currentAge;

        // Calculate total savings at retirement
        const totalSavingsAtRetirement = currentSavings + (monthlySavings * 12 * yearsToRetirement);

        // Calculate if the user is on track (based on savings at retirement age)
        const isOnTrack = totalSavingsAtRetirement >= expectedSavings;

        // Calculate savings growth over time (up to retirement age + 10 years)
        const savingsOverTime = [];
        let savings = currentSavings;
        for (let i = 0; i <= yearsToRetirement + 10; i++) {
            savingsOverTime.push(savings);

            if (i < yearsToRetirement) {
                savings += monthlySavings * 12; // Add yearly savings before retirement
            } else {
                savings += passiveIncome * 12; // Add passive income after retirement
            }
        }

        return {
            currentAge,
            currentSavings,
            expectedSavings,
            retirementAge,
            monthlySavings,
            passiveIncome,
            totalSavingsAtRetirement,
            isOnTrack,
            savingsOverTime,
            yearsToRetirement
        };
    }

    function displayResults(retirementPlan) {
        // Clear previous results
        retirementCharts.innerHTML = '<canvas id="retirementChart" width="300" height="300"></canvas>'; // Smaller and skinnier graph
        retirementDetails.innerHTML = '';

        // Display retirement details
        const detailsHTML = `
            <h3>📊 Retirement Plan Breakdown</h3>
            <p><strong>Current Age:</strong> ${retirementPlan.currentAge}</p>
            <p><strong>Current Savings:</strong> $${retirementPlan.currentSavings.toFixed(2)}</p>
            <p><strong>Expected Savings:</strong> $${retirementPlan.expectedSavings.toFixed(2)}</p>
            <p><strong>Retirement Age:</strong> ${retirementPlan.retirementAge}</p>
            <p><strong>Monthly Savings:</strong> $${retirementPlan.monthlySavings.toFixed(2)}</p>
            <p><strong>Passive Income:</strong> $${retirementPlan.passiveIncome.toFixed(2)}/month</p>
            <p><strong>Total Savings at Retirement:</strong> $${retirementPlan.totalSavingsAtRetirement.toFixed(2)}</p>
            <p><strong>On Track?:</strong> ${retirementPlan.isOnTrack ? '✅ Yes' : '❌ No'}</p>
        `;
        retirementDetails.innerHTML = detailsHTML;

        // Generate line chart
        const ctx = document.getElementById('retirementChart').getContext('2d');
        new Chart(ctx, {
            type: 'line',
            data: {
                labels: Array.from({ length: retirementPlan.yearsToRetirement + 11 }, (_, i) => retirementPlan.currentAge + i), // X-axis: Age from current to retirement + 10 years
                datasets: [
                    {
                        label: 'Savings Over Time ($)',
                        data: retirementPlan.savingsOverTime, // Y-axis: Savings over time
                        borderColor: '#36A2EB', // Line color
                        backgroundColor: 'rgba(54, 162, 235, 0.2)', // Fill color
                        fill: true,
                        tension: 0.4 // Smooth line
                    },
                    {
                        label: 'Expected Savings Goal ($)',
                        data: Array(retirementPlan.yearsToRetirement + 11).fill(retirementPlan.expectedSavings), // Y-axis: Expected savings goal
                        borderColor: '#FF6384', // Line color
                        borderDash: [5, 5], // Dashed line
                        borderWidth: 2,
                        fill: false // No fill
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false, // Allow custom sizing
                layout: {
                    padding: {
                        left: 20,
                        right: 20,
                        top: 20,
                        bottom: 20
                    }
                },
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            font: {
                                size: 14,
                                family: "'Sono', sans-serif"
                            }
                        }
                    },
                    title: {
                        display: true,
                        text: 'Savings Growth Over Time',
                        font: {
                            size: 18,
                            family: "'Sono', sans-serif"
                        }
                    }
                },
                scales: {
                    x: {
                        title: {
                            display: true,
                            text: 'Age',
                            font: {
                                size: 14,
                                family: "'Sono', sans-serif"
                            }
                        }
                    },
                    y: {
                        title: {
                            display: true,
                            text: 'Savings ($)',
                            font: {
                                size: 14,
                                family: "'Sono', sans-serif"
                            }
                        }
                    }
                }
            }
        });
    }
});
