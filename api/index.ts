import express, { Request, Response } from "express";
import axios from "axios";


const app = express();
app.use(express.json());

app.get("/", (_req: Request, res: Response) => res.send("Express on Vercel"));

app.post("/api/zapier-webhook", async (req: Request, res: Response) => {
  const { data } = req.body;

  try {
    const response = await axios.post(
      "https://hooks.zapier.com/hooks/catch/4525203/21zk4op/",
      data
    );

    console.log("response", response.data);

    if (response.data.status === "success") {
      res.status(200).json({ status: "Success" });
    } else {
      res.status(400).json({ status: "Bad Request" });
    }
  } catch (error) {
    console.error(error);
    res.status(400).json({ status: "error" });
  }
});

app.post("/api/solarcopilot", async (req: Request, res: Response) => {
  const { data } = req.body;

  const postToSolarCopilot = async (data: any) => {
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
    res.status(200).json({ status: "Success", data: response.data });
  } catch (error) {
    console.error("Error posting to SolarCopilot:", error);
    res.status(500).json({ status: "Internal Server Error" });
  }
});

app.listen(3000, () => console.log("Server ready on port 3000."));

export default app;
