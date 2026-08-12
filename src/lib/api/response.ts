import { NextResponse } from "next/server";

export function jsonOk<T>(data: T, status = 200) {
  return NextResponse.json({ success: true, data }, { status });
}

export function jsonError(message: string, status = 400) {
  return NextResponse.json({ success: false, error: message }, { status });
}

export function jsonUnauthorized(message = "Authentication required") {
  return jsonError(message, 401);
}

export function jsonForbidden(message = "You do not have permission to perform this action") {
  return jsonError(message, 403);
}

export function jsonNotFound(message = "Resource not found") {
  return jsonError(message, 404);
}

export function jsonServerError(message = "Something went wrong. Please try again.") {
  return jsonError(message, 500);
}
