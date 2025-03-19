document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('scoreForm');
    const resultContainer = document.getElementById('resultContainer');
    const errorContainer = document.getElementById('errorContainer');
    const studentName = document.getElementById('studentName');
    const scoreValue = document.getElementById('scoreValue');
    const errorMessage = document.getElementById('errorMessage');

    form.addEventListener('submit', function(e) {
        e.preventDefault();

        // Hide previous results
        resultContainer.classList.add('d-none');
        errorContainer.classList.add('d-none');

        // Form validation
        if (!form.checkValidity()) {
            e.stopPropagation();
            form.classList.add('was-validated');
            return;
        }

        const formData = new FormData(form);

        fetch('/check_score', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                // Show success result
                studentName.textContent = data.name;
                // Handle null score
                scoreValue.textContent = data.score === null ? "Not Available" : data.score;
                resultContainer.classList.remove('d-none');

                // Add animation class
                resultContainer.style.animation = 'none';
                resultContainer.offsetHeight; // Trigger reflow
                resultContainer.style.animation = null;
            } else {
                // Show error message
                errorMessage.textContent = data.message;
                errorContainer.classList.remove('d-none');

                // Add animation class
                errorContainer.style.animation = 'none';
                errorContainer.offsetHeight; // Trigger reflow
                errorContainer.style.animation = null;
            }
        })
        .catch(error => {
            console.error('Error:', error);
            errorMessage.textContent = 'An error occurred. Please try again later.';
            errorContainer.classList.remove('d-none');
        });
    });

    // Real-time NPM validation
    const npmInput = document.getElementById('npm');
    npmInput.addEventListener('input', function() {
        if (this.value.length > 13) {
            this.value = this.value.slice(0, 13);
        }
    });
});