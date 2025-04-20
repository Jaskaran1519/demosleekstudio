import { NextResponse } from "next/server";

export async function GET() {
  // Create a response that will clear the auth token
  const response = NextResponse.json({
    success: true,
    message: "Auth cookies have been cleared"
  });
  
  // Clear all the cookies related to auth
  response.cookies.delete("next-auth.session-token");
  response.cookies.delete("next-auth.callback-url");
  response.cookies.delete("next-auth.csrf-token");
  
  return response;
} 