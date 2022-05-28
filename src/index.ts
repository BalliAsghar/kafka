import express, { Express, Request, Response } from "express";
import kafka from "./kafka";

const app: Express = express();

app.use(express.json());

app.get("/", (req, res) => res.send("Hello World!"));

app.post("/message", async (req: Request, res: Response) => {
  try {
    const producer = kafka.producer();
    await producer.connect();
    await producer.send({
      topic: "messages",
      messages: [
        {
          value: JSON.stringify(req.body.message),
        },
      ],
    });
  } catch (error) {
    console.log(error);
  }

  return res.sendStatus(200);
});

async function run() {
  try {
    const consumer = kafka.consumer({
      groupId: "node-kafka-consumer-group",
    });

    await consumer.connect();
    await consumer.subscribe({ topic: "messages", fromBeginning: true });

    await consumer.run({
      eachMessage: async ({ message }) => {
        console.log(`Received message ${message.value}`);
      },
    });
  } catch (error) {
    console.log(error);
  }
}

run();

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
