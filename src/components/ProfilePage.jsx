"use client";

import React, { useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function ProfilePage() {
  const [certType, setCertType] = useState("CPR");
  const [file, setFile] = useState(null);
  const [msg, setMsg] = useState("");
  const [uploading, setUploading] = useState(false);
  const [loadingList, setLoadingList] = useState(true);
  const [submissions, setSubmissions] = useState([]);
  const [fileInputKey, setFileInputKey] = useState(0);

  const fileLabel = useMemo(() => {
    if (!file) return "No file selected";
    const sizeKB = Math.round(file.size / 1024);
    return `${file.name} (${sizeKB} KB)`;
  }, [file]);

  async function fetchSubmissions() {
    setLoadingList(true);

    const { data: userData } = await supabase.auth.getUser();
    const user = userData?.user;

    if (!user) {
      setSubmissions([]);
      setLoadingList(false);
      return;
    }

    const { data, error } = await supabase
      .from("responder_verifications")
      .select(
        "id, cert_type, status, submitted_at, reviewed_at, cert_file_path"
      )
      .eq("user_id", user.id)
      .order("submitted_at", { ascending: false });

    if (!error) setSubmissions(data || []);
    setLoadingList(false);
  }

  useEffect(() => {
    fetchSubmissions();
  }, []);

  function handleFileChange(e) {
    const f = e.target.files?.[0];
    setFile(f || null);
    setMsg(f ? `Selected: ${f.name}` : "");
  }

  function clearFile() {
    setFile(null);
    setMsg("");
    setFileInputKey((k) => k + 1);
  }

  async function handleUpload() {
    setMsg("");

    if (!file) {
      setMsg("Please choose a file first.");
      return;
    }

    setUploading(true);

    const { data: userData, error: userErr } = await supabase.auth.getUser();
    if (userErr || !userData.user) {
      setUploading(false);
      setMsg("Not logged in. Please log in again.");
      return;
    }
    const user = userData.user;

    const cleanName = file.name.replace(/\s+/g, "_");
    const path = `${user.id}/${certType}/${Date.now()}-${cleanName}`;

    const { error: uploadErr } = await supabase.storage
      .from("certs")
      .upload(path, file, { upsert: false });

    if (uploadErr) {
      setUploading(false);
      setMsg("Upload failed: " + uploadErr.message);
      return;
    }

    const { error: insertErr } = await supabase
      .from("responder_verifications")
      .insert({
        user_id: user.id,
        cert_type: certType,
        cert_file_path: path,
      });

    setUploading(false);

    if (insertErr) {
      setMsg("Uploaded file, but DB insert failed: " + insertErr.message);
      return;
    }

    setMsg(`Uploaded! Status: pending verification (${certType})`);

    clearFile();
    await fetchSubmissions();
  }

  function badgeStyle(status) {
    const base = {
      display: "inline-flex",
      alignItems: "center",
      gap: 6,
      padding: "4px 10px",
      borderRadius: 999,
      fontSize: 12,
      fontWeight: 700,
      border: "1px solid #e6e6e6",
      background: "#fafafa",
      whiteSpace: "nowrap",
    };

    if (status === "approved")
      return { ...base, borderColor: "#bfe7c7", background: "#eefaf1" };
    if (status === "rejected")
      return { ...base, borderColor: "#f2c1c1", background: "#fdeeee" };
    return { ...base, borderColor: "#f0e3b3", background: "#fff8e3" };
  }

  function statusText(status) {
    if (status === "approved") return "✅ Approved";
    if (status === "rejected") return "❌ Rejected";
    return "⏳ Pending";
  }

  return (
    <div style={{ maxWidth: 560, margin: "110px auto", padding: 16 }}>
      <div
        style={{
          border: "1px solid #e5e5e5",
          borderRadius: 18,
          padding: 22,
          background: "white",
          boxShadow: "0 10px 30px rgba(0,0,0,0.06)",
        }}
      >
        <h1 style={{ fontSize: 30, fontWeight: 900, margin: 0 }}>Account</h1>
        <p style={{ opacity: 0.8, marginTop: 6 }}>
          Upload your certificates (CPR / AED / FFC / FSM)
        </p>

        {/* Upload section */}
        <div style={{ marginTop: 18, display: "grid", gap: 14 }}>
          {/* Certificate Type */}
          <label style={{ display: "grid", gap: 6 }}>
            Certificate type
            <div
              style={{
                position: "relative",
                border: "1px solid #ddd",
                borderRadius: 12,
                background: "#fff",
                padding: "0 12px",
                height: 44,
                display: "flex",
                alignItems: "center",
              }}
            >
              <select
                value={certType}
                onChange={(e) => setCertType(e.target.value)}
                style={{
                  width: "100%",
                  height: "100%",
                  border: "none",
                  outline: "none",
                  background: "transparent",
                  fontSize: 16,
                  appearance: "none",
                  WebkitAppearance: "none",
                  MozAppearance: "none",
                  paddingRight: 30,
                }}
              >
                <option value="CPR">CPR</option>
                <option value="AED">AED</option>
                <option value="FFC">FFC (Fire Fighter Course)</option>
                <option value="FSM">FSM (Fire Safety Management)</option>
              </select>

              <span
                style={{
                  position: "absolute",
                  right: 12,
                  pointerEvents: "none",
                  fontSize: 14,
                  opacity: 0.7,
                }}
              >
                ▼
              </span>
            </div>
          </label>

          {/* Custom File Picker Box */}
          <div style={{ display: "grid", gap: 6 }}>
            <div style={{ fontSize: 14, fontWeight: 600 }}>
              Upload file (PDF/JPG/PNG)
            </div>

            <div
              style={{
                border: "1px dashed #cfcfcf",
                borderRadius: 14,
                padding: 14,
                background: "#fafafa",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 12,
              }}
            >
              <div style={{ display: "grid", gap: 4 }}>
                <div style={{ fontWeight: 800 }}>
                  {file ? "Ready to upload" : "Choose a file"}
                </div>
                <div style={{ fontSize: 13, opacity: 0.8 }}>{fileLabel}</div>
              </div>

              <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                <label
                  style={{
                    border: "1px solid #111",
                    borderRadius: 12,
                    padding: "10px 12px",
                    fontWeight: 800,
                    cursor: "pointer",
                    background: "#fff",
                    whiteSpace: "nowrap",
                  }}
                >
                  Browse
                  <input
                    key={fileInputKey}
                    type="file"
                    accept=".pdf,.png,.jpg,.jpeg"
                    onChange={handleFileChange}
                    style={{ display: "none" }}
                  />
                </label>

                <button
                  type="button"
                  onClick={clearFile}
                  disabled={!file || uploading}
                  style={{
                    border: "1px solid #e0e0e0",
                    borderRadius: 12,
                    padding: "10px 12px",
                    fontWeight: 800,
                    cursor: !file || uploading ? "not-allowed" : "pointer",
                    background: "#fff",
                    opacity: !file || uploading ? 0.6 : 1,
                    whiteSpace: "nowrap",
                  }}
                >
                  Clear
                </button>
              </div>
            </div>
          </div>

          {/* Upload Button */}
          <button
            type="button"
            onClick={handleUpload}
            disabled={uploading}
            style={{
              padding: 12,
              borderRadius: 12,
              fontWeight: 900,
              cursor: uploading ? "not-allowed" : "pointer",
              opacity: uploading ? 0.7 : 1,
              border: "1px solid #111",
              background: "#fff",
            }}
          >
            {uploading ? "Uploading..." : "Upload certificate"}
          </button>

          {/* Message */}
          <div style={{ minHeight: 20, fontSize: 14, opacity: 0.9 }}>{msg}</div>
        </div>

        {/* Submissions list */}
        <div style={{ marginTop: 22 }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <h2 style={{ fontSize: 18, margin: 0 }}>Your submissions</h2>
            <button
              type="button"
              onClick={fetchSubmissions}
              style={{
                border: "1px solid #e0e0e0",
                background: "#fff",
                borderRadius: 10,
                padding: "8px 10px",
                cursor: "pointer",
                fontWeight: 800,
              }}
            >
              Refresh
            </button>
          </div>

          {loadingList ? (
            <p style={{ marginTop: 10, opacity: 0.8 }}>Loading…</p>
          ) : submissions.length === 0 ? (
            <p style={{ marginTop: 10, opacity: 0.8 }}>No submissions yet.</p>
          ) : (
            <div style={{ marginTop: 10, display: "grid", gap: 10 }}>
              {submissions.map((s) => (
                <div
                  key={s.id}
                  style={{
                    border: "1px solid #eee",
                    borderRadius: 14,
                    padding: 12,
                    background: "#fff",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    gap: 12,
                  }}
                >
                  <div style={{ display: "grid", gap: 4 }}>
                    <div style={{ fontWeight: 900 }}>{s.cert_type}</div>
                    <div style={{ fontSize: 12, opacity: 0.75 }}>
                      Submitted:{" "}
                      {s.submitted_at
                        ? new Date(s.submitted_at).toLocaleString()
                        : "-"}
                    </div>
                  </div>

                  <span style={badgeStyle(s.status)}>
                    {statusText(s.status)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
