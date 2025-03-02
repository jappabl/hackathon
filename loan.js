document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('loan-form');
    const loanResults = document.getElementById('loan-results');

    form.addEventListener('submit', function (event) {
        event.preventDefault(); // Prevent form submission

        // Get user inputs
        const interestType = document.getElementById('interest-type').value;
        const interestRate = parseFloat(document.getElementById('interest-rate').value);
        const loanAmount = parseFloat(document.getElementById('loan-amount').value);
        const payoffPeriod = parseFloat(document.getElementById('payoff-period').value);

        // Validate inputs
        if (
            isNaN(interestRate) || isNaN(loanAmount) || isNaN(payoffPeriod) ||
            interestRate < 0 || loanAmount < 0 || payoffPeriod < 0
        ) {
            alert('Please enter valid numbers for all fields.');
            return;
        }

        // Calculate monthly payment
        const monthlyPayment = calculateMonthlyPayment(interestType, interestRate, loanAmount, payoffPeriod);

        // Display results
        displayResults(monthlyPayment, loanAmount, payoffPeriod);
    });

    function calculateMonthlyPayment(interestType, interestRate, loanAmount, payoffPeriod) {
        const monthlyInterestRate = interestRate / 100 / 12; // Convert annual rate to monthly
        if (interestType === 'simple') {
            // Simple interest formula: Total = P + (P * r * t)
            const totalAmount = loanAmount + (loanAmount * monthlyInterestRate * payoffPeriod);
            return totalAmount / payoffPeriod; // Monthly payment
        } else {
            // Compound interest formula: Monthly Payment = [P * r * (1 + r)^n] / [(1 + r)^n - 1]
            const numerator = loanAmount * monthlyInterestRate * Math.pow(1 + monthlyInterestRate, payoffPeriod);
            const denominator = Math.pow(1 + monthlyInterestRate, payoffPeriod) - 1;
            return numerator / denominator; // Monthly payment
        }
    }

    function displayResults(monthlyPayment, loanAmount, payoffPeriod) {
        const totalPayment = monthlyPayment * payoffPeriod;
        const totalInterest = totalPayment - loanAmount;

        const resultsHTML = `
            <h3>📊 Loan Repayment Plan</h3>
            <p><strong>Loan Amount:</strong> $${loanAmount.toFixed(2)}</p>
            <p><strong>Payoff Period:</strong> ${payoffPeriod} months</p>
            <p><strong>Monthly Payment:</strong> $${monthlyPayment.toFixed(2)}</p>
            <p><strong>Total Payment:</strong> $${totalPayment.toFixed(2)}</p>
            <p><strong>Total Interest Paid:</strong> $${totalInterest.toFixed(2)}</p>
        `;
        loanResults.innerHTML = resultsHTML;
    }
});
