// utils/usernameGenerator.ts
export function generateUsername(firstName: string, lastName: string, existingUsernames: string[]): string {
  // Clean the names and create base username
  const cleanFirstName = firstName.toLowerCase().replace(/[^a-z0-9]/g, '');
  const cleanLastName = lastName.toLowerCase().replace(/[^a-z0-9]/g, '');
  
  let baseUsername = `${cleanFirstName}.${cleanLastName}`;
  let username = baseUsername;
  let counter = 1;

  // Check if username exists and add numbers if needed
  while (existingUsernames.includes(username)) {
    username = `${baseUsername}${counter}`;
    counter++;
  }

  return username;
}