export async function fetchDoctor() {
  const url = "https://6913645df34a2ff1170bd0d7.mockapi.io/doctors";

  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error("Failed to fetch data");

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching doctor data:", error);
    return [];
  }
}
