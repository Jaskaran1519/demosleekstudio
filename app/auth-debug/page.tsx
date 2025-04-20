"use client";

import { useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";

export default function AuthDebugPage() {
  const { data: session, status, update } = useSession();
  const [apiResult, setApiResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [dbUserInfo, setDbUserInfo] = useState<any>(null);
  const [showAccountLinking, setShowAccountLinking] = useState(false);
  const [providerId, setProviderId] = useState("google");
  const [providerType, setProviderType] = useState("oauth");
  const [providerAccountId, setProviderAccountId] = useState("");
  const [linkingResult, setLinkingResult] = useState<any>(null);

  const fetchDebugInfo = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/auth/debug");
      const data = await res.json();
      setApiResult(data);
    } catch (error) {
      console.error("Error fetching debug info:", error);
      setMessage("Error fetching debug info");
    } finally {
      setLoading(false);
    }
  };

  const makeAdmin = async () => {
    try {
      setLoading(true);
      setMessage("Making user admin...");
      const res = await fetch("/api/auth/make-admin");
      const data = await res.json();
      
      if (data.success) {
        setMessage("You are now an admin! Please sign out and sign back in.");
        // Update the session
        update();
      } else {
        setMessage(data.error || "Failed to make admin");
      }
    } catch (error) {
      console.error("Error making admin:", error);
      setMessage("Error making admin");
    } finally {
      setLoading(false);
    }
  };

  const refreshSession = async () => {
    setMessage("Refreshing session...");
    await update();
    setMessage("Session refreshed. Check the updated values.");
  };

  const resetAuth = async () => {
    try {
      setLoading(true);
      setMessage("Resetting authentication...");
      const res = await fetch("/api/auth/reset-auth");
      const data = await res.json();
      
      setMessage("Authentication reset. Please refresh the page or navigate to another page.");
      setTimeout(() => {
        window.location.href = "/";
      }, 2000);
    } catch (error) {
      console.error("Error resetting auth:", error);
      setMessage("Error resetting authentication");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (status === "authenticated" && session?.user?.email) {
      checkDatabaseUser(session.user.email);
    }
  }, [status, session]);

  const checkDatabaseUser = async (email: string) => {
    try {
      setLoading(true);
      const res = await fetch(`/api/auth/check-user?email=${encodeURIComponent(email)}`);
      const data = await res.json();
      setDbUserInfo(data.user);
    } catch (error) {
      console.error("Error checking database user:", error);
    } finally {
      setLoading(false);
    }
  };

  const linkAccount = async () => {
    try {
      setLoading(true);
      setMessage("Linking account...");
      const res = await fetch("/api/auth/link-accounts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          providerId,
          providerType,
          providerAccountId,
        }),
      });
      
      const data = await res.json();
      setLinkingResult(data);
      
      if (data.success) {
        setMessage("Account successfully linked. Try signing in with the linked provider now.");
      } else {
        setMessage(data.error || "Failed to link account");
      }
    } catch (error) {
      console.error("Error linking account:", error);
      setMessage("Error linking account");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6">Auth Debug Page</h1>
      
      <div className="mb-6 p-4 border rounded">
        <h2 className="text-xl font-semibold mb-2">Session Status: {status}</h2>
        {status === "authenticated" ? (
          <div>
            <p>Email: {session?.user?.email}</p>
            <p className="font-bold">Role: {session?.user?.role || "Not set"}</p>
            <p>ID: {session?.user?.id || "Not set"}</p>
          </div>
        ) : (
          <p>Not signed in</p>
        )}
      </div>
      
      {dbUserInfo && (
        <div className="mb-6 p-4 border rounded bg-green-50">
          <h2 className="text-xl font-semibold mb-2">Database User:</h2>
          <p>ID: <span className="font-mono">{dbUserInfo.id}</span></p>
          <p className="font-bold">Role: {dbUserInfo.role}</p>
          <p>Email: {dbUserInfo.email}</p>
          <p>Created: {new Date(dbUserInfo.createdAt).toLocaleString()}</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <button
          onClick={fetchDebugInfo}
          disabled={loading}
          className="p-2 bg-blue-500 text-white rounded"
        >
          {loading ? "Loading..." : "Fetch API Debug Info"}
        </button>
        
        <button
          onClick={makeAdmin}
          disabled={loading || status !== "authenticated"}
          className="p-2 bg-purple-500 text-white rounded"
        >
          Make Me Admin
        </button>
        
        <button
          onClick={refreshSession}
          disabled={loading || status !== "authenticated"}
          className="p-2 bg-green-500 text-white rounded"
        >
          Refresh Session
        </button>
        
        <button
          onClick={() => signOut()}
          disabled={loading || status !== "authenticated"}
          className="p-2 bg-red-500 text-white rounded"
        >
          Sign Out
        </button>
        
        <button
          onClick={resetAuth}
          className="p-2 bg-yellow-500 text-white rounded col-span-2"
        >
          ⚠️ Emergency Reset Auth Cookies ⚠️
        </button>
      </div>
      
      {message && (
        <div className="p-3 mb-6 bg-yellow-100 border border-yellow-400 text-yellow-800 rounded">
          {message}
        </div>
      )}
      
      <div className="flex gap-4 mb-6">
        <Link href="/" className="p-2 bg-gray-200 rounded">
          Home
        </Link>
        <Link href="/profile" className="p-2 bg-gray-200 rounded">
          Profile
        </Link>
        <Link href="/admin" className="p-2 bg-gray-200 rounded">
          Admin
        </Link>
      </div>
      
      {apiResult && (
        <div className="mt-6 p-4 border rounded bg-gray-50">
          <h2 className="text-xl font-semibold mb-2">API Debug Info</h2>
          <pre className="overflow-auto p-2 bg-gray-100 rounded">
            {JSON.stringify(apiResult, null, 2)}
          </pre>
        </div>
      )}

      {status === "authenticated" && (
        <div className="mb-6">
          <button
            onClick={() => setShowAccountLinking(!showAccountLinking)}
            className="p-2 bg-indigo-500 text-white rounded mb-4"
          >
            {showAccountLinking ? "Hide" : "Show"} Account Linking
          </button>
          
          {showAccountLinking && (
            <div className="p-4 border rounded">
              <h2 className="text-xl font-semibold mb-4">Link Accounts</h2>
              <p className="mb-4 text-sm text-gray-600">
                This is for advanced users. Use this to manually link your account with a provider.
              </p>
              
              <div className="grid grid-cols-1 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Provider ID</label>
                  <input
                    type="text"
                    value={providerId}
                    onChange={(e) => setProviderId(e.target.value)}
                    className="w-full p-2 border rounded"
                    placeholder="google"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Provider Type</label>
                  <input
                    type="text"
                    value={providerType}
                    onChange={(e) => setProviderType(e.target.value)}
                    className="w-full p-2 border rounded"
                    placeholder="oauth"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Provider Account ID</label>
                  <input
                    type="text"
                    value={providerAccountId}
                    onChange={(e) => setProviderAccountId(e.target.value)}
                    className="w-full p-2 border rounded"
                    placeholder="Your Google ID"
                  />
                </div>
              </div>
              
              <button
                onClick={linkAccount}
                disabled={loading || !providerId || !providerType || !providerAccountId}
                className="p-2 bg-green-500 text-white rounded"
              >
                Link Account
              </button>
              
              {linkingResult && (
                <pre className="mt-4 p-2 bg-gray-100 rounded overflow-auto">
                  {JSON.stringify(linkingResult, null, 2)}
                </pre>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
} 