import argon2 from "argon2";

// Check if a password is provided as a command-line argument
const [, , password] = process.argv;

// Function to hash the password with salt using SHA-256
const hashPasswordWithSalt = async (password: string, salt: string) => {
  const encoder = new TextEncoder();
  const passwordData = encoder.encode(password);
  const saltData = encoder.encode(salt);

  const combinedData = new Uint8Array(passwordData.length + saltData.length);
  combinedData.set(passwordData);
  combinedData.set(saltData, passwordData.length);

  const hashBuffer = await crypto.subtle.digest("SHA-256", combinedData);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((byte) => byte.toString(16).padStart(2, "0")).join("");
};

if (!password) {
  console.error("Please provide a password to hash.");
  process.exit(1);
}

(async () => {
  try {
    const shaPassword = await hashPasswordWithSalt(
      password,
      "BetterStartRunningYourRainbowTableGenerator"
    );
    // Hash the password using argon2
    const hashedPassword = await argon2.hash(shaPassword);

    // Output the hashed password
    console.log(`Hashed Password: ${hashedPassword}`);
  } catch (error) {
    console.error("Error hashing password:", error);
    process.exit(1);
  }
})();
