import dotenv from "dotenv";
dotenv.config({ path: new URL("../.env", import.meta.url) });
import axios from "axios";

const azureTranslatorApiKey = process.env.OCP_APIM_SUBSCRIPTION_KEY;
const azureCognitivePrefixURL = "https://api.cognitive.microsofttranslator.com";

async function detect(phrase) {
  const detectUrl = `${azureCognitivePrefixURL}/Detect?api-version=3.0`;
  let response;
  try {
    response = await axios(buildRequest(detectUrl, phrase));
  } catch (e) {
    console.error(e);
  } finally {
    return parseDetectResponse(response);
  }
}

async function translate(argv) {
  const phrase = argv._.join(" ");
  const detectedLanguage = await detect(phrase);
  const translateToLanguage = detectedLanguage === "en" ? "he" : "en";
  const translateUrl = `${azureCognitivePrefixURL}/translate?api-version=3.0&to=${translateToLanguage}`;
  let response;
  try {
    response = await axios(buildRequest(translateUrl, phrase));
  } catch (e) {
    console.error(e);
  } finally {
    return parseTranslateResponse(phrase, response);
  }
}

const parseDetectResponse = (response) => response?.data[0]?.language ?? "en";

const parseTranslateResponse = (phrase, response) => {
  const translatedPhrase = response?.data[0].translations[0].text;
  const defaultResponse = `Can't find a translation to the input: ${phrase}`;
  return translatedPhrase && translatedPhrase !== phrase ? translatedPhrase : defaultResponse;
};

const buildRequest = (url, phrase) => ({
  url,
  data: [{ Text: `${phrase}` }],
  method: "Post",
  headers: { "Ocp-Apim-Subscription-Key": azureTranslatorApiKey, "Content-Type": "application/json" },
});

export { translate };
