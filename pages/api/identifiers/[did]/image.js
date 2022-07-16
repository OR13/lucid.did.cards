import QRCodeService from "../../../../services/QRCode";

const sharp = require("sharp");

export default async function handler(req, res) {
  const { did } = req.query;
  const image = await QRCodeService.didToImage(did);
  const content = Buffer.from(
    image.split("data:image/png;base64,").pop(),
    "base64"
  );
  const cropped = await sharp(content)
    .extract({
      width: 532,
      height: 230,
      left: 0,
      top: 150,
    })
    .toBuffer();
  res.status(200);
  res.setHeader("Content-Type", "image/png");
  res.send(cropped);
}
