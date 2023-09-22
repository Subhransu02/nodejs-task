import fetch from "node-fetch";
import mongoose from "mongoose";
import express, { response } from "express";
import axios from "axios";

const app = express();
import cors from 'cors';
app.use(cors());
const port = 3003;

mongoose.connect("mongodb://127.0.0.1:27017/PMS");
const postSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  last: {
    type: Number,
    required: true,
  },
  buy: {
    type: Number,
    required: true,
  },
  sell: {
    type: Number,
    required: true,
  },
  volume: {
    type: Number,
    required: true,
  },
  base_unit: {
    type: String,
    required: true,
  },
});

const Post = mongoose.model("Post", postSchema);

async function getPosts() {
  const response = await fetch("https://api.wazirx.com/api/v2/tickers");
  let data = await response.json();
  data = [...Object.values(data)];
  data = data.slice(0, 10);
  // console.log(data);
  try {
    for (let i = 0; i < 10; i++) {
      const post = new Post({
        name: data[i].name,
        last: data[i].last,
        buy: data[i].buy,
        sell: data[i].sell,
        volume: data[i].volume,
        base_unit: data[i].base_unit,
      });
      await post.save();
    }
  } catch (error) {
    console.log(error);
  }
  return data;
}

app.get("/api/v2/tickers", async (req, res) => {
  try {
    const posts = await getPosts();
    res.send(posts);
  } catch (error) {
    res.send(error);
  }
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

export default app;
