import dotenv from "dotenv";
dotenv.config({ path: new URL("../.env", import.meta.url) });
import axios from "axios";

const azureTranslatorApiKey = process.env.OCP_APIM_SUBSCRIPTION_KEY;

async function translate(argv, language = "he") {
  const phrase = argv._.join(" ");
  const translateUrl = `https://api.cognitive.microsofttranslator.com/translate?api-version=3.0&to=${language}`;
  let response;
  try {
    response = await axios({
      url: translateUrl,
      data: [{ Text: `${phrase}` }],
      method: "Post",
      headers: { "Ocp-Apim-Subscription-Key": azureTranslatorApiKey, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error(e);
  } finally {
    return response?.data[0].translations[0].text ?? null;
  }
}

export { translate };
