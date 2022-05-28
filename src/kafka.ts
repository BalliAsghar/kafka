import { Kafka, logLevel } from "kafkajs";

const kafka = new Kafka({
  clientId: "my-app",
  brokers: ["localhost:9092"],
  logLevel: logLevel.ERROR,
});

export default kafka;
