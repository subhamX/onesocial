import { Client } from "redis-om";

const dbClientWithoutConnect = new Client();

export { dbClientWithoutConnect };
