document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('financial-info');
    const resultsSection = document.getElementById('results');
    const chartsDiv = document.getElementById('charts');
    const budgetPlansDiv = document.getElementById('budget-plans');

    form.addEventListener('submit', function (event) {
        event.preventDefault(); // Prevent form submission

        // Get user inputs
        const monthlyIncome = parseFloat(document.getElementById('monthly-income').value);
        const foodCosts = parseFloat(document.getElementById('food-costs').value);
        const rent = parseFloat(document.getElementById('rent').value);
        const transportation = parseFloat(document.getElementById('transportation').value);
        const miscellaneous = parseFloat(document.getElementById('miscellaneous').value);

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
            advice: getBudgetAdvice(savings)
        };

        // Display results
        displayResults(budgetPlan);
    });

    function getBudgetAdvice(savings) {
        if (savings > 0) {
            return "Great job! You're saving money. Consider investing or adding to your emergency fund.";
        } else if (savings === 0) {
            return "You're breaking even. Look for ways to reduce expenses or increase income.";
        } else {
            return "You're spending more than you earn. Review your expenses and prioritize needs over wants.";
        }
    }

    function displayResults(budgetPlan) {
        // Clear previous results
        chartsDiv.innerHTML = '<canvas id="budgetChart"></canvas>';
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
                plugins: {
                    legend: { position: 'top' },
                    title: {
                        display: true,
                        text: 'Budget Breakdown'
                    }
                }
            }
        });
    }
});