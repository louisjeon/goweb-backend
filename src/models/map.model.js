const mongoose = require("mongoose");

const MapSchema = new mongoose.Schema(
  {
    title: { type: String, required: true }, // 장소 제목
    coordinates: [
      {
        x: { type: String, required: true }, // 위도
        y: { type: String, required: true }, // 경도
      },
    ],
  },
  {
    timestamps: true, // 생성 및 수정 시간 기록
    collection: "map", // MongoDB의 컬렉션 이름을 명시적으로 지정
  }
);

module.exports = mongoose.model("Map", MapSchema);
