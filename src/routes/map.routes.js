const express = require("express");
const Map = require("../models/map.model");

const router = express.Router();

// GET /map - 모든 맵 데이터 조회
router.get("/", async (req, res) => {
    try {
      const mapData = await Map.find().limit(5); // MongoDB의 map 컬렉션에서 모든 데이터 조회
      console.log(mapData);
      res.status(200).json(mapData);
    } catch (err) {
      console.error("Error fetching map data:", err);
      res.status(500).json({ success: false, error: "Failed to fetch map data" });
    }
  });

  module.exports = router;