import express, { Request, Response } from "express";
import axios from "axios";

const app = express();
app.use(express.json());

app.get("/", (_req: Request, res: Response) => res.send("Express on Vercel"));

app.post("/api/zapier-webhook", async (req: Request, res: Response) => {
  console.log("[Zapier Webhook] Received request body:", JSON.stringify(req.body, null, 2));
  const { data } = req.body;

  try {
    console.log("[Zapier Webhook] Sending data to Zapier:", JSON.stringify(data, null, 2));
    const response = await axios.post(
      "https://hooks.zapier.com/hooks/catch/4525203/21zk4op/",
      data
    );

    console.log("[Zapier Webhook] Zapier response:", JSON.stringify(response.data, null, 2));

    if (response.data.status === "success") {
      console.log("[Zapier Webhook] Request successful");
      res.status(200).json({ status: "Success" });
    } else {
      console.log("[Zapier Webhook] Request failed with status:", response.data.status);
      res.status(400).json({ status: "Bad Request" });
    }
  } catch (error) {
    console.error("[Zapier Webhook] Error:", error);
    res.status(400).json({ status: "error" });
  }
});

app.post("/api/solarcopilot", async (req: Request, res: Response) => {
  console.log("[SolarCopilot] Received request body:", JSON.stringify(req.body, null, 2));
  const { data } = req.body;

  const postToSolarCopilot = async (data: any) => {
    console.log("[SolarCopilot] Sending data to SolarCopilot:", JSON.stringify(data, null, 2));
    return await axios.post(
      `https://solarcopilot.leadbyte.co.uk/restapi/v1.3/leads`,
      data,
      {
        headers: {
          "X-KEY": "7644d21b4597db181c55097f72c1eaa9",
        },
      }
    );
  };

  try {
    const response = await postToSolarCopilot(data);
    console.log("[SolarCopilot] Response received:", JSON.stringify(response.data, null, 2));
    res.status(200).json({ status: "Success", data: response.data });
  } catch (error) {
    console.error("[SolarCopilot] Error posting to SolarCopilot:", error);
    res.status(500).json({ status: "Internal Server Error" });
  }
});

app.listen(3000, () => console.log("[Server] Ready on port 3000"));

export default app;
