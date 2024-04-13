import fetch from "node-fetch-commonjs";
import { removeMissingProperties } from "../utils/json-util";

export async function getJSON(url: string) {
  try {
    const response = await fetch(url, {
      method: "GET", // or "PUT"
      headers: {
        "Content-Type": "application/json",
      },
    });
    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Error:", error);
    return { error: "Unknown error" };
  }
}

export async function postJSON(url: string, data: string | any) {
  return _postPutJSON(url, data, "POST");
}

export async function putJSON(url: string, data: string | any) {
  return _postPutJSON(url, data, "PUT");
}

async function _postPutJSON(
  url: string,
  data: string | any,
  method: "POST" | "PUT"
) {
  data = data || {};
  try {
    const response = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
      },
      body:
        typeof data === "string"
          ? data
          : JSON.stringify(removeMissingProperties(data)),
    });
    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Error:", error);
    return { error: "Unknown error" };
  }
}

export async function fetchDelete(url: string) {
  try {
    const response = await fetch(url, {
      method: "DELETE",
    });
    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Error:", error);
    return { error: "Unknown error" };
  }
}
