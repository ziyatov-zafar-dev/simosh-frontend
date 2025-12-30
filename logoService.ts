
import { API_BASE_URL } from "./constants";
import { LogoResponse } from "./types";

export const fetchLogo = async (): Promise<string | null> => {
  try {
    const response = await fetch(`${API_BASE_URL}/logo`);
    if (response.ok) {
      const data: LogoResponse = await response.json();
      return data.imgUrl || null;
    }
    return null;
  } catch (error) {
    console.error("Error fetching logo:", error);
    return null;
  }
};

export const uploadLogo = async (file: File): Promise<string | null> => {
  try {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(`${API_BASE_URL}/logo/upload`, {
      method: 'POST',
      body: formData,
    });

    if (response.ok) {
      const data: LogoResponse = await response.json();
      return data.imgUrl;
    }
    return null;
  } catch (error) {
    console.error("Error uploading logo:", error);
    return null;
  }
};
