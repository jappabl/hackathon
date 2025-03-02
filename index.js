document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('financial-info');
    const resultsSection = document.getElementById('results');
    const chartsDiv = document.getElementById('charts');
    const budgetPlansDiv = document.getElementById('budget-plans');

    console.log('Script loaded!'); // Debugging: Check if script is running

    form.addEventListener('submit', function (event) {
        event.preventDefault(); // Prevent form submission
        console.log('Form submitted!'); // Debugging: Check if form submission is triggered

        // Get user inputs
        const monthlyIncome = parseFloat(document.getElementById('monthly-income').value);
        const foodCosts = parseFloat(document.getElementById('food-costs').value);
        const rent = parseFloat(document.getElementById('rent').value);
        const transportation = parseFloat(document.getElementById('transportation').value);
        const miscellaneous = parseFloat(document.getElementById('miscellaneous').value);

        console.log('Inputs:', { monthlyIncome, foodCosts, rent, transportation, miscellaneous }); // Debugging: Check input values

        // Validate inputs
        if (
            isNaN(monthlyIncome) || isNaN(foodCosts) || isNaN(rent) ||
            isNaN(transportation) || isNaN(miscellaneous) ||
            monthlyIncome < 0 || foodCosts < 0 || rent < 0 ||
            transportation < 0 || miscellaneous < 0
        ) {
            alert('Please enter valid numbers for all fields.');
            return;
        }

        // Calculate total spending
        const totalSpending = foodCosts + rent + transportation + miscellaneous;

        // Calculate savings
        const savings = monthlyIncome - totalSpending;
        const budgetPlan = {
            income: monthlyIncome,
            spending: totalSpending,
            savings: savings,
            expenses: {
                food: foodCosts,
                rent: rent,
                transportation: transportation,
                miscellaneous: miscellaneous
            },
            advice: getBudgetAdvice(savings, foodCosts, transportation, miscellaneous)
        };

        console.log('Budget Plan:', budgetPlan); // Debugging: Check budget plan object

        // Display results
        displayResults(budgetPlan);
    });

    function getBudgetAdvice(savings, foodCosts, transportation, miscellaneous) {
        let advice = '';

        // General advice based on savings
        if (savings > 0) {
            advice = "Great job! You're saving money. Consider investing or adding to your emergency fund.";
        } else if (savings === 0) {
            advice = "You're breaking even. Look for ways to reduce expenses or increase income.";
        } else {
            advice = "You're spending more than you earn. Review your expenses and prioritize needs over wants.";
        }

        // Specific advice for overspending on categories
        if (savings < 0) {
            if (foodCosts > 400) {
                advice += " Maybe cut down on food expenses by cooking at home or meal prepping.";
            }
            if (transportation > 1000) {
                advice += " Consider reducing transportation costs by using public transit or carpooling.";
            }
            if (miscellaneous > 300) {
                advice += " Try to limit miscellaneous spending by tracking non-essential purchases.";
            }
        }

        return advice;
    }

    // Function to handle tab transitions with animations
function navigateToPage(url) {
    document.body.classList.add('fade-out'); // Fade out the current page
    setTimeout(() => {
        window.location.href = url; // Navigate to the new page after the fade-out
    }, 100); // Match the duration of the CSS transition
}

// Add event listeners to navigation links
document.querySelectorAll('nav a').forEach(link => {
    link.addEventListener('click', (event) => {
        event.preventDefault(); // Prevent default link behavior
        const url = link.getAttribute('href'); // Get the target URL
        navigateToPage(url); // Navigate with animation
    });
});

    function displayResults(budgetPlan) {
        // Clear previous results
        chartsDiv.innerHTML = '<canvas id="budgetChart" width="400" height="400"></canvas>'; // Smaller chart size
        budgetPlansDiv.innerHTML = '';

        // Display budget plan
        const planHTML = `
            <h3>📊 Your Budget Breakdown</h3>
            <p><strong>Income:</strong> $${budgetPlan.income.toFixed(2)}</p>
            <p><strong>Total Spending:</strong> $${budgetPlan.spending.toFixed(2)}</p>
            <p><strong>Savings:</strong> $${budgetPlan.savings.toFixed(2)}</p>
            <p><strong>Advice:</strong> ${budgetPlan.advice}</p>
            <h4>Expense Breakdown:</h4>
            <ul>
                <li>🍔 Food: $${budgetPlan.expenses.food.toFixed(2)}</li>
                <li>🏠 Rent: $${budgetPlan.expenses.rent.toFixed(2)}</li>
                <li>🚗 Transportation: $${budgetPlan.expenses.transportation.toFixed(2)}</li>
                <li>🎲 Miscellaneous: $${budgetPlan.expenses.miscellaneous.toFixed(2)}</li>
            </ul>
        `;
        budgetPlansDiv.innerHTML = planHTML;

        console.log('Results displayed!'); // Debugging: Check if results are displayed

        // Generate chart
        const ctx = document.getElementById('budgetChart').getContext('2d');
        new Chart(ctx, {
            type: 'pie',
            data: {
                labels: ['Food', 'Rent', 'Transportation', 'Miscellaneous', 'Savings'],
                datasets: [{
                    data: [
                        budgetPlan.expenses.food,
                        budgetPlan.expenses.rent,
                        budgetPlan.expenses.transportation,
                        budgetPlan.expenses.miscellaneous,
                        budgetPlan.savings
                    ],
                    backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#4CAF50']
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false, // Allow custom sizing
                plugins: {
                    legend: {
                        position: 'bottom', // Move legend to the bottom
                        labels: {
                            font: {
                                size: 14, // Increase legend font size
                                family: "'Sono', sans-serif" // Apply Sono font to legend
                            }
                        }
                    },
                    title: {
                        display: true,
                        text: 'Budget Breakdown',
                        font: {
                            size: 18, // Increase title font size
                            family: "'Sono', sans-serif" // Apply Sono font to title
                        }
                    }
                }
            }
        });

        setTimeout(() => {
            document.getElementById('results').classList.add('visible');
        }, 100); // Small delay to ensure the DOM updates
    }
});
