import { useState } from "react";
import {
  Code2,
  Sparkles,
  Trash2,
  ShieldCheck,
  Bug,
  TestTube2,
  Brain,
  AlertTriangle,
  CheckCircle2,
  XCircle,
} from "lucide-react";

function App() {
  const [code, setCode] = useState("");
  const [language, setLanguage] = useState("Python");

  const [review, setReview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [context] = useState({
    repository: "TechNova Payments",
    ticket: "PAY-1842 — Add payment validation",
    standards: "OWASP Secure Coding Rules",
    history: "3 similar payment defects",
    tests: "12 related tests",
  });

  const clearCode = () => {
    setCode("");
    setReview(null);
    setError("");
  };

  const reviewCode = async () => {
    if (!code.trim()) return;

    setLoading(true);
    setError("");
    setReview(null);

    try {
      const response = await fetch("http://localhost:8000/review", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          code,
          language,
          context,
        }),
      });

      const result = await response.json();

      if (!response.ok || result.error) {
        throw new Error(result.error || "Review failed");
      }

      setReview(result);
    } catch (err) {
      console.error(err);
      setError(err.message || "Unable to connect to AI review engine.");
    } finally {
      setLoading(false);
    }
  };

  const getSeverityColor = (severity) => {
    switch (severity?.toUpperCase()) {
      case "CRITICAL":
        return "text-red-600";
      case "HIGH":
        return "text-orange-600";
      case "MEDIUM":
        return "text-yellow-600";
      case "LOW":
        return "text-emerald-600";
      default:
        return "text-gray-500";
    }
  };

  const getCategoryIcon = (category) => {
    switch (category?.toLowerCase()) {
      case "security":
        return <ShieldCheck className="h-5 w-5 text-red-500" />;

      case "logic":
        return <Bug className="h-5 w-5 text-orange-500" />;

      case "quality":
        return <Code2 className="h-5 w-5 text-violet-600" />;

      default:
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
    }
  };

  const getDecisionText = () => {
    if (review?.decision === "BLOCK") {
      return "BLOCK PR";
    }

    if (review?.decision === "REQUEST_CHANGES") {
      return "REQUEST CHANGES";
    }

    return "APPROVE PR";
  };

  const getDecisionClass = () => {
    if (review?.decision === "BLOCK") {
      return "bg-red-600 hover:bg-red-700";
    }

    if (review?.decision === "REQUEST_CHANGES") {
      return "bg-orange-500 hover:bg-orange-600";
    }

    return "bg-emerald-600 hover:bg-emerald-700";
  };

  return (
    <div className="min-h-screen bg-[#f7f8fc] text-gray-900">

      {/* ====================================================== */}
      {/* HEADER */}
      {/* ====================================================== */}

      <header className="border-b border-gray-200 bg-white shadow-sm">
        <div className="mx-auto flex max-w-[1500px] items-center justify-between px-8 py-5">

          <div className="flex items-center gap-3">

            <div className="rounded-xl bg-violet-100 p-2">
              <Brain className="h-6 w-6 text-violet-600" />
            </div>

            <div>
              <h1 className="text-lg font-bold tracking-wide text-gray-900">
                TECHNOVA
              </h1>

              <p className="text-xs text-gray-500">
                Intelligent SDLC Quality Engine
              </p>
            </div>

          </div>

          <div className="flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2">

            <span className="h-2 w-2 rounded-full bg-emerald-500"></span>

            <span className="text-xs font-medium text-emerald-600">
              AI ENGINE ACTIVE
            </span>

          </div>

        </div>
      </header>


      {/* ====================================================== */}
      {/* MAIN */}
      {/* ====================================================== */}

      <main className="mx-auto max-w-[1500px] px-8 py-8">

        {/* ================================================== */}
        {/* TITLE */}
        {/* ================================================== */}

        <div className="mb-6">

          <h2 className="text-2xl font-semibold text-gray-900">
            AI-Driven Code Review
          </h2>

          <p className="mt-2 text-sm text-gray-500">
            Analyze any code for quality, security, logic and production risk.
          </p>

        </div>


        {/* ================================================== */}
        {/* PAGE GRID */}
        {/* ================================================== */}

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">


          {/* ====================================================== */}
          {/* CONTEXT ENGINE */}
          {/* ====================================================== */}

          <div className="rounded-2xl border border-violet-200 bg-white p-5 shadow-sm lg:col-span-2">

            <div className="flex items-center gap-3">

              <div className="rounded-lg bg-violet-100 p-2">
                <Brain className="h-5 w-5 text-violet-600" />
              </div>

              <div>

                <p className="text-xs font-semibold uppercase tracking-wider text-violet-600">
                  Context Engine
                </p>

                <p className="text-sm text-gray-500">
                  AI uses engineering context to determine real-world risk
                </p>

              </div>

            </div>


            <div className="mt-5 grid grid-cols-2 gap-4 lg:grid-cols-5">

              {/* Repository */}

              <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">

                <p className="text-xs font-medium text-gray-500">
                  REPOSITORY
                </p>

                <p className="mt-2 text-sm font-medium text-gray-800">
                  {context.repository}
                </p>

              </div>


              {/* Ticket */}

              <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">

                <p className="text-xs font-medium text-gray-500">
                  JIRA / TICKET
                </p>

                <p className="mt-2 text-sm font-medium text-gray-800">
                  {context.ticket}
                </p>

              </div>


              {/* Standards */}

              <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">

                <p className="text-xs font-medium text-gray-500">
                  STANDARDS
                </p>

                <p className="mt-2 text-sm font-medium text-gray-800">
                  {context.standards}
                </p>

              </div>


              {/* History */}

              <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">

                <p className="text-xs font-medium text-gray-500">
                  CODE HISTORY
                </p>

                <p className="mt-2 text-sm font-medium text-gray-800">
                  {context.history}
                </p>

              </div>


              {/* Tests */}

              <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">

                <p className="text-xs font-medium text-gray-500">
                  TEST COVERAGE
                </p>

                <p className="mt-2 text-sm font-medium text-gray-800">
                  {context.tests}
                </p>

              </div>

            </div>

          </div>


          {/* ====================================================== */}
          {/* CODE INPUT */}
          {/* ====================================================== */}

          <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">

            {/* Code Header */}

            <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4">

              <div className="flex items-center gap-4">

                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Code Input
                  </p>
                </div>


                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-700 outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100"
                >
                  <option>Python</option>
                  <option>JavaScript</option>
                  <option>TypeScript</option>
                  <option>Java</option>
                  <option>C#</option>
                  <option>SQL</option>
                </select>

              </div>


              <button
                onClick={clearCode}
                className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-gray-500 transition hover:bg-gray-100 hover:text-gray-800"
              >

                <Trash2 className="h-4 w-4" />

                Clear

              </button>

            </div>


            {/* Text Area */}

            <div className="p-5">

              <textarea
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder={`Paste your ${language} code here...`}
                spellCheck="false"
                className="min-h-[500px] w-full resize-none rounded-xl border border-gray-200 bg-gray-50 p-5 font-mono text-sm leading-7 text-gray-800 outline-none transition placeholder:text-gray-400 focus:border-violet-400 focus:bg-white focus:ring-2 focus:ring-violet-100"
              />

            </div>


            {/* Review Button */}

            <div className="flex items-center justify-between border-t border-gray-200 px-5 py-4">

              <div className="text-xs text-gray-500">
                {code.length} characters
              </div>


              <button
                onClick={reviewCode}
                disabled={!code.trim() || loading}
                className="flex items-center gap-2 rounded-xl bg-violet-600 px-7 py-3 font-semibold text-white shadow-sm transition hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-40"
              >

                <Sparkles className="h-5 w-5" />

                {loading ? "ANALYZING..." : "REVIEW CODE"}

              </button>

            </div>

          </section>


          {/* ====================================================== */}
          {/* AI REVIEW RESULT */}
          {/* ====================================================== */}

          <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">

            {/* Result Header */}

            <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4">

              <div>

                <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                  AI Review Result
                </p>

                <h3 className="mt-1 font-semibold text-gray-900">
                  Intelligent Analysis
                </h3>

              </div>


              {review && (
                <span className="flex items-center gap-2 text-xs font-medium text-emerald-600">

                  <CheckCircle2 className="h-4 w-4" />

                  Analysis complete

                </span>
              )}

            </div>


            {/* ================================================== */}
            {/* EMPTY STATE */}
            {/* ================================================== */}

            {!review && !loading && !error && (

              <div className="flex min-h-[550px] flex-col items-center justify-center px-8 text-center">

                <div className="mb-5 rounded-full bg-violet-100 p-5">

                  <Brain className="h-10 w-10 text-violet-600" />

                </div>

                <h3 className="text-xl font-semibold text-gray-900">
                  Ready to Review
                </h3>

                <p className="mt-2 max-w-md text-sm leading-6 text-gray-500">

                  Paste your code and click Review Code.
                  The AI will identify risks, explain issues,
                  recommend fixes and suggest tests.

                </p>

              </div>

            )}


            {/* ================================================== */}
            {/* LOADING */}
            {/* ================================================== */}

            {loading && (

              <div className="flex min-h-[550px] flex-col items-center justify-center">

                <div className="h-12 w-12 animate-spin rounded-full border-4 border-gray-200 border-t-violet-600"></div>

                <p className="mt-5 text-sm text-gray-600">
                  AI is analyzing your code...
                </p>

                <p className="mt-2 text-xs text-gray-400">
                  Checking security, logic and quality
                </p>

              </div>

            )}


            {/* ================================================== */}
            {/* ERROR */}
            {/* ================================================== */}

            {error && (

              <div className="p-6">

                <div className="rounded-xl border border-red-200 bg-red-50 p-5">

                  <div className="flex items-center gap-3">

                    <XCircle className="h-5 w-5 text-red-500" />

                    <p className="font-semibold text-red-600">
                      Review Failed
                    </p>

                  </div>

                  <p className="mt-3 text-sm text-red-700">
                    {error}
                  </p>

                </div>

              </div>

            )}


            {/* ================================================== */}
            {/* RESULTS */}
            {/* ================================================== */}

            {review && (

              <div className="max-h-[650px] overflow-y-auto p-6">


                {/* RISK HEADER */}

                <div className="rounded-xl border border-gray-200 bg-gray-50 p-5">

                  <div className="flex items-center justify-between">

                    <div>

                      <p className="text-xs font-medium uppercase tracking-wider text-gray-500">
                        Overall Risk
                      </p>

                      <p
                        className={`mt-1 text-lg font-bold ${getSeverityColor(
                          review.severity
                        )}`}
                      >
                        {review.severity}
                      </p>

                    </div>


                    <div className="text-right">

                      <p className="text-4xl font-bold text-gray-900">
                        {review.risk_score}
                      </p>

                      <p className="text-xs text-gray-500">
                        / 100
                      </p>

                    </div>

                  </div>


                  {/* Risk Bar */}

                  <div className="mt-4 h-2 overflow-hidden rounded-full bg-gray-200">

                    <div
                      className="h-full rounded-full bg-violet-600 transition-all duration-700"
                      style={{
                        width: `${Math.min(
                          Math.max(review.risk_score || 0, 0),
                          100
                        )}%`,
                      }}
                    />

                  </div>

                </div>


                {/* SUMMARY */}

                <div className="mt-5 rounded-xl border border-violet-200 bg-violet-50 p-5">

                  <div className="flex items-center gap-2">

                    <Brain className="h-5 w-5 text-violet-600" />

                    <p className="font-semibold text-gray-900">
                      AI Assessment
                    </p>

                  </div>

                  <p className="mt-3 text-sm leading-6 text-gray-600">
                    {review.summary}
                  </p>

                </div>


                {/* FINDINGS */}

                <div className="mt-5">

                  <div className="mb-3 flex items-center justify-between">

                    <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                      Findings
                    </p>

                    <span className="text-xs text-gray-400">
                      {review.findings?.length || 0} issues detected
                    </span>

                  </div>


                  <div className="space-y-3">

                    {review.findings?.map((finding, index) => (

                      <div
                        key={index}
                        className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm"
                      >

                        {/* Finding Header */}

                        <div className="flex items-start justify-between">

                          <div className="flex items-center gap-3">

                            {getCategoryIcon(finding.category)}

                            <div>

                              <p className="text-xs font-medium uppercase tracking-wider text-gray-500">
                                {finding.category}
                              </p>

                              <p className="mt-1 font-semibold text-gray-900">
                                {finding.issue}
                              </p>

                            </div>

                          </div>


                          <span
                            className={`text-xs font-bold ${getSeverityColor(
                              finding.severity
                            )}`}
                          >
                            {finding.severity}
                          </span>

                        </div>


                        {/* WHY */}

                        <div className="mt-5">

                          <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                            Why?
                          </p>

                          <p className="mt-2 text-sm leading-6 text-gray-600">
                            {finding.explanation}
                          </p>

                        </div>


                        {/* IMPACT */}

                        <div className="mt-4">

                          <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                            Potential Impact
                          </p>

                          <p className="mt-2 text-sm leading-6 text-gray-600">
                            {finding.impact}
                          </p>

                        </div>


                        {/* RECOMMENDATION */}

                        <div className="mt-4 rounded-lg border border-emerald-100 bg-emerald-50 p-4">

                          <p className="text-xs font-semibold uppercase tracking-wider text-emerald-600">
                            Recommended Fix
                          </p>

                          <p className="mt-2 text-sm leading-6 text-gray-700">
                            {finding.recommendation}
                          </p>

                        </div>


                        {/* TEST */}

                        <div className="mt-4 flex items-start gap-3">

                          <TestTube2 className="mt-1 h-4 w-4 text-violet-600" />

                          <div>

                            <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                              Suggested Test
                            </p>

                            <p className="mt-1 font-mono text-sm text-gray-700">
                              {finding.test}
                            </p>

                          </div>

                        </div>

                      </div>

                    ))}

                  </div>

                </div>


                {/* ================================================== */}
                {/* DECISION */}
                {/* ================================================== */}

                <div className="mt-6">

                  <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-gray-500">
                    AI Recommendation
                  </p>


                  <button
                    className={`flex w-full items-center justify-center gap-2 rounded-xl py-3 text-sm font-semibold text-white shadow-sm transition ${getDecisionClass()}`}
                  >

                    {review.decision === "BLOCK" ? (
                      <XCircle className="h-4 w-4" />
                    ) : (
                      <CheckCircle2 className="h-4 w-4" />
                    )}

                    {getDecisionText()}

                  </button>

                </div>

              </div>

            )}

          </section>

        </div>

      </main>

    </div>
  );
}

export default App;