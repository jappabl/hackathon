document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('loan-form');
    const loanResults = document.getElementById('loan-results');

    // Function to handle tab transitions with animations
    function navigateToPage(url) {
        document.body.classList.add('fade-out'); // Fade out the current page
        setTimeout(() => {
            window.location.href = url; // Navigate to the new page after the fade-out
        }, 100); // Match the duration of the CSS transition (300ms)
    }

    // Add event listeners to navigation links
    document.querySelectorAll('nav a').forEach(link => {
        link.addEventListener('click', (event) => {
            event.preventDefault(); // Prevent default link behavior
            const url = link.getAttribute('href'); // Get the target URL
            navigateToPage(url); // Navigate with animation
        });
    });

    form.addEventListener('submit', function (event) {
        event.preventDefault(); // Prevent form submission

        // Get user inputs
        const interestType = document.getElementById('interest-type').value;
        const interestRate = parseFloat(document.getElementById('interest-rate').value);
        const interestCycle = parseFloat(document.getElementById('interest-cycle').value);
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
        const monthlyPayment = calculateMonthlyPayment(interestType, interestRate, interestCycle, loanAmount, payoffPeriod);

        // Display results
        displayResults(monthlyPayment, loanAmount, payoffPeriod);
    });

    function calculateMonthlyPayment(interestType, interestRate, interestCycle, loanAmount, payoffPeriod) {
        // Convert annual interest rate to the selected cycle
        const cycleInterestRate = interestRate / 100 / interestCycle;

        if (interestType === 'simple') {
            // Simple interest formula: Total = P + (P * r * t)
            const totalAmount = loanAmount + (loanAmount * cycleInterestRate * payoffPeriod);
            return totalAmount / payoffPeriod; // Monthly payment
        } else {
            // Compound interest formula: Monthly Payment = [P * r * (1 + r)^n] / [(1 + r)^n - 1]
            const numerator = loanAmount * cycleInterestRate * Math.pow(1 + cycleInterestRate, payoffPeriod);
            const denominator = Math.pow(1 + cycleInterestRate, payoffPeriod) - 1;
            return numerator / denominator; // Monthly payment
        }
    }

    function displayResults(monthlyPayment, loanAmount, payoffPeriod) {
        // Clear previous results
        loanResults.innerHTML = '';

        // Calculate total payment and total interest
        const totalPayment = monthlyPayment * payoffPeriod;
        const totalInterest = totalPayment - loanAmount;

        // Display loan details
        const detailsHTML = `
            <h3>📊 Loan Repayment Plan</h3>
            <p><strong>Loan Amount:</strong> $${loanAmount.toFixed(2)}</p>
            <p><strong>Payoff Period:</strong> ${payoffPeriod} months</p>
            <p><strong>Monthly Payment:</strong> $${monthlyPayment.toFixed(2)}</p>
            <p><strong>Total Payment:</strong> $${totalPayment.toFixed(2)}</p>
            <p><strong>Total Interest Paid:</strong> $${totalInterest.toFixed(2)}</p>
        `;
        loanResults.innerHTML = detailsHTML;

        // Animate the results section
        setTimeout(() => {
            document.getElementById('loan-results').classList.add('visible');
        }, 50); // Small delay to ensure the DOM updates
    }
});