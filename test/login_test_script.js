(async () => {
  const url = "http://localhost:3030/api/login";
  const data = {
    email: "myspace@surf.net",
    password: "1234",
  };

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      console.error("Request failed:", response.status, await response.text());
    } else {
      const result = await response.json();
      console.log("Login successful:", result);
    }
  } catch (error) {
    console.error("Error during the request:", error);
  }
})();
