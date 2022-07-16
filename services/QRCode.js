import QRCode from "qrcode";
import { deepPurple, grey } from "@mui/material/colors";

const didToImage = async (did) => {
  const image = await QRCode.toDataURL(
    "https://lucid.did.cards/identifiers/" + did,
    {
      errorCorrectionLevel: "H",
      margin: 40,
      color: {
        dark: deepPurple["800"],
        light: grey["200"],
      },
    }
  );
  return image;
};

const didToImageUrl = (did) => {
  return "https://lucid.did.cards/api/identifiers/" + did + "/image";
};

const QRCodeService = { didToImage, didToImageUrl };

export default QRCodeService;
