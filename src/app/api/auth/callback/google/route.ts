import { NextResponse } from "next/server";

import { getTokensFromCode } from "../../../../../../lib/gmail-auth";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  if (!code) {
    return NextResponse.json({ error: "No code provided" }, { status: 400 });
  }
  await getTokensFromCode(code);

  //success page
  return new Response(
`
<html>
  <body>
    <p>Successfully connected gmail account</p>
    <p> test gmai api</p>
    <button onclick="testGmailApi()">Test Gmail API</button>
    <script>
      async function testGmailApi() {
        try {
          const response = await fetch("/api/gmail");
          const data = await response.json();
          alert(JSON.stringify(data, null, 2));
        } catch (error) {
          alert("Error calling Gmail API: " + error);
        }
      }
    </script>
  </body>
</html>
`, {
    headers: {
      "Content-Type": "text/html",
    },
  });
}