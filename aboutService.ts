
import { API_BASE_URL } from "./constants";
import { AboutInfo } from "./types";

export const fetchAboutInfo = async (): Promise<AboutInfo | null> => {
  try {
    const response = await fetch(`${API_BASE_URL}/about`);
    if (response.ok) {
      return await response.json();
    }
    return null;
  } catch (error) {
    console.error("Error fetching about info:", error);
    return null;
  }
};

export const updateAboutInfo = async (info: AboutInfo): Promise<AboutInfo | null> => {
  try {
    const response = await fetch(`${API_BASE_URL}/about`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(info),
    });

    if (response.ok) {
      return await response.json();
    }
    return null;
  } catch (error) {
    console.error("Error updating about info:", error);
    return null;
  }
};
