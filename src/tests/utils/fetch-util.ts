import fetch from "node-fetch-commonjs";
import { removeMissingProperties } from "../../utils/json-util";

export async function getJSON(url: string) {
  const response = await fetch(url, {
    method: "GET", // or "PUT"
    headers: {
      "Content-Type": "application/json",
    },
  });
  return {
    code: response.status,
    data: await response.json(),
  };
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
  const response = await fetch(url, {
    method,
    headers: {
      "Content-Type": "application/json",
    },
    body:
      typeof data === "string"
        ? data
        : JSON.stringify(removeMissingProperties(data || {})),
  });
  return {
    code: response.status,
    data: await response.json(),
  };
}

export async function fetchDelete(url: string) {
  const response = await fetch(url, {
    method: "DELETE",
  });
  return {
    code: response.status,
    data: await response.json(),
  };
}
